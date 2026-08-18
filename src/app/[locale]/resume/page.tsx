import { setRequestLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import type { Locale } from '@/i18n/routing';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/feedback/empty-state';
import { LinkButton } from '@/components/ui/link-button';
import { ResumeDownloadTracker } from '@/components/public/resume-download-tracker';
import { Download, FileText, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ResumePage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;

  const tResume = await getTranslations({ locale, namespace: 'ResumePage' });

  const resume = await db.resume.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const summary = currentLocale === 'bn' ? resume?.summaryBn : resume?.summaryEn;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <section className="border-b border-border bg-muted/20 pt-32 pb-12 sm:pt-36">
        <Container>
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {tResume('subtitle')}
            </p>
            <h1 className="text-h1 font-bold tracking-tight">{tResume('title')}</h1>
          </div>
        </Container>
      </section>

      {/* Resume content */}
      <section className="py-12 sm:py-16">
        <Container>
          {resume ? (
            <div className="mx-auto max-w-3xl">
              {/* Tracking: DownloadResume */}
              <ResumeDownloadTracker resumeUrl={resume.fileUrl} />

              <Card className="overflow-hidden border-border bg-card shadow-card">
                {/* Resume preview area */}
                <div className="flex aspect-[8.5/11] w-full items-center justify-center bg-muted">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <FileText className="h-16 w-16" />
                    <p className="text-sm">PDF Resume</p>
                  </div>
                </div>

                <CardContent className="space-y-4 p-6">
                  {/* Version badge */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {tResume('version')}: {resume.version}
                    </Badge>
                  </div>

                  {/* Summary */}
                  {summary && (
                    <div className="space-y-1">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {tResume('summary')}
                      </h2>
                      <p className="text-body leading-relaxed text-foreground">{summary}</p>
                    </div>
                  )}

                  {/* Download button */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild size="lg" className="gap-2">
                      <a
                        href={resume.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Download className="h-4 w-4" />
                        {tResume('download')}
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4" />
                        View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Back to home */}
              <div className="mt-8 flex justify-center">
                <LinkButton href="/" variant="ghost" size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {tResume('backToHome')}
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md">
              <EmptyState
                title={tResume('noResume')}
                description={tResume('noResumeDescription')}
                icon={<FileText className="h-7 w-7" />}
              />
              <div className="mt-6 flex justify-center">
                <LinkButton href="/" variant="ghost" size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {tResume('backToHome')}
                </LinkButton>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
