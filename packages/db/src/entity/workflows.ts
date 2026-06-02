import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { idSchema, timestampSchema } from './shared';

export const workflows = sqliteTable('workflows', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const workflowSchema = z.object({
  id: idSchema,
  name: z.string().min(1, 'Name is required'),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
});

export type Workflow = z.infer<typeof workflowSchema>;
export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
