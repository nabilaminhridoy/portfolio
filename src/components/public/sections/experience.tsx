import { getTranslations } from 'next-intl/server';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExperienceItem {
  id: string;
  companyEn: string;
  companyBn: string;
  roleEn: string;
  roleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  locationEn: string | null;
  locationBn: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
}

interface ExperienceData {
  experience: ExperienceItem[];
  locale: 'en' | 'bn';
}

/**
 * Format a Date as "Mon YYYY" (e.g. "Jan 2023") using the en-US locale so the
 * timeline reads consistently across EN/BN contexts (month abbreviations stay
 * locale-stable; full date localization is handled at the translation layer
 * for labels).
 */
function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export async function Experience({ data }: { data: ExperienceData }) {
  const tExperience = await getTranslations('Experience');

  if (data.experience.length === 0) {
    return null;
  }

  // Trust the DB query order (newest → oldest: current first, then startDate desc).
  // Do NOT re-sort here — keeps the source of truth in the query layer.
  const sorted = data.experience;

  const presentLabel = tExperience('present');

  return (
    <section id="experience" className="py-16 sm:py-24">
      <Container>
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {tExperience('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">
            {tExperience('title')}
          </h2>
        </div>

        {/* Vertical timeline — centered with reading-friendly max width */}
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="relative space-y-6 border-l-2 border-border pl-6">
            {sorted.map((item) => (
              <ExperienceEntry
                key={item.id}
                item={item}
                locale={data.locale}
                presentLabel={presentLabel}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ExperienceEntry({
  item,
  locale,
  presentLabel,
}: {
  item: ExperienceItem;
  locale: 'en' | 'bn';
  presentLabel: string;
}) {
  const role = locale === 'bn' ? item.roleBn : item.roleEn;
  const company = locale === 'bn' ? item.companyBn : item.companyEn;
  const description = locale === 'bn' ? item.descriptionBn : item.descriptionEn;
  const location = locale === 'bn' ? item.locationBn : item.locationEn;

  const start = formatMonthYear(item.startDate);
  const end = item.current
    ? presentLabel
    : item.endDate
      ? formatMonthYear(item.endDate)
      : presentLabel;

  return (
    <div className="group relative">
      {/* Timeline dot — centered on the parent's left border (pl-6 + half border + half dot) */}
      <span
        className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-gradient-brand ring-4 ring-background transition-transform duration-300 group-hover:scale-125"
        aria-hidden="true"
      />

      <Card className="border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
        <CardContent className="space-y-3 p-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-base font-semibold text-foreground">{role}</h3>
              <p className="text-sm font-medium text-primary">{company}</p>
            </div>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
              aria-hidden="true"
            >
              <Briefcase className="h-4 w-4" />
            </span>
          </div>

          {/* Date range + location */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <Badge
              variant="secondary"
              className="gap-1.5 font-mono text-xs"
            >
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span>{start}</span>
              <span className="text-muted-foreground" aria-hidden="true">
                →
              </span>
              <span>{end}</span>
            </Badge>
            {location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {location}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
