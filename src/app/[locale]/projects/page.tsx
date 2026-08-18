import { setRequestLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import type { Locale } from '@/i18n/routing';

import { Container } from '@/components/layout/container';
import { ProjectsGridClient } from './_components/projects-grid-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProjectsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;

  const tProjects = await getTranslations({ locale, namespace: 'ProjectsPage' });
  const tDetail = await getTranslations({ locale, namespace: 'ProjectDetail' });

  const projects = await db.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  const projectData = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleBn: p.titleBn,
    summaryEn: p.summaryEn,
    summaryBn: p.summaryBn,
    thumbnailUrl: p.thumbnailUrl,
    demoUrl: p.demoUrl,
    githubUrl: p.githubUrl,
    technologies: p.technologies,
    isFeatured: p.isFeatured,
  }));

  const labels = {
    filterAll: tProjects('filterAll'),
    filterByTech: tProjects('filterByTech'),
    noResults: tProjects('noResults'),
    noProjects: tProjects('noProjects'),
    noProjectsDescription: tProjects('noProjectsDescription'),
    viewProject: tDetail('viewProject'),
    liveDemo: tDetail('liveDemo'),
    sourceCode: tDetail('sourceCode'),
    featured: 'Featured',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <section className="border-b border-border bg-muted/20 pt-32 pb-12 sm:pt-36">
        <Container>
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {tProjects('subtitle')}
            </p>
            <h1 className="text-h1 font-bold tracking-tight">{tProjects('title')}</h1>
          </div>
        </Container>
      </section>

      {/* Projects grid */}
      <section className="py-12 sm:py-16">
        <Container>
          <ProjectsGridClient
            projects={projectData}
            locale={currentLocale}
            labels={labels}
          />
        </Container>
      </section>
    </div>
  );
}
