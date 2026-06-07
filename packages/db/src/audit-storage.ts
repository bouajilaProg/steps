import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { createDb, schema, asc, eq } from './index';
import { createClient, deleteFile, list } from '@steps/file-storage';

loadEnv();

const STORAGE_PREFIX = 'workflows/';

function loadEnv(): void {
  const candidates = [
    resolve(__dirname, '../../.env'),
    resolve(__dirname, '../../../.env'),
    resolve(process.cwd(), '.env'),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const content = readFileSync(path, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      let value = rawValue.trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
    return;
  }
}

function isStorageKey(imagePath: string): boolean {
  if (!imagePath) return false;
  if (/^https?:\/\//.test(imagePath)) return false;
  return imagePath.includes('/');
}

async function main() {
  const dbPath = process.env.DATABASE_PATH ?? '../../data/steps.db';
  const db = createDb(dbPath);

  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET ?? 'steps-bucket';
  const region = process.env.S3_REGION ?? 'eu-west-1';

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.error(
      'Missing S3 configuration. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY.',
    );
    process.exit(1);
  }

  const storageClient = createClient({
    endpoint,
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
  });

  const workflows = await db
    .select()
    .from(schema.workflows)
    .orderBy(asc(schema.workflows.createdAt));

  const referencedKeys = new Map<string, { workflowName: string; stepText: string }>();
  const fallbackSteps: Array<{ workflowName: string; stepText: string; imagePath: string }> = [];

  console.log('=== Step -> File mapping ===\n');

  if (workflows.length === 0) {
    console.log('No workflows found in the database.\n');
  }

  for (const workflow of workflows) {
    const steps = await db
      .select()
      .from(schema.steps)
      .where(eq(schema.steps.workflowId, workflow.id))
      .orderBy(asc(schema.steps.stepOrder));

    console.log(`Workflow: ${workflow.name}  (${workflow.id})`);

    if (steps.length === 0) {
      console.log('  (no steps)');
      console.log('');
      continue;
    }

    for (const step of steps) {
      const stepLabel = step.text.length > 0 ? step.text : '(no text)';
      const isKey = isStorageKey(step.imagePath);

      console.log(`  [${step.stepOrder}] "${stepLabel}"`);

      if (isKey) {
        referencedKeys.set(step.imagePath, {
          workflowName: workflow.name,
          stepText: stepLabel,
        });
        console.log(`      file: ${step.imagePath}`);
      } else {
        fallbackSteps.push({
          workflowName: workflow.name,
          stepText: stepLabel,
          imagePath: step.imagePath,
        });
        const note = step.imagePath
          ? `text fallback (not a storage key): ${step.imagePath}`
          : 'no image path';
        console.log(`      ${note}`);
      }
    }

    console.log('');
  }

  console.log('=== Storage listing ===\n');

  const storedFiles = await list(storageClient, bucket, STORAGE_PREFIX);
  const storedKeys = new Set(storedFiles.map((f) => f.key));

  console.log(`Bucket: ${bucket}`);
  console.log(`Prefix: ${STORAGE_PREFIX}`);
  console.log(`Found ${storedFiles.length} file(s).\n`);

  for (const file of storedFiles) {
    const isReferenced = referencedKeys.has(file.key);
    console.log(
      `  ${file.key}  (${formatBytes(file.size)})${isReferenced ? '' : '  <- unreferenced'}`,
    );
  }
  console.log('');

  console.log('=== Zombie files (in storage, not referenced by any step) ===\n');

  const zombies = storedFiles.filter((f) => !referencedKeys.has(f.key));

  if (zombies.length === 0) {
    console.log('None. Every storage file is referenced by a step.\n');
  } else {
    for (const file of zombies) {
      console.log(`  ${file.key}  (${formatBytes(file.size)})`);
    }
    console.log(`\nTotal: ${zombies.length} zombie file(s).\n`);

    if (process.stdin.isTTY) {
      const confirmed = await promptYesNo(
        `Delete all ${zombies.length} zombie file(s) from bucket "${bucket}"? [y/N] `,
      );

      if (confirmed) {
        console.log('\nDeleting...');
        let success = 0;
        let failed = 0;
        for (const file of zombies) {
          try {
            await deleteFile(storageClient, bucket, file.key);
            console.log(`  deleted: ${file.key}`);
            success++;
          } catch (err) {
            console.error(`  FAILED: ${file.key}  (${(err as Error).message})`);
            failed++;
          }
        }
        console.log(`\nDone. Deleted ${success} file(s), ${failed} failure(s).\n`);
      } else {
        console.log('Skipped deletion. No files were removed.\n');
      }
    } else {
      console.log(
        '(non-interactive shell: skipping delete prompt. Re-run in a TTY to delete.)\n',
      );
    }
  }

  console.log('=== Orphan references (referenced by steps, missing from storage) ===\n');

  const orphanEntries: Array<{ key: string; workflowName: string; stepText: string }> = [];
  for (const [key, ref] of referencedKeys) {
    if (!storedKeys.has(key)) {
      orphanEntries.push({ key, ...ref });
    }
  }

  if (orphanEntries.length === 0) {
    console.log('None. Every step imagePath key exists in storage.\n');
  } else {
    for (const entry of orphanEntries) {
      console.log(`  ${entry.key}`);
      console.log(`      referenced by: ${entry.workflowName} -> "${entry.stepText}"`);
    }
    console.log(`\nTotal: ${orphanEntries.length} orphan reference(s).\n`);
  }

  if (fallbackSteps.length > 0) {
    console.log('=== Fallback steps (imagePath is not a storage key) ===\n');
    for (const entry of fallbackSteps) {
      console.log(`  ${entry.workflowName} -> "${entry.stepText}"`);
      console.log(`      imagePath: ${entry.imagePath}`);
    }
    console.log(`\nTotal: ${fallbackSteps.length} fallback step(s).\n`);
  }

  process.exit(0);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function promptYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

main().catch((err) => {
  console.error('Storage audit failed:', err);
  process.exit(1);
});
