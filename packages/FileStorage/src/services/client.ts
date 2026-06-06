import { S3Client } from '@aws-sdk/client-s3'
import type { FileStorageConfig } from '../types'

export function createClient(config: FileStorageConfig): S3Client {
  return new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
    requestChecksumCalculation: 'WHEN_REQUIRED',
  })
}

export function clientFromEnv(): S3Client {
  return createClient({
    endpoint: process.env.S3_ENDPOINT!,
    region: process.env.S3_REGION!,
    bucket: process.env.S3_BUCKET!,
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  })
}

export function getBucket(): string {
  return process.env.S3_BUCKET!
}
