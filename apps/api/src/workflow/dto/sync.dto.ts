import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncStepDto {
  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id?: string;

  @ApiPropertyOptional({ example: 'Step title here' })
  text?: string;

  @ApiPropertyOptional({ example: 'workflows/img.png' })
  imagePath?: string;

  @ApiPropertyOptional({ example: 'image/png' })
  imageMimeType?: string; // If provided, means we need a signed URL for a new image upload

  @ApiProperty({ example: 0 })
  stepOrder: number;
}

export class SyncWorkflowDto {
  @ApiProperty({ example: 'Workflow Name' })
  name: string;

  @ApiProperty({ type: [SyncStepDto] })
  steps: SyncStepDto[];
}

export class SyncWorkflowResponseDto {
  @ApiProperty()
  workflowId: string;

  @ApiProperty()
  uploadLinks: { stepId: string; uploadUrl: string }[];
}
