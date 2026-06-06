import { resolve } from 'path'
import { execSync } from 'child_process'
import {
  S3Client,
  HeadBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { setBucketCors } from './services/cors'

process.loadEnvFile(resolve(__dirname, '../../../.env'))

const BUCKET = 'steps-bucket'
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID!

function getS3Client(): S3Client {
  return new S3Client({
    endpoint: process.env.S3_ENDPOINT!,
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestChecksumCalculation: 'WHEN_REQUIRED',
  })
}

function garageApi(endpoint: string, payload?: object) {
  const input = payload ? JSON.stringify(payload) : undefined
  const cmd = input
    ? `garage json-api ${endpoint} '${input}'`
    : `garage json-api ${endpoint}`
  const result = execSync(cmd, { encoding: 'utf-8' })
  return JSON.parse(result)
}

async function getOrCreateBucketId(): Promise<string> {
  const buckets = garageApi('ListBuckets') as any[]
  const existing = buckets.find((b) =>
    b.globalAliases?.includes(BUCKET)
  )

  if (existing) {
    console.log(`  Bucket already exists (id: ${existing.id})`)
    return existing.id
  }

  const result = garageApi('CreateBucket', { globalAlias: BUCKET }) as any
  console.log(`  Created bucket (id: ${result.id})`)
  return result.id
}

async function authorizeKeyForBucket(bucketId: string) {
  const result = garageApi('AllowBucketKey', {
    bucketId,
    accessKeyId: ACCESS_KEY_ID,
    permissions: { read: true, write: true, owner: true },
  }) as any

  const key = result.keys?.find((k: any) => k.accessKeyId === ACCESS_KEY_ID)
  if (key) {
    console.log(`  Authorized key "${key.name}" for bucket (owner)`)
  }
}

async function resetBucket(client: S3Client) {
  let truncated = true
  let continuationToken: string | undefined

  while (truncated) {
    const list = await client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken: continuationToken,
      })
    )

    const objects = (list.Contents ?? []).map((item) => ({ Key: item.Key! }))

    if (objects.length > 0) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: objects },
        })
      )
      console.log(`  Deleted ${objects.length} object(s)`)
    }

    truncated = list.IsTruncated ?? false
    continuationToken = list.NextContinuationToken
  }
}

async function main() {
  const client = getS3Client()

  const corsOrigins = (process.env.S3_CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  const bucketExists = await client
    .send(new HeadBucketCommand({ Bucket: BUCKET }))
    .then(() => true)
    .catch(() => false)

  if (!bucketExists) {
    console.log(`Creating bucket "${BUCKET}"...`)
  } else {
    console.log(`Bucket "${BUCKET}" exists`)
  }

  const bucketId = await getOrCreateBucketId()
  await authorizeKeyForBucket(bucketId)

  if (corsOrigins.length > 0) {
    console.log(`Setting CORS for ${corsOrigins.length} origin(s)...`)
    await setBucketCors(client, BUCKET, corsOrigins)
    console.log(`  CORS configured`)
  }

  console.log(`Bucket "${BUCKET}" ready`)
}

main().catch((err) => {
  console.error('Failed to init bucket:', err)
  process.exit(1)
})
