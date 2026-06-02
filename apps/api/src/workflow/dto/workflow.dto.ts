import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'Blood Donation Protocol' })
  name: string;
}

export class UpdateWorkflowDto {
  @ApiPropertyOptional({ example: 'Updated Blood Donation Protocol' })
  name?: string;
}

export class WorkflowDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Blood Donation Protocol' })
  name: string;

  @ApiProperty({ example: '2026-06-02T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-06-02T12:00:00.000Z' })
  updatedAt: string;
}
