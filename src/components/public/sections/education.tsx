import { getTranslations } from 'next-intl/server';
import { GraduationCap, Calendar } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EducationItem {
  id: string;
  institutionEn: string;
  institutionBn: string;
  degreeEn: string;
  degreeBn: string;
  fieldEn: string | null;
  fieldBn: string | null;
  descriptionEn: string | null;
  descriptionBn: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
}

interface EducationData {
  education: EducationItem[];
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

export async function Education({ data }: { data: EducationData }) {
  const tEducation = await getTranslations('Education');

  if (data.education.length === 0) {
    return null;
  }

  // Trust the DB query order (newest → oldest: current first, then startDate desc).
  // Do NOT re-sort here — keeps the source of truth in the query layer.
  const sorted = data.education;

  const presentLabel = tEducation('present');

  return (
    <section
      id="education"
      className="border-y border-border bg-muted/20 py-16 sm:py-24"
    >
      <Container>
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {tEducation('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">
            {tEducation('title')}
          </h2>
        </div>

        {/* Vertical timeline — centered with reading-friendly max width */}
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="relative space-y-6 border-l-2 border-border pl-6">
            {sorted.map((item) => (
              <EducationEntry
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

function EducationEntry({
  item,
  locale,
  presentLabel,
}: {
  item: EducationItem;
  locale: 'en' | 'bn';
  presentLabel: string;
}) {
  const degree = locale === 'bn' ? item.degreeBn : item.degreeEn;
  const institution = locale === 'bn' ? item.institutionBn : item.institutionEn;
  const field = locale === 'bn' ? item.fieldBn : item.fieldEn;
  const description = locale === 'bn' ? item.descriptionBn : item.descriptionEn;

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
              <h3 className="text-base font-semibold text-foreground">{degree}</h3>
              <p className="text-sm font-medium text-primary">{institution}</p>
            </div>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
              aria-hidden="true"
            >
              <GraduationCap className="h-4 w-4" />
            </span>
          </div>

          {/* Date range + field of study */}
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
            {field && (
              <Badge variant="outline" className="text-xs">
                {field}
              </Badge>
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
