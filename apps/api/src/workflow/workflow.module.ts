import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowController } from './workflow.controller';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkflowController, StepsController],
  providers: [WorkflowService, StepsService],
})
export class WorkflowModule {}
