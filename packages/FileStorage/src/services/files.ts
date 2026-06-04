import {
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import type { S3Client } from '@aws-sdk/client-s3'
import type { FileMetadata } from '../types'

export async function deleteFile(
  client: S3Client,
  bucket: string,
  key: string
): Promise<void> {
  await client.send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  )
}

export async function exists(
  client: S3Client,
  bucket: string,
  key: string
): Promise<boolean> {
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key })
    )
    return true
  } catch {
    return false
  }
}

export async function metadata(
  client: S3Client,
  bucket: string,
  key: string
): Promise<FileMetadata | null> {
  try {
    const response = await client.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key })
    )
    return {
      key,
      size: response.ContentLength ?? 0,
      contentType: response.ContentType,
      lastModified: response.LastModified,
    }
  } catch {
    return null
  }
}

export async function list(
  client: S3Client,
  bucket: string,
  prefix?: string
): Promise<FileMetadata[]> {
  const response = await client.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix })
  )

  return (response.Contents ?? []).map((item) => ({
    key: item.Key!,
    size: item.Size ?? 0,
    lastModified: item.LastModified,
  }))
}
