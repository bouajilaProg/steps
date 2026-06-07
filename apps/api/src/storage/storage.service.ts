import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  deleteFile,
  getSignedUploadUrl,
  getSignedUrl,
} from '@steps/file-storage';

@Injectable()
export class StorageService {
  private client: ReturnType<typeof createClient>;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET', 'steps-bucket');
    this.client = createClient({
      endpoint: this.configService.get<string>('S3_ENDPOINT')!,
      region: this.configService.get<string>('S3_REGION', 'eu-west-1'),
      bucket: this.bucket,
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY')!,
    });
  }

  async getUploadUrl(key: string, contentType: string, expiresIn = 3600) {
    return getSignedUploadUrl(
      this.client,
      this.bucket,
      key,
      contentType,
      expiresIn,
    );
  }

  async getReadUrl(key: string, expiresIn = 3600) {
    return getSignedUrl(this.client, this.bucket, key, expiresIn);
  }

  async deleteFile(key: string) {
    return deleteFile(this.client, this.bucket, key);
  }

  async deleteFiles(keys: string[]) {
    await Promise.all([...new Set(keys)].map((key) => this.deleteFile(key)));
  }
}
