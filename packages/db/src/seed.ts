import { createDb } from './index';
import { schema } from './index';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

async function main() {
  const dbPath = process.env.DATABASE_PATH ?? '../../data/steps.db';
  const db = createDb(dbPath);

  console.log('Seeding database: deleting all existing data...');

  await db.delete(schema.steps);
  await db.delete(schema.workflows);
  await db.delete(schema.users);

  console.log('All data deleted.');

  const hash = await bcrypt.hash('admin', 10);
  const now = new Date().toISOString();

  await db.insert(schema.users).values({
    id: randomUUID(),
    username: 'admin',
    passwordHash: hash,
    createdAt: now,
  });

  console.log('Seeded admin user (admin/admin).');

  await db.insert(schema.workflows).values([
    {
      id: randomUUID(),
      name: 'Blood Donation Protocol',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      name: 'Plasma Extraction',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: randomUUID(),
      name: 'Centrifuge Usage Guide',
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log('Seeded 3 sample workflows.');
  console.log('Database seeded successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
