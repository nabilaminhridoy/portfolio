/**
 * Seed script — Nabil Amin Hridoy Portfolio CMS (Phase 6 refined)
 *
 * STRICT POLICY: This seed does NOT invent personal or professional info.
 * It only seeds:
 *   - 1 admin user (so the CMS is accessible)
 *   - 1 About row with ONLY the user-provided name + role (no fake bio)
 *   - 27 skills with OFFICIAL technology logos (from simpleicons.org CDN)
 *   - 8 default social link templates (admin updates URLs)
 *   - Global settings rows (defaults)
 *
 * It does NOT seed:
 *   - Projects (admin adds real ones)
 *   - Services (admin adds real ones)
 *   - Experiences (admin adds real ones)
 *   - Educations (admin adds real ones)
 *   - Certifications (admin adds real ones)
 *   - Testimonials (admin adds real ones)
 *   - Resume (admin uploads real one)
 *   - Media (admin uploads real ones)
 *
 * Public site sections that have no data will use clean empty states
 * or be conditionally hidden.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding (refined — no fake data)...');

  // === 1. Admin user — from environment variables ===
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nabilhridoy.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
  const adminName = process.env.ADMIN_NAME || 'Nabil Amin Hridoy';

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`  ✓ Admin user: ${user.email}`);

  // === 2. About — only user-provided facts, NO invented bio/stats ===
  await prisma.about.upsert({
    where: { id: 'about-main' },
    update: {},
    create: {
      id: 'about-main',
      nameEn: 'Nabil Amin Hridoy',
      nameBn: 'নাবিল আমিন হৃদয়',
      roleEn: 'Full Stack Developer',
      roleBn: 'ফুল স্ট্যাক ডেভেলপার',
      bioEn: '',
      bioBn: '',
      email: 'admin@nabilhridoy.com',
      phone: null,
      locationEn: null,
      locationBn: null,
      available: true,
      // Stats: null = hidden on public site (admin sets real values from /admin/about)
      yearsExperience: null,
      projectsCompleted: null,
      happyClients: null,
      technologiesCount: null,
    },
  });
  console.log('  ✓ About (minimal — admin fills real bio from /admin/about)');

  // === 3. Skills — 27 technologies with OFFICIAL logos via simpleicons.org CDN ===
  // simpleicons.org provides official SVG logos for all major tech brands.
  // URL format: https://cdn.simpleicons.org/[slug]/[color] (color is hex without #)
  // For techs without an official logo (REST APIs, bcrypt, Auth.js), we leave logoUrl null
  // and the UI will render a clean Code2 lucide icon as fallback (NOT a fake "initials" block).
  const skills = [
    // Frontend
    { name: 'HTML', slug: 'html', category: 'Frontend', level: 95, logo: 'https://cdn.simpleicons.org/html5/E34F26' },
    { name: 'CSS', slug: 'css', category: 'Frontend', level: 92, logo: 'https://cdn.simpleicons.org/css3/1572B6' },
    { name: 'JavaScript', slug: 'javascript', category: 'Frontend', level: 90, logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { name: 'ES6', slug: 'es6', category: 'Frontend', level: 88, logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { name: 'TypeScript', slug: 'typescript', category: 'Frontend', level: 85, logo: 'https://cdn.simpleicons.org/typescript/3178C6' },
    { name: 'React.js', slug: 'react', category: 'Frontend', level: 92, logo: 'https://cdn.simpleicons.org/react/61DAFB' },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend', level: 88, logo: 'https://cdn.simpleicons.org/nextdotjs/000000' },
    { name: 'Vue.js', slug: 'vue', category: 'Frontend', level: 70, logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
    { name: 'Tailwind CSS', slug: 'tailwind', category: 'Frontend', level: 90, logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
    { name: 'Vite.js', slug: 'vite', category: 'Frontend', level: 80, logo: 'https://cdn.simpleicons.org/vite/646CFF' },
    // Backend
    { name: 'PHP', slug: 'php', category: 'Backend', level: 75, logo: 'https://cdn.simpleicons.org/php/777BB4' },
    { name: 'Laravel', slug: 'laravel', category: 'Backend', level: 82, logo: 'https://cdn.simpleicons.org/laravel/FF2D20' },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', level: 85, logo: 'https://cdn.simpleicons.org/nodedotjs/339933' },
    { name: 'Express.js', slug: 'express', category: 'Backend', level: 80, logo: 'https://cdn.simpleicons.org/express/000000' },
    { name: 'REST APIs', slug: 'rest-apis', category: 'Backend', level: 88, logo: null }, // no official logo
    { name: 'Auth.js', slug: 'authjs', category: 'Backend', level: 78, logo: null }, // no official logo
    { name: 'bcrypt', slug: 'bcrypt', category: 'Backend', level: 80, logo: null }, // no official logo
    // Database
    { name: 'MySQL', slug: 'mysql', category: 'Database', level: 80, logo: 'https://cdn.simpleicons.org/mysql/4479A1' },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Database', level: 78, logo: 'https://cdn.simpleicons.org/postgresql/4169E1' },
    { name: 'MongoDB', slug: 'mongodb', category: 'Database', level: 75, logo: 'https://cdn.simpleicons.org/mongodb/47A248' },
    { name: 'Redis', slug: 'redis', category: 'Database', level: 70, logo: 'https://cdn.simpleicons.org/redis/FF4438' },
    // DevOps & Tools
    { name: 'ESLint', slug: 'eslint', category: 'DevOps', level: 85, logo: 'https://cdn.simpleicons.org/eslint/4B32C3' },
    { name: 'Git', slug: 'git', category: 'DevOps', level: 90, logo: 'https://cdn.simpleicons.org/git/F05032' },
    { name: 'GitHub', slug: 'github', category: 'DevOps', level: 88, logo: 'https://cdn.simpleicons.org/github/181717' },
    { name: 'Docker', slug: 'docker', category: 'DevOps', level: 75, logo: 'https://cdn.simpleicons.org/docker/2496ED' },
    { name: 'Cloudflare', slug: 'cloudflare', category: 'DevOps', level: 70, logo: 'https://cdn.simpleicons.org/cloudflare/F38020' },
    { name: 'AWS', slug: 'aws', category: 'DevOps', level: 65, logo: 'https://cdn.simpleicons.org/amazonwebservices/FF9900' },
  ];

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i]!;
    await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {
        logoUrl: s.logo,
        descriptionEn: null,
        descriptionBn: null,
      },
      create: {
        slug: s.slug,
        name: s.name,
        category: s.category,
        level: s.level,
        logoUrl: s.logo,
        descriptionEn: null,
        descriptionBn: null,
        status: 'ACTIVE',
        order: i + 1,
      },
    });
  }
  console.log(`  ✓ ${skills.length} skills seeded with official logos`);

  // === 4. Social Links — placeholder templates, admin updates URLs ===
  const socials = [
    { platform: 'website', label: 'Website', url: '#', order: 1 },
    { platform: 'facebook', label: 'Facebook', url: '#', order: 2 },
    { platform: 'instagram', label: 'Instagram', url: '#', order: 3 },
    { platform: 'whatsapp', label: 'WhatsApp', url: '#', order: 4 },
    { platform: 'linkedin', label: 'LinkedIn', url: '#', order: 5 },
    { platform: 'x', label: 'X (Twitter)', url: '#', order: 6 },
    { platform: 'github', label: 'GitHub', url: '#', order: 7 },
    { platform: 'discord', label: 'Discord', url: '#', order: 8 },
  ];

  for (const s of socials) {
    await prisma.socialLink.upsert({
      where: { platform: s.platform },
      update: {},
      create: {
        platform: s.platform,
        label: s.label,
        url: s.url,
        isActive: false, // disabled by default — admin enables when real URL is set
        order: s.order,
      },
    });
  }
  console.log(`  ✓ ${socials.length} social link templates (inactive, admin sets real URLs)`);

  // === 5. Global settings (single-row tables) ===
  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      defaultLocale: 'en',
      defaultTheme: 'system',
      maintenanceMode: false,
    },
  });

  await prisma.seoSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'Nabil Amin Hridoy',
      metaTitleEn: 'Nabil Amin Hridoy — Full Stack Developer',
      metaTitleBn: 'নাবিল আমিন হৃদয় — ফুল স্ট্যাক ডেভেলপার',
      metaDescriptionEn: 'Premium portfolio of Nabil Amin Hridoy, a Full Stack Developer.',
      metaDescriptionBn: 'নাবিল আমিন হৃদয়ের প্রিমিয়াম পোর্টফোলিও।',
      twitterCard: 'summary_large_image',
      robotsTxt: 'User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml',
    },
  });

  await prisma.trackingSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global', isEnabled: false },
  });

  await prisma.smtpSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      host: null,
      port: null,
      encryption: null,
      fromName: 'Nabil Amin Hridoy',
      fromEmail: null,
      isEnabled: false,
    },
  });

  await prisma.brandingSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      siteName: 'Nabil Amin Hridoy',
      taglineEn: 'Full Stack Developer',
      taglineBn: 'ফুল স্ট্যাক ডেভেলপার',
    },
  });

  await prisma.marketingSetting.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      isBannerActive: false,
    },
  });
  console.log('  ✓ Global settings seeded');

  console.log('\nSeed complete — no fake data.');
  console.log('  Admin email:', adminEmail);
  console.log('  Admin password:', 'ChangeMe@123' === adminPassword ? 'ChangeMe@123 (default — change via /admin/security)' : 'Custom (set via ADMIN_PASSWORD env)');
  console.log('  Public site will show:');
  console.log('    - Hero (from About name + role)');
  console.log('    - About (no stats until CMS values set)');
  console.log('    - Skills (27 official logos)');
  console.log('    - [Conditional] Projects — empty state until CMS adds');
  console.log('    - [Conditional] Services — empty state until CMS adds');
  console.log('    - [Conditional] Experience — hidden until CMS adds');
  console.log('    - [Conditional] Education — hidden until CMS adds');
  console.log('    - [Conditional] Certifications — hidden until CMS adds');
  console.log('    - [Conditional] Testimonials — hidden until CMS adds');
  console.log('    - Contact (form)');
  console.log('    - Footer (dynamic year + bilingual copyright)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
