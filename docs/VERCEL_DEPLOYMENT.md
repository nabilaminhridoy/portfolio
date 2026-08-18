# Vercel Production PostgreSQL Deployment

This runbook describes the one-time procedure to deploy the Prisma schema
to the production PostgreSQL database configured in Vercel.

## When to use this

- First Vercel deployment
- After any Prisma schema change that needs to be applied to production
- When the Vercel build fails with `P2021: The table public.X does not exist`

## Prerequisites

1. A hosted PostgreSQL database (Neon / Supabase / Vercel Postgres / Railway / Render / etc.)
2. The production connection string added to **Vercel Environment Variables**:
   - `DATABASE_URL` → `postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public&sslmode=require`
   - `NEXTAUTH_URL` → your production URL (e.g. `https://your-domain.com`)
   - `NEXTAUTH_SECRET` → generate with `openssl rand -base64 32`
   - Set for **Production**, **Preview**, and **Development** environments as needed
3. Vercel CLI installed: `npm i -g vercel` (optional — alternatively use Vercel dashboard)

## Procedure (option A: Vercel CLI from local)

```bash
# 1. Pull Vercel env vars into a local .env.vercel file
vercel env pull .env.vercel --environment production

# 2. Run prisma db push using the Vercel production DATABASE_URL
#    This creates all 22 Prisma tables in the production database
DATABASE_URL="$(grep ^DATABASE_URL .env.vercel | cut -d= -f2- | tr -d '\"')" \
  bunx prisma db push --accept-data-loss

# 3. (Optional) Seed the admin user — REQUIRED on a fresh database
#    The seed script creates a single ADMIN user and 27 default skills.
#    It will skip if the admin already exists.
DATABASE_URL="$(grep ^DATABASE_URL .env.vercel | cut -d= -f2- | tr -d '\"')" \
  ADMIN_EMAIL=you@example.com \
  ADMIN_PASSWORD='StrongPassword@123' \
  ADMIN_NAME='Nabil Amin Hridoy' \
  bunx tsx scripts/seed.ts

# 4. Clean up local temp env file (NEVER commit it)
rm .env.vercel

# 5. Trigger a fresh Vercel deployment
vercel --prod
```

## Procedure (option B: Vercel dashboard — no CLI)

If you prefer not to use the Vercel CLI:

1. In the Vercel dashboard → your project → Settings → Environment Variables,
   copy the production `DATABASE_URL` value temporarily.
2. From your local machine, run:
   ```bash
   # Temporarily set DATABASE_URL to the Vercel production value
   # (do NOT save it to .env — set it only in your shell session)
   export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public&sslmode=require'

   # Push schema
   bunx prisma db push --accept-data-loss

   # Seed admin user (optional, only if DB is fresh)
   ADMIN_EMAIL=you@example.com \
   ADMIN_PASSWORD='StrongPassword@123' \
   ADMIN_NAME='Nabil Amin Hridoy' \
   bunx tsx scripts/seed.ts

   # Unset the env var
   unset DATABASE_URL
   ```
3. In the Vercel dashboard → your project → Deployments → click **Redeploy**.

## What `prisma db push` does

- Reads `prisma/schema.prisma`
- Connects to the production `DATABASE_URL`
- Creates all 22 tables: User, PasswordResetToken, About, Skill, Project,
  ProjectImage, Service, Experience, Education, Certification, Testimonial,
  Resume, Media, ContactMessage, SocialLink, SeoSetting, TrackingSetting,
  SmtpSetting, BrandingSetting, MarketingSetting, Settings, ActivityLog
- Creates all indexes and foreign-key constraints
- Idempotent — safe to re-run

## What `prisma db push` does NOT do

- Does NOT copy data from the local SQLite/PostgreSQL to production.
- Does NOT destroy existing data (unless `--accept-data-loss` is required
  by a breaking schema change — never the case here).
- Does NOT run any seed scripts.

## Optional: transfer local PostgreSQL data to production

If you want to copy the local CMS data (admin user, skills, settings, etc.)
to the production database, use `pg_dump` + `psql` (PostgreSQL-to-PostgreSQL):

```bash
# Dump local data (excluding Prisma's internal migration tables)
pg_dump --data-only --no-owner --no-privileges \
  -h localhost -U nabil -d portfolio \
  > /tmp/portfolio-data.sql

# Restore to production
psql "$PROD_DATABASE_URL" < /tmp/portfolio-data.sql
```

This is OPTIONAL. For a clean production database, the seed script
(creates admin user + 27 default skills) is sufficient.

## Vercel build flow (after this runbook)

Vercel runs these steps on every deploy:

1. `npm install` (or `bun install`) → installs dependencies
2. `postinstall` script runs → `prisma generate` (creates Prisma Client)
3. Vercel's own build command for Next.js → `next build`
4. During `next build`, `/sitemap.xml` is prerendered → calls
   `db.project.findMany()` → production DB has the `Project` table →
   query returns 0 rows (or actual published projects) → sitemap renders
5. Vercel deploys the build output

## Verifying success

After deploying the schema and triggering a redeploy:

- `https://your-domain.com/` → renders home page
- `https://your-domain.com/en` → renders English home
- `https://your-domain.com/bn` → renders Bangla home
- `https://your-domain.com/sitemap.xml` → returns XML sitemap (no error)
- `https://your-domain.com/robots.txt` → returns robots policy
- `https://your-domain.com/login` → renders login form
- `https://your-domain.com/en/projects` → renders projects page (empty state if no projects)
- `https://your-domain.com/admin/dashboard` → redirects to /login (unauth)

## Troubleshooting

**Build still fails with P2021**:
- Verify the production `DATABASE_URL` is set in Vercel Environment Variables (Production)
- Verify `prisma db push` was run against the production database, not local
- Check Vercel build logs to see which `DATABASE_URL` is being used (it should
  start with `postgresql://` pointing to your hosted Postgres, not `localhost`)

**Build fails with "Prisma Client not generated"**:
- Check that `postinstall: prisma generate` is in package.json
- Check that Vercel is running `npm install` (which triggers `postinstall`)
- If using `bun install`, ensure `bun` is the detected package manager in Vercel

**`prisma db push` fails with "connection refused"**:
- Verify the connection string is correct
- Verify your IP is allow-listed in your Postgres provider (Neon, Supabase, etc.)
- Verify `sslmode=require` is in the URL if the provider requires SSL
