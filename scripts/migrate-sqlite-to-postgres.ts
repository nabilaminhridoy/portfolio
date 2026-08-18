// ============================================================
// SQLite → PostgreSQL migration script (v2)
// Uses Prisma DMMF to introspect Boolean/DateTime fields → converts
// SQLite-stored values (0/1 for Boolean, ms-since-epoch for DateTime)
// back to proper JS values that Prisma+Postgres accepts.
// Quotes all SQLite identifiers (`"order"` is reserved) to avoid SQL errors.
// Idempotent: singletons use upsert, others use deleteMany+createMany.
// ============================================================

import Database from 'better-sqlite3';
import { Prisma, PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const SQLITE_PATH = process.env.SQLITE_PATH ?? '/home/z/my-project/db/custom.db';
const sqlite = new Database(SQLITE_PATH, { readonly: true });
const prisma = new PrismaClient();

// Build field-type map from Prisma DMMF
const dmmf = Prisma.dmmf;
type FieldKind = 'scalar' | 'object';
interface FieldInfo { type: string; kind: FieldKind; name: string; isList: boolean; }
const modelFieldMap: Record<string, Record<string, FieldInfo>> = {};
for (const model of dmmf.datamodel.models) {
  modelFieldMap[model.name] = {};
  for (const f of model.fields) {
    if (f.kind === 'scalar') {
      modelFieldMap[model.name][f.name] = { type: f.type, kind: 'scalar', name: f.name, isList: f.isList };
    }
  }
}

const ORDERED_TABLES = [
  'User', 'PasswordResetToken', 'About', 'Skill', 'Project', 'ProjectImage',
  'Service', 'Experience', 'Education', 'Certification', 'Testimonial',
  'Resume', 'Media', 'ContactMessage', 'SocialLink', 'SeoSetting',
  'TrackingSetting', 'SmtpSetting', 'BrandingSetting', 'MarketingSetting',
  'Settings', 'ActivityLog',
] as const;
type TableName = (typeof ORDERED_TABLES)[number];

const SINGLETONS = new Set<TableName>(['SeoSetting', 'TrackingSetting', 'SmtpSetting', 'BrandingSetting', 'MarketingSetting', 'Settings', 'About']);

const counts: Record<string, { sqlite: number; postgres: number }> = {};
const errors: string[] = [];

function convertSqliteValue(value: unknown, model: string, field: string): unknown {
  if (value === null || value === undefined) return null;

  const info = modelFieldMap[model]?.[field];
  if (!info) return value; // unknown field — pass through

  switch (info.type) {
    case 'Boolean':
      // SQLite stores 0/1; convert to boolean
      return value === 1 || value === true || value === 'true' || value === 1;
    case 'DateTime':
      // SQLite stores as ms since epoch (number) under Prisma; convert to Date
      if (typeof value === 'number') return new Date(value);
      if (typeof value === 'string') {
        const n = Number(value);
        if (!isNaN(n) && n > 0) return new Date(n);
        const parsed = Date.parse(value);
        if (!isNaN(parsed)) return new Date(parsed);
        return null;
      }
      return value;
    case 'Int':
    case 'BigInt':
      return typeof value === 'string' ? Number(value) : value;
    default:
      return value;
  }
}

function tableColumns(table: TableName): string[] {
  const rows = sqlite.prepare(`PRAGMA table_info("${table}")`).all() as { name: string }[];
  return rows.map((r) => r.name);
}

function readAllFromSqlite(table: TableName): Record<string, unknown>[] {
  const cols = tableColumns(table);
  // Quote every column to be safe with reserved words like "order"
  const quotedCols = cols.map((c) => `"${c}"`).join(', ');
  const rows = sqlite.prepare(`SELECT ${quotedCols} FROM "${table}"`).all() as Record<string, unknown>[];
  return rows;
}

function transformRow(row: Record<string, unknown>, model: string, cols: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const col of cols) {
    out[col] = convertSqliteValue(row[col], model, col);
  }
  return out;
}

