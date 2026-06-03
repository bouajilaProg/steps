import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowDto } from './dto';
import { WorkflowService } from './workflow/workflow.service';

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a workflow' })
  @ApiBody({ type: CreateWorkflowDto })
  @ApiOkResponse({ type: WorkflowDto })
  create(@Body() body: CreateWorkflowDto): Promise<WorkflowDto> {
    return this.workflowService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiOkResponse({ type: WorkflowDto, isArray: true })
  findAll(): Promise<WorkflowDto[]> {
    return this.workflowService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by id' })
  @ApiOkResponse({ type: WorkflowDto })
  findOne(@Param('id') id: string): Promise<WorkflowDto> {
    return this.workflowService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit workflow details' })
  @ApiBody({ type: UpdateWorkflowDto })
  @ApiOkResponse({ type: WorkflowDto })
  update(
    @Param('id') id: string,
    @Body() body: UpdateWorkflowDto,
  ): Promise<WorkflowDto> {
    return this.workflowService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete workflow' })
  @ApiNoContentResponse({ description: 'Workflow deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.workflowService.remove(id);
  }
}
