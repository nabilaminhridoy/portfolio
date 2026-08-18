import { setRequestLocale } from 'next-intl/server';
import { db } from '@/lib/db';
import type { Locale } from '@/i18n/routing';

import { Hero } from '@/components/public/sections/hero';
import { About } from '@/components/public/sections/about';
import { Skills } from '@/components/public/sections/skills';
import { Projects } from '@/components/public/sections/projects';
import { Services } from '@/components/public/sections/services';
import { Experience } from '@/components/public/sections/experience';
import { Education } from '@/components/public/sections/education';
import { Certifications } from '@/components/public/sections/certifications';
import { Testimonials } from '@/components/public/sections/testimonials';
import { Contact } from '@/components/public/sections/contact';
import { MarketingBanner } from '@/components/public/marketing-banner';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const currentLocale = locale as Locale;

  // Fetch all home page data in parallel — include marketing settings for banner
  const [
    about,
    skills,
    projects,
    services,
    experiences,
    educations,
    certifications,
    testimonials,
    activeResume,
    marketingSetting,
    socialLinks,
    siteSettings,
  ] = await Promise.all([
    db.about.findFirst({}),
    db.skill.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    }),
    db.project.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    db.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    db.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
    }),
    db.education.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
    }),
    db.certification.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ isFeatured: 'desc' }, { issueDate: 'desc' }, { order: 'asc' }],
    }),
    db.testimonial.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    db.resume.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.marketingSetting.findUnique({ where: { id: 'global' } }),
    // Social links — ordered by Admin-defined display order
    db.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    db.settings.findUnique({ where: { id: 'global' } }),
  ]);

  // Build hero data (fall back to translation tagline if bio empty)
  const heroData = about
    ? {
        nameEn: about.nameEn,
        nameBn: about.nameBn,
        roleEn: about.roleEn,
        roleBn: about.roleBn,
        bioEn: about.bioEn,
        bioBn: about.bioBn,
        available: about.available,
        resumeUrl: activeResume?.fileUrl ?? null,
        locale: currentLocale,
      }
    : {
        nameEn: 'Nabil Amin Hridoy',
        nameBn: 'নাবিল আমিন হৃদয়',
        roleEn: 'Full Stack Developer',
        roleBn: 'ফুল স্ট্যাক ডেভেলপার',
        bioEn: '',
        bioBn: '',
        available: true,
        resumeUrl: null,
        locale: currentLocale,
      };

  return (
    <>
      {/* 1. Hero */}
      <Hero data={heroData} />

      {/* Marketing banner — conditional (only renders if isBannerActive=true) */}
      {marketingSetting && (
        <MarketingBanner
          data={{
            bannerTitleEn: marketingSetting.bannerTitleEn,
            bannerTitleBn: marketingSetting.bannerTitleBn,
            bannerTextEn: marketingSetting.bannerTextEn,
            bannerTextBn: marketingSetting.bannerTextBn,
            bannerCtaLabelEn: marketingSetting.bannerCtaLabelEn,
            bannerCtaLabelBn: marketingSetting.bannerCtaLabelBn,
            bannerCtaUrl: marketingSetting.bannerCtaUrl,
            isBannerActive: marketingSetting.isBannerActive,
            locale: currentLocale,
          }}
        />
      )}

      {/* 2. About — only render if About record exists */}
      {about && (
        <About
          data={{
            nameEn: about.nameEn,
            nameBn: about.nameBn,
            roleEn: about.roleEn,
            roleBn: about.roleBn,
            bioEn: about.bioEn,
            bioBn: about.bioBn,
            profileImageUrl: about.profileImageUrl,
            locationEn: about.locationEn,
            locationBn: about.locationBn,
            email: about.email,
            phone: about.phone,
            locale: currentLocale,
            // CMS-controlled stats — null = hidden
            yearsExperience: about.yearsExperience,
            projectsCompleted: about.projectsCompleted,
            happyClients: about.happyClients,
            technologiesCount: about.technologiesCount,
          }}
        />
      )}

      {/* 3. Skills — conditional on having at least one active skill */}
      {skills.length > 0 && (
        <Skills data={{ skills, locale: currentLocale }} />
      )}

      {/* 4. Featured Projects — conditional on having at least one featured project */}
      {projects.length > 0 && (
        <Projects data={{ projects, locale: currentLocale }} />
      )}

      {/* 5. Services — conditional on having at least one active service */}
      {services.length > 0 && (
        <Services data={{ services, locale: currentLocale }} />
      )}

      {/* 6. Experience — conditional */}
      {experiences.length > 0 && (
        <Experience data={{ experience: experiences, locale: currentLocale }} />
      )}

      {/* 7. Education — conditional */}
      {educations.length > 0 && (
        <Education data={{ education: educations, locale: currentLocale }} />
      )}

      {/* 8. Certifications — CONDITIONAL: hide entirely if no active certs */}
      {certifications.length > 0 && (
        <Certifications data={{ certifications, locale: currentLocale }} />
      )}

      {/* 9. Testimonials — CONDITIONAL: hide entirely if no active testimonials */}
      {testimonials.length > 0 && (
        <Testimonials data={{ testimonials, locale: currentLocale }} />
      )}

      {/* 10. Contact — always render (form is the main interaction) */}
      {about && (
        <Contact
          info={{
            email: siteSettings?.email ?? about.email,
            phone: siteSettings?.phone ?? about.phone,
            locationEn: siteSettings?.location ?? about.locationEn,
            locationBn: siteSettings?.location ?? about.locationBn,
            locale: currentLocale,
            socialLinks: socialLinks.map((s) => ({
              id: s.id,
              platform: s.platform,
              label: s.label,
              url: s.url,
              isActive: s.isActive,
              order: s.order,
            })),
            turnstile: {
              enabled: siteSettings?.turnstileEnabled ?? false,
              siteKey: siteSettings?.turnstileSiteKey ?? null,
            },
          }}
        />
      )}
    </>
  );
}
