import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { idSchema, timestampSchema } from './shared';
import { workflows } from './workflows';

export const steps = sqliteTable('steps', {
  id: text('id').primaryKey(),
  workflowId: text('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  text: text('text').notNull().default(''),
  imagePath: text('image_path').notNull(),
  stepOrder: integer('step_order').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const stepSchema = z.object({
  id: idSchema,
  workflowId: idSchema,
  text: z.string(),
  imagePath: z.string().min(1, 'Image path is required'),
  stepOrder: z.number().int().nonnegative(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const createStepSchema = z.object({
  workflowId: idSchema,
  text: z.string().default(''),
  imagePath: z.string().min(1, 'Image path is required'),
  stepOrder: z.number().int().nonnegative().default(0),
});

export const updateStepSchema = z.object({
  text: z.string().optional(),
  imagePath: z.string().min(1, 'Image path is required').optional(),
  stepOrder: z.number().int().nonnegative().optional(),
});

export const reorderStepsSchema = z.object({
  stepIds: z.array(idSchema),
});

export type Step = z.infer<typeof stepSchema>;
export type CreateStepInput = z.infer<typeof createStepSchema>;
export type UpdateStepInput = z.infer<typeof updateStepSchema>;
export type ReorderStepsInput = z.infer<typeof reorderStepsSchema>;