async function migrateTable(table: TableName): Promise<void> {
  const cols = tableColumns(table);
  const rows = readAllFromSqlite(table);
  counts[table] = { sqlite: rows.length, postgres: 0 };

  if (rows.length === 0) {
    console.log(`  ${table.padEnd(24)} 0 records (skipped)`);
    return;
  }

  // @ts-expect-error dynamic model access
  const model = prisma[table];
  if (!model) {
    errors.push(`Prisma model ${table} not found`);
    return;
  }

  const transformed = rows.map((r) => transformRow(r, table, cols));

  try {
    if (SINGLETONS.has(table)) {
      // Upsert each row (won't duplicate, will overwrite)
      for (const data of transformed) {
        const id = data.id as string;
        await model.upsert({
          where: { id },
          create: data as any,
          update: data as any,
        });
      }
    } else {
      // Delete then insert (idempotent)
      await model.deleteMany({});
      const CHUNK = 50;
      for (let i = 0; i < transformed.length; i += CHUNK) {
        const chunk = transformed.slice(i, i + CHUNK);
        await model.createMany({ data: chunk as any, skipDuplicates: false });
      }
    }

    // Verify count after insert
    // @ts-expect-error dynamic model access
    const pgCount = await prisma[table].count();
    counts[table].postgres = pgCount;

    const match = counts[table].sqlite === pgCount ? 'OK' : 'MISMATCH';
    console.log(`  ${table.padEnd(24)} sqlite=${String(rows.length).padStart(4)}  pg=${String(pgCount).padStart(4)}  ${match}`);
  } catch (err) {
    const msg = `Failed to migrate ${table}: ${(err as Error).message}`;
    errors.push(msg);
    console.error(`  ${table.padEnd(24)} ERROR: ${(err as Error).message}`);
  }
}

async function verifyRelationships(): Promise<void> {
  console.log('\n=== Relationship verification ===');
  const projects = await prisma.project.count();
  const images = await prisma.projectImage.count();
  console.log(`  Project (${projects}) → ProjectImage (${images}) — FK projectId ON DELETE CASCADE`);

  const users = await prisma.user.count();
  const tokens = await prisma.passwordResetToken.count();
  console.log(`  User (${users}) → PasswordResetToken (${tokens}) — FK userId ON DELETE CASCADE`);

  const logs = await prisma.activityLog.count();
  console.log(`  User (${users}) → ActivityLog (${logs}) — FK userId ON DELETE SET NULL`);

  const adminUser = await prisma.user.findFirst({ where: { email: 'admin@nabilhridoy.com' } });
  console.log(`  Admin user in PostgreSQL: ${adminUser ? `✅ (id=${adminUser.id})` : '❌ NOT FOUND'}`);
  console.log(`  Admin password hash preserved: ${adminUser?.password ? '✅ (length=' + adminUser.password.length + ')' : '❌'}`);
}

async function main(): Promise<void> {
  const start = performance.now();
  console.log('=== SQLite → PostgreSQL migration ===');
  console.log(`  SQLite: ${SQLITE_PATH}`);
  console.log('  PostgreSQL: portfolio database (local)');
  console.log();

  await prisma.$connect();

  for (const table of ORDERED_TABLES) {
    await migrateTable(table);
  }

  await verifyRelationships();

  const total = Object.values(counts).reduce(
    (acc, c) => ({ sqlite: acc.sqlite + c.sqlite, postgres: acc.postgres + c.postgres }),
    { sqlite: 0, postgres: 0 }
  );
  const allMatch = Object.values(counts).every((c) => c.sqlite === c.postgres);

  console.log('\n=== Summary ===');
  console.log(`  Total records (SQLite): ${total.sqlite}`);
  console.log(`  Total records (PostgreSQL): ${total.postgres}`);
  console.log(`  Match: ${allMatch ? '✅ ALL COUNTS MATCH' : '❌ MISMATCH DETECTED'}`);
  if (errors.length > 0) {
    console.log(`  Errors: ${errors.length}`);
    for (const e of errors) console.log(`    - ${e}`);
  }
  const ms = Math.round(performance.now() - start);
  console.log(`  Elapsed: ${ms}ms`);

  await prisma.$disconnect();
  sqlite.close();

  if (!allMatch || errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
