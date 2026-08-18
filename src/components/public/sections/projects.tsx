import { getTranslations } from 'next-intl/server';
import { ArrowRight, ExternalLink, Github, Star } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/link-button';
import { EmptyState } from '@/components/feedback/empty-state';

interface ProjectItem {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string | null;
  summaryBn: string | null;
  thumbnailUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  technologies: string;
  isFeatured: boolean;
}

interface ProjectsData {
  projects: ProjectItem[];
  locale: 'en' | 'bn';
}

export async function Projects({ data }: { data: ProjectsData }) {
  const tProjects = await getTranslations('Projects');

  // Show up to 6 featured projects (or any published if fewer featured)
  const featured = data.projects.filter((p) => p.isFeatured).slice(0, 6);
  const display = featured.length > 0 ? featured : data.projects.slice(0, 6);

  const labels = {
    viewProject: tProjects('viewProject'),
    liveDemo: tProjects('liveDemo'),
    sourceCode: tProjects('sourceCode'),
    featured: 'Featured',
  };

  return (
    <section id="projects" className="py-16 sm:py-24">
      <Container>
        <div className="mb-12 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {tProjects('subtitle')}
            </p>
            <h2 className="text-h2 font-bold tracking-tight">{tProjects('title')}</h2>
          </div>
          <LinkButton href="/projects" variant="outline" size="sm" className="gap-2 self-center">
            {tProjects('viewAll')}
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>

        {display.length === 0 ? (
          <EmptyState
            title={tProjects('noProjects')}
            description="New projects coming soon."
            icon={<Star className="h-7 w-7" />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={data.locale}
                labels={labels}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function ProjectCard({
  project,
  locale,
  labels,
}: {
  project: ProjectItem;
  locale: 'en' | 'bn';
  labels: { viewProject: string; liveDemo: string; sourceCode: string; featured: string };
}) {
  const title = locale === 'bn' ? project.titleBn : project.titleEn;
  const summary = locale === 'bn' ? project.summaryBn : project.summaryEn;
  const techs = project.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4);

  return (
    <Card className="group overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-dark">
            <span className="text-3xl font-bold text-white/80">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {project.isFeatured && (
          <Badge className="absolute right-2 top-2 gap-1 bg-background/80 text-foreground backdrop-blur">
            <Star className="h-3 w-3 fill-brand-cyan text-brand-cyan" />
            {labels.featured}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="space-y-3 p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {summary && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
          )}
        </div>

        {/* Tech tags */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <Badge key={tech} variant="outline" className="font-mono text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <LinkButton
            href={`/projects/${project.slug}`}
            variant="default"
            size="sm"
            className="flex-1"
          >
            {labels.viewProject}
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={labels.liveDemo}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={labels.sourceCode}
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
