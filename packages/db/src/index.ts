import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as schema from './schema';

export { schema };
export type * from './schema';
export { eq } from 'drizzle-orm';

export * from './validation';

export type Db = ReturnType<typeof createDb>;

interface CreateDbOptions {
  migrate?: boolean;
  migrationsFolder?: string;
}

export function createDb(dbPath: string, options: CreateDbOptions = {}) {
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  if (options.migrate) {
    migrate(db, {
      migrationsFolder: options.migrationsFolder ?? join(__dirname, '../drizzle'),
    });
  }

  return db;
}
