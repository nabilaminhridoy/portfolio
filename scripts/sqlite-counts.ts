// Counts records per model in the existing SQLite database (source baseline).
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const sqliteUrl = 'file:/home/z/my-project/db/custom.db';
const prisma = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

async function main() {
  const models = Object.keys(prisma).filter((k) => !k.startsWith('_') && !['$connect', '$disconnect', '$on', '$transaction', '$use', '$extends'].includes(k));

  const counts: Record<string, number> = {};
  for (const model of models.sort()) {
    try {
      // @ts-expect-error dynamic model access
      const count = await prisma[model].count();
      counts[model] = count;
    } catch (err) {
      console.error(`Failed to count ${model}:`, (err as Error).message);
    }
  }
  console.log('=== SQLite baseline record counts ===');
  for (const [m, c] of Object.entries(counts)) {
    console.log(`  ${m.padEnd(24)} ${c}`);
  }
  console.log(`\nTotal models: ${models.length}`);
  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
