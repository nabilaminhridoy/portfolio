import { db } from '../src/lib/db';

async function main() {
  const activities = await db.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 15,
    include: { user: { select: { email: true } } },
  });

  console.log(`Total activity logs: ${activities.length}\n`);
  for (const a of activities) {
    console.log(
      `[${a.createdAt.toISOString()}] ${a.action.padEnd(28)} | user=${a.user?.email ?? 'unknown'} | entity=${a.entity ?? '-'}`
    );
  }

  // Also dump key counts
  const userCount = await db.user.count();
  const skillCount = await db.skill.count();
  const projectCount = await db.project.count();
  const socialCount = await db.socialLink.count();
  const activityCount = await db.activityLog.count();
  const settingsCount = await db.settings.count();
  const seoCount = await db.seoSetting.count();
  const smtpCount = await db.smtpSetting.count();
  const brandingCount = await db.brandingSetting.count();
  const marketingCount = await db.marketingSetting.count();
  const trackingCount = await db.trackingSetting.count();
  const aboutCount = await db.about.count();
  const testimonialCount = await db.testimonial.count();
  const serviceCount = await db.service.count();
  const experienceCount = await db.experience.count();
  const educationCount = await db.education.count();
  const resumeCount = await db.resume.count();
  const tokenCount = await db.passwordResetToken.count();

  console.log('\n=== Seed verification ===');
  console.log(`  Users:            ${userCount} (expected 1)`);
  console.log(`  About:            ${aboutCount} (expected 1)`);
  console.log(`  Skills:           ${skillCount} (expected 27)`);
  console.log(`  Projects:         ${projectCount} (expected 3)`);
  console.log(`  Services:         ${serviceCount} (expected 4)`);
  console.log(`  Experiences:      ${experienceCount} (expected 3)`);
  console.log(`  Educations:       ${educationCount} (expected 2)`);
  console.log(`  Testimonials:     ${testimonialCount} (expected 4)`);
  console.log(`  Social Links:     ${socialCount} (expected 8)`);
  console.log(`  Resumes:          ${resumeCount} (expected 1)`);
  console.log(`  Settings rows:    ${settingsCount} (expected 1)`);
  console.log(`  SEO rows:         ${seoCount} (expected 1)`);
  console.log(`  SMTP rows:        ${smtpCount} (expected 1)`);
  console.log(`  Branding rows:    ${brandingCount} (expected 1)`);
  console.log(`  Marketing rows:   ${marketingCount} (expected 1)`);
  console.log(`  Tracking rows:   ${trackingCount} (expected 1)`);
  console.log(`  Reset tokens:     ${tokenCount}`);
  console.log(`  Activity logs:   ${activityCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
