import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  asc,
  createWorkflowSchema,
  eq,
  schema,
  type Db,
  type Workflow,
  updateWorkflowSchema,
} from '@steps/db';
import { randomUUID } from 'node:crypto';
import { DB_PROVIDER } from '../../database/database.module';
import type { CreateWorkflowDto, UpdateWorkflowDto } from '../dto';
import { SyncWorkflowDto, SyncStepDto, SyncWorkflowResponseDto } from '../dto/sync.dto';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class WorkflowService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: Db,
    private readonly storageService: StorageService
  ) { }

  async create(input: CreateWorkflowDto): Promise<Workflow> {
    const result = createWorkflowSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    const now = new Date().toISOString();
    const [workflow] = await this.db
      .insert(schema.workflows)
      .values({
        id: randomUUID(),
        name: result.data.name,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return workflow;
  }

  async findAll(): Promise<Workflow[]> {
    return this.db
      .select()
      .from(schema.workflows)
      .orderBy(asc(schema.workflows.createdAt));
  }

  async findOne(id: string): Promise<Workflow> {
    const [workflow] = await this.db
      .select()
      .from(schema.workflows)
      .where(eq(schema.workflows.id, id))
      .limit(1);

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async update(id: string, input: UpdateWorkflowDto): Promise<Workflow> {
    const result = updateWorkflowSchema.safeParse(input);

    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }

    if (!result.data.name) {
      throw new BadRequestException('No workflow fields provided');
    }

    const [workflow] = await this.db
      .update(schema.workflows)
      .set({
        name: result.data.name,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.workflows.id, id))
      .returning();

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return workflow;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const workflowSteps = await this.db
      .select({ imagePath: schema.steps.imagePath })
      .from(schema.steps)
      .where(eq(schema.steps.workflowId, id));

    const imagePaths = workflowSteps
      .map((step) => step.imagePath)
      .filter((imagePath) => imagePath && !/^https?:\/\//.test(imagePath));

    await this.storageService.deleteFiles(imagePaths);

    const [workflow] = await this.db
      .delete(schema.workflows)
      .where(eq(schema.workflows.id, id))
      .returning();

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return undefined;
  }

  async sync(id: string, input: SyncWorkflowDto): Promise<SyncWorkflowResponseDto> {
    // Ensure workflow exists
    const workflow = await this.findOne(id);

    // Update workflow name if changed
    if (workflow.name !== input.name) {
      await this.update(id, { name: input.name });
    }

    // Get existing steps
    const existingSteps = await this.db
      .select()
      .from(schema.steps)
      .where(eq(schema.steps.workflowId, id));

    const existingStepIds = existingSteps.map(s => s.id);
    const inputStepIds = input.steps.filter(s => !!s.id).map(s => s.id as string);
    const stepIdsToDelete = existingStepIds.filter(id => !inputStepIds.includes(id));

    // Delete removed steps
    if (stepIdsToDelete.length > 0) {
      for (const stepId of stepIdsToDelete) {
        await this.db.delete(schema.steps).where(eq(schema.steps.id, stepId));
      }
    }

    const uploadLinks: { stepId: string; uploadUrl: string }[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < input.steps.length; i++) {
      const stepData = input.steps[i];
      const isNew = !stepData.id || !existingStepIds.includes(stepData.id);
      const stepId = stepData.id || randomUUID();
      let imagePath = stepData.imagePath || '';

      if (stepData.imageMimeType) {
        // Need a new presigned URL for this image
        // We generate a deterministic or random path
        imagePath = `workflows/${id}/${stepId}-${Date.now()}`;

        const uploadUrl = await this.storageService.getUploadUrl(imagePath, stepData.imageMimeType);
        uploadLinks.push({ stepId, uploadUrl });
      }

      if (isNew) {
        await this.db.insert(schema.steps).values({
          id: stepId,
          workflowId: id,
          text: stepData.text || '',
          imagePath: imagePath || (stepData.text || ''),
          stepOrder: stepData.stepOrder ?? i,
          createdAt: now,
          updatedAt: now,
        });
      } else {
        const updateData: Partial<typeof schema.steps.$inferInsert> = {
          text: stepData.text,
          stepOrder: stepData.stepOrder ?? i,
          updatedAt: now,
        };
        if (imagePath) {
          updateData.imagePath = imagePath;
        }
        await this.db.update(schema.steps).set(updateData).where(eq(schema.steps.id, stepId));
      }
    }

    return {
      workflowId: id,
      uploadLinks
    };
  }
}
