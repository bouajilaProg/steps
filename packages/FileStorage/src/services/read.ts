import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner'
import type { S3Client } from '@aws-sdk/client-s3'

export async function read(
  client: S3Client,
  bucket: string,
  key: string
): Promise<Buffer> {
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  )

  const chunks: Uint8Array[] = []
  const stream = response.Body as AsyncIterable<Uint8Array>
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export async function readStream(
  client: S3Client,
  bucket: string,
  key: string
) {
  const response = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  )
  return response.Body
}

export async function getSignedUrl(
  client: S3Client,
  bucket: string,
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return presign(client, command, { expiresIn })
}
