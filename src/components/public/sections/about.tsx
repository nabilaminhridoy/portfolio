import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';

interface AboutData {
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  bioEn: string;
  bioBn: string;
  profileImageUrl: string | null;
  locationEn: string | null;
  locationBn: string | null;
  email: string | null;
  phone: string | null;
  locale: 'en' | 'bn';
  /** CMS-controlled stats — null means "not configured" → hidden */
  yearsExperience: number | null;
  projectsCompleted: number | null;
  happyClients: number | null;
  technologiesCount: number | null;
}

export async function About({ data }: { data: AboutData }) {
  const tAbout = await getTranslations('About');

  const name = data.locale === 'bn' ? data.nameBn : data.nameEn;
  const role = data.locale === 'bn' ? data.roleBn : data.roleEn;
  const bio = data.locale === 'bn' ? data.bioBn : data.bioEn;

  // Build stats list — only include stats that have been configured in CMS (non-null)
  const stats: { label: string; value: number; suffix: string }[] = [];
  if (data.yearsExperience != null) {
    stats.push({ label: tAbout('yearsExperience'), value: data.yearsExperience, suffix: '+' });
  }
  if (data.projectsCompleted != null) {
    stats.push({ label: tAbout('projectsCompleted'), value: data.projectsCompleted, suffix: '+' });
  }
  if (data.happyClients != null) {
    stats.push({ label: tAbout('happyClients'), value: data.happyClients, suffix: '+' });
  }
  if (data.technologiesCount != null) {
    stats.push({ label: tAbout('technologies'), value: data.technologiesCount, suffix: '+' });
  }

  return (
    <section id="about" className="py-16 sm:py-24">
      <Container>
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {tAbout('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{tAbout('title')}</h2>
        </div>

        {/* Centered identity — profile image + name + role, all centered */}
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          {/* Profile photo */}
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-border bg-muted shadow-card sm:h-44 sm:w-44">
            {data.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/40">
                <svg
                  className="h-16 w-16 text-muted-foreground/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              </div>
            )}
          </div>

          {/* Identity — name + role (single, no duplicate) */}
          <div className="space-y-1">
            <h3 className="text-h2 font-bold tracking-tight text-foreground sm:text-h1">{name}</h3>
            <p className="text-lg font-medium text-primary sm:text-xl">{role}</p>
          </div>

          {/* Bio — directly after identity */}
          {bio ? (
            <p className="mx-auto max-w-2xl text-body-lg leading-relaxed text-muted-foreground">
              {bio}
            </p>
          ) : (
            <p className="mx-auto max-w-2xl text-body-lg leading-relaxed text-muted-foreground/60 italic">
              {data.locale === 'bn'
                ? 'পরিচিতি সম্পর্কে বিস্তারিত লিখতে অ্যাডমিন প্যানেল থেকে আপডেট করুন।'
                : 'Update the bio from the admin panel to add details about yourself.'}
            </p>
          )}

          {/* Stats grid — only renders if at least one stat is configured */}
          {stats.length > 0 && (
            <div className="grid w-full grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border bg-card text-center shadow-card">
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold tracking-tight text-gradient-brand sm:text-3xl">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
