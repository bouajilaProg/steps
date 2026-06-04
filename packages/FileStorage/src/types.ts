export interface FileStorageConfig {
  endpoint: string
  region: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
}

export interface UploadOptions {
  key: string
  body: Buffer | Uint8Array | Blob | string
  contentType?: string
}

export interface FileMetadata {
  key: string
  size: number
  contentType?: string
  lastModified?: Date
}
