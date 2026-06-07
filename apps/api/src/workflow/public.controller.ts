import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StepsService } from './steps.service';
import { WorkflowService } from './workflow/workflow.service';
import { StepDto, WorkflowDto } from './dto';

@ApiTags('Public')
@Controller('public')
export class PublicController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly stepsService: StepsService,
  ) {}

  @Get('workflows')
  @ApiOperation({ summary: 'Get all published workflows (public)' })
  @ApiOkResponse({ type: WorkflowDto, isArray: true })
  findAllWorkflows(): Promise<WorkflowDto[]> {
    return this.workflowService.findAll();
  }

  @Get('workflows/:id')
  @ApiOperation({ summary: 'Get a workflow by id (public)' })
  @ApiOkResponse({ type: WorkflowDto })
  async findOneWorkflow(@Param('id') id: string): Promise<WorkflowDto> {
    const workflow = await this.workflowService.findOne(id).catch(() => null);
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
    return workflow;
  }

  @Get('workflows/:id/steps')
  @ApiOperation({ summary: 'Get all steps for a workflow (public)' })
  @ApiOkResponse({ type: StepDto, isArray: true })
  findSteps(@Param('id') id: string): Promise<StepDto[]> {
    return this.stepsService.findByWorkflow(id);
  }
}
