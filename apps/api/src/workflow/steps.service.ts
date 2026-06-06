import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  asc,
  createStepSchema,
  eq,
  schema,
  type Db,
  type Step,
  updateStepSchema,
} from '@steps/db';
import { randomUUID } from 'node:crypto';
import { DB_PROVIDER } from '../database/database.module';
import { StorageService } from '../storage/storage.service';
import type { CreateStepDto, UpdateStepDto } from './dto';

@Injectable()
export class StepsService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: Db,
    private readonly storageService: StorageService,
  ) {}

  async create(input: CreateStepDto): Promise<Step> {
    const result = createStepSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    await this.ensureWorkflowExists(result.data.workflowId);

    const now = new Date().toISOString();
    const [step] = await this.db
      .insert(schema.steps)
      .values({
        id: randomUUID(),
        workflowId: result.data.workflowId,
        text: result.data.text,
        imagePath: result.data.imagePath,
        stepOrder: result.data.stepOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return step;
  }

  async findByWorkflow(workflowId: string): Promise<(Step & { imageUrl?: string })[]> {
    await this.ensureWorkflowExists(workflowId);

    const steps = await this.db
      .select()
      .from(schema.steps)
      .where(eq(schema.steps.workflowId, workflowId))
      .orderBy(asc(schema.steps.stepOrder));

    return Promise.all(
      steps.map(async (step) => ({
        ...step,
        imageUrl: await this.resolveImageUrl(step.imagePath),
      })),
    );
  }

  async update(id: string, input: UpdateStepDto): Promise<Step> {
    const result = updateStepSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    const updateData = {
      ...result.data,
      updatedAt: new Date().toISOString(),
    };

    if (Object.keys(result.data).length === 0) {
      throw new BadRequestException('No step fields provided');
    }

    const [step] = await this.db
      .update(schema.steps)
      .set(updateData)
      .where(eq(schema.steps.id, id))
      .returning();

    if (!step) {
      throw new NotFoundException('Step not found');
    }

    return step;
  }

  async remove(id: string): Promise<void> {
    const [step] = await this.db
      .delete(schema.steps)
      .where(eq(schema.steps.id, id))
      .returning();

    if (!step) {
      throw new NotFoundException('Step not found');
    }

    return undefined;
  }

  private async ensureWorkflowExists(workflowId: string) {
    const [workflow] = await this.db
      .select({ id: schema.workflows.id })
      .from(schema.workflows)
      .where(eq(schema.workflows.id, workflowId))
      .limit(1);

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
  }

  private async resolveImageUrl(imagePath: string): Promise<string> {
    if (/^https?:\/\//.test(imagePath)) {
      return imagePath;
    }

    return this.storageService.getReadUrl(imagePath);
  }
}
