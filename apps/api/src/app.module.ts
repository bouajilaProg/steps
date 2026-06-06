import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { WorkflowModule } from './workflow/workflow.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env', '../../.env'] }), AuthModule, DatabaseModule, StorageModule, WorkflowModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
