import { Global, Module } from '@nestjs/common';
import { createDb } from '@steps/db';
import type { Db } from '@steps/db';

export const DB_PROVIDER = 'DB';

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: (): Db => {
        const dbPath = process.env.DATABASE_PATH ?? '../../data/steps.db';
        return createDb(dbPath, { migrate: true });
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class DatabaseModule {}
