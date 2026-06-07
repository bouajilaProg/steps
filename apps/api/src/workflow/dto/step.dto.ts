import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStepDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  workflowId: string;

  @ApiProperty({ example: 'Ask donor to complete the eligibility form.' })
  text: string;

  @ApiProperty({ example: 'workflows/blood-donation/eligibility-form.png' })
  imagePath: string;

  @ApiPropertyOptional({ example: 0 })
  stepOrder?: number;
}

export class UpdateStepDto {
  @ApiPropertyOptional({ example: 'Updated instruction text.' })
  text?: string;

  @ApiPropertyOptional({ example: 'workflows/blood-donation/updated.png' })
  imagePath?: string;

  @ApiPropertyOptional({ example: 1 })
  stepOrder?: number;
}

export class StepDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  workflowId: string;

  @ApiProperty({ example: 'Ask donor to complete the eligibility form.' })
  text: string;

  @ApiProperty({ example: 'workflows/blood-donation/eligibility-form.png' })
  imagePath: string;

  @ApiPropertyOptional({
    example:
      'https://s3.example.com/steps-bucket/workflows/blood-donation/eligibility-form.png',
  })
  imageUrl?: string;

  @ApiProperty({ example: 0 })
  stepOrder: number;

  @ApiProperty({ example: '2026-06-02T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-06-02T12:00:00.000Z' })
  updatedAt: string;
}
