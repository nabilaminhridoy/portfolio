import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import type { Locale } from '@/i18n/routing';

import { Link } from '@/i18n/routing';
import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { ProjectDetailTracker } from '@/components/public/project-detail-tracker';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Star,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await db.project.findUnique({ where: { slug } });
  if (!project) return { title: 'Project not found' };
  const title = locale === 'bn' ? project.titleBn : project.titleEn;
  const summary = locale === 'bn' ? project.summaryBn : project.summaryEn;
  return {
    title,
    description: summary ?? '',
    openGraph: {
      title,
      description: summary ?? '',
      images: project.thumbnailUrl ? [{ url: project.thumbnailUrl }] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const currentLocale = locale as Locale;

  const tDetail = await getTranslations({ locale, namespace: 'ProjectDetail' });
  const tProjects = await getTranslations({ locale, namespace: 'ProjectsPage' });

  const project = await db.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project || project.status !== 'PUBLISHED') {
    notFound();
  }

  // Fetch related projects (same tech, exclude current, limit 3)
  const techList = project.technologies.split(',').map((t) => t.trim()).filter(Boolean);
  const relatedProjects = await db.project.findMany({
    where: {
      status: 'PUBLISHED',
      slug: { not: slug },
      OR: techList.map((tech) => ({
        technologies: { contains: tech },
      })),
    },
    take: 3,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  const title = currentLocale === 'bn' ? project.titleBn : project.titleEn;
  const summary = currentLocale === 'bn' ? project.summaryBn : project.summaryEn;
  const description = currentLocale === 'bn' ? project.descriptionBn : project.descriptionEn;

  const allImages = [
    ...(project.thumbnailUrl ? [project.thumbnailUrl] : []),
    ...project.images.map((img) => img.url),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Tracking: ViewProject + ClickLiveDemo + ClickGitHub */}
      <ProjectDetailTracker
        slug={project.slug}
        title={title}
        demoUrl={project.demoUrl}
        githubUrl={project.githubUrl}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-border bg-muted/20 pt-28 pb-4">
        <Container>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects" className="text-sm text-muted-foreground">
                  {tProjects('title')}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium text-foreground">
                  {title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </div>

      {/* Project header */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.isFeatured && (
                <Badge className="gap-1.5 bg-primary/10 text-primary">
                  <Star className="h-3 w-3 fill-brand-cyan text-brand-cyan" />
                  Featured
                </Badge>
              )}
              {project.completedAt && (
                <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                  <Calendar className="h-3 w-3" />
                  {project.completedAt.toLocaleDateString(currentLocale === 'bn' ? 'bn-BD' : 'en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </Badge>
              )}
            </div>

            <h1 className="text-h1 font-bold tracking-tight text-foreground">{title}</h1>
            {summary && (
              <p className="max-w-3xl text-body-lg leading-relaxed text-muted-foreground">
                {summary}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.demoUrl && (
                <Button asChild size="lg" className="gap-2">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {tDetail('liveDemo')}
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    {tDetail('sourceCode')}
                  </a>
                </Button>
              )}
              <LinkButton href="/projects" variant="ghost" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {tDetail('backToProjects')}
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery */}
      {allImages.length > 0 && (
        <section className="py-8">
          <Container>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {allImages.map((url, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-lg border border-border bg-muted shadow-card ${
                    idx === 0 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <img
                    src={url}
                    alt={`${title} — image ${idx + 1}`}
                    className={`w-full object-cover ${idx === 0 ? 'aspect-[16/9]' : 'aspect-video'}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Description + Tech */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Description — 2/3 width */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-h3 font-bold tracking-tight text-foreground">
                {tDetail('description')}
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-body leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {/* Tech stack sidebar — 1/3 width */}
            <div>
              <Card className="border-border bg-card shadow-card sticky top-24">
                <CardContent className="space-y-4 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {tDetail('technologies')}
                  </h3>
                  {techList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {techList.map((tech) => (
                        <Badge key={tech} variant="outline" className="font-mono text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-border bg-muted/20 py-12 sm:py-16">
          <Container>
            <h2 className="mb-8 text-h3 font-bold tracking-tight text-foreground">
              {tDetail('relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rp) => {
                const rpTitle = currentLocale === 'bn' ? rp.titleBn : rp.titleEn;
                return (
                  <Link
                    key={rp.id}
                    href={`/projects/${rp.slug}`}
                    className="block"
                  >
                    <Card className="w-full overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {rp.thumbnailUrl ? (
                          <img
                            src={rp.thumbnailUrl}
                            alt={rpTitle}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-dark">
                            <span className="text-3xl font-bold text-white/80">
                              {rpTitle.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{rpTitle}</h3>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
