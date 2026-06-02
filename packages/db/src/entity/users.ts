import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { idSchema, timestampSchema } from './shared';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(1, 'Username is required'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  createdAt: timestampSchema,
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = userSchema.omit({
  createdAt: true,
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
