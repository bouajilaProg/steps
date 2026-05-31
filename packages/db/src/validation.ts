import { z } from 'zod';

const idSchema = z.string().uuid();
const timestampSchema = z.string().datetime();

export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(1, 'Username is required'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  createdAt: timestampSchema,
});

export const processSchema = z.object({
  id: idSchema,
  title: z.string().min(1, 'Title is required'),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const stepSchema = z.object({
  id: idSchema,
  processId: idSchema,
  title: z.string(),
  imageUrl: z.string().url(),
  imagePath: z.string().nullable(),
  stepOrder: z.number().int().nonnegative(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = userSchema.omit({
  createdAt: true,
});

export const createProcessSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const updateProcessSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
});

export const createStepSchema = z.object({
  processId: idSchema,
  title: z.string().default(''),
  imageUrl: z.string().url(),
  imagePath: z.string().optional(),
  stepOrder: z.number().int().nonnegative().default(0),
});

export const updateStepSchema = z.object({
  title: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePath: z.string().optional(),
  stepOrder: z.number().int().nonnegative().optional(),
});

export const reorderStepsSchema = z.object({
  stepIds: z.array(idSchema),
});

export type User = z.infer<typeof userSchema>;
export type Process = z.infer<typeof processSchema>;
export type Step = z.infer<typeof stepSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateProcessInput = z.infer<typeof createProcessSchema>;
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>;
export type CreateStepInput = z.infer<typeof createStepSchema>;
export type UpdateStepInput = z.infer<typeof updateStepSchema>;
export type ReorderStepsInput = z.infer<typeof reorderStepsSchema>;
