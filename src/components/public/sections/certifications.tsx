import { getTranslations } from 'next-intl/server';
import { Award, ExternalLink, Calendar, ShieldCheck, Star } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CertificationItem {
  id: string;
  titleEn: string;
  titleBn: string;
  organization: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: Date;
  expiryDate: Date | null;
  certificateImageUrl: string | null;
  descriptionEn: string | null;
  descriptionBn: string | null;
  skills: string;
  isFeatured: boolean;
  order: number;
}

interface CertificationsData {
  certifications: CertificationItem[];
  locale: 'en' | 'bn';
}

function formatDate(d: Date, locale: 'en' | 'bn'): string {
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';
  return d.toLocaleDateString(localeCode, { month: 'short', year: 'numeric' });
}

export async function Certifications({ data }: { data: CertificationsData }) {
  const t = await getTranslations('Certifications');

  if (data.certifications.length === 0) {
    return null; // Conditional: hide entire section when no active certifications
  }

  const labels = {
    issued: t('issued'),
    expires: t('expires'),
    noExpiry: t('noExpiry'),
    verify: t('verify'),
    viewCredential: t('viewCredential'),
    featured: t('featured'),
    skills: t('skills'),
  };

  return (
    <section id="certifications" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            {t('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              locale={data.locale}
              labels={labels}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CertificationCard({
  cert,
  locale,
  labels,
}: {
  cert: CertificationItem;
  locale: 'en' | 'bn';
  labels: { issued: string; expires: string; noExpiry: string; verify: string; viewCredential: string; featured: string; skills: string };
}) {
  const title = locale === 'bn' ? cert.titleBn : cert.titleEn;
  const description = locale === 'bn' ? cert.descriptionBn : cert.descriptionEn;
  const techs = cert.skills.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <Card className="group flex flex-col overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
      {/* Certificate preview */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {cert.certificateImageUrl ? (
          <img
            src={cert.certificateImageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-dark">
            <Award className="h-12 w-12 text-white/60" aria-hidden="true" />
          </div>
        )}
        {cert.isFeatured && (
          <Badge className="absolute right-2 top-2 gap-1 bg-background/80 text-foreground backdrop-blur">
            <Star className="h-3 w-3 fill-brand-cyan text-brand-cyan" />
            {labels.featured}
          </Badge>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm font-medium text-primary">{cert.organization}</p>
        </div>

        {description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        )}

        {/* Dates */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {labels.issued}: <span className="font-medium text-foreground">{formatDate(cert.issueDate, locale)}</span>
          </span>
          {cert.expiryDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {labels.expires}: <span className="font-medium text-foreground">{formatDate(cert.expiryDate, locale)}</span>
            </span>
          )}
        </div>

        {/* Skills */}
        {techs.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{labels.skills}</p>
            <div className="flex flex-wrap gap-1">
              {techs.map((tech) => (
                <Badge key={tech} variant="outline" className="font-mono text-[10px]">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Credential info + verify button */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            {cert.credentialId && (
              <p className="truncate text-xs text-muted-foreground">
                <ShieldCheck className="mr-1 inline h-3 w-3" />
                ID: <span className="font-mono">{cert.credentialId}</span>
              </p>
            )}
          </div>
          {cert.credentialUrl && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 shrink-0">
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                {labels.verify}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
