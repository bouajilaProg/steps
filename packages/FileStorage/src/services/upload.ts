import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner'
import type { S3Client } from '@aws-sdk/client-s3'
import type { UploadOptions } from '../types'

export async function upload(
  client: S3Client,
  bucket: string,
  options: UploadOptions
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    })
  )
  return options.key
}

export async function getSignedUploadUrl(
  client: S3Client,
  bucket: string,
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })
  return presign(client, command, { expiresIn })
}
