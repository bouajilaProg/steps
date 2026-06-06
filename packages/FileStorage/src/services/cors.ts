import { PutBucketCorsCommand } from '@aws-sdk/client-s3'
import type { S3Client } from '@aws-sdk/client-s3'

export async function setBucketCors(
  client: S3Client,
  bucket: string,
  origins: string[]
): Promise<void> {
  if (origins.length === 0) return

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: origins.map((origin) => ({
          AllowedOrigins: [origin],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3000,
        })),
      },
    })
  )
}
