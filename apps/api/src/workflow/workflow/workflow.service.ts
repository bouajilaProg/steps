import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createWorkflowSchema, eq, schema, type Db, type Workflow, updateWorkflowSchema } from '@steps/db';
import { randomUUID } from 'node:crypto';
import { DB_PROVIDER } from '../../database/database.module';
import type { CreateWorkflowDto, UpdateWorkflowDto } from '../dto';

@Injectable()
export class WorkflowService {
  constructor(@Inject(DB_PROVIDER) private readonly db: Db) {}

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
    return this.db.select().from(schema.workflows);
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
    const [workflow] = await this.db
      .delete(schema.workflows)
      .where(eq(schema.workflows.id, id))
      .returning();

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    return undefined;
  }
}
