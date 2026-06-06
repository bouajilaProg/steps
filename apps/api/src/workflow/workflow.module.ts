import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowController } from './workflow.controller';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [WorkflowController, StepsController],
  providers: [WorkflowService, StepsService],
})
export class WorkflowModule { }
