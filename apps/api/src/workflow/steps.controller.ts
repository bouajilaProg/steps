import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStepDto, StepDto, UpdateStepDto } from './dto';
import { StepsService } from './steps.service';

@ApiTags('Steps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new step in a workflow' })
  @ApiBody({ type: CreateStepDto })
  @ApiOkResponse({ type: StepDto })
  create(@Body() body: CreateStepDto): Promise<StepDto> {
    return this.stepsService.create(body);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({ summary: 'Get all steps in a workflow' })
  @ApiOkResponse({ type: StepDto, isArray: true })
  findByWorkflow(@Param('workflowId') workflowId: string): Promise<StepDto[]> {
    return this.stepsService.findByWorkflow(workflowId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit a step' })
  @ApiBody({ type: UpdateStepDto })
  @ApiOkResponse({ type: StepDto })
  update(@Param('id') id: string, @Body() body: UpdateStepDto): Promise<StepDto> {
    return this.stepsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a step' })
  @ApiNoContentResponse({ description: 'Step deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.stepsService.remove(id);
  }

}
