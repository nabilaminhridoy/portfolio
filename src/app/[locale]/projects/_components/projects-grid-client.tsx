'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Star, ExternalLink, Github } from 'lucide-react';

import { Link } from '@/i18n/routing';
import { LinkButton } from '@/components/ui/link-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import type { ProjectsPageProject } from './types';

interface ProjectsGridClientProps {
  projects: ProjectsPageProject[];
  locale: 'en' | 'bn';
  labels: {
    filterAll: string;
    filterByTech: string;
    noResults: string;
    noProjects: string;
    noProjectsDescription: string;
    viewProject: string;
    liveDemo: string;
    sourceCode: string;
    featured: string;
  };
}

export function ProjectsGridClient({ projects, locale, labels }: ProjectsGridClientProps) {
  const [activeTech, setActiveTech] = React.useState<string>('all');

  // Extract unique tech tags from all projects
  const allTechs = React.useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      const techs = p.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      for (const t of techs) set.add(t);
    }
    return Array.from(set).sort();
  }, [projects]);

  // Filter projects by selected tech
  const filtered = React.useMemo(() => {
    if (activeTech === 'all') return projects;
    return projects.filter((p) =>
      p.technologies.split(',').map((t) => t.trim()).includes(activeTech)
    );
  }, [projects, activeTech]);

  if (projects.length === 0) {
    return (
      <EmptyState
        title={labels.noProjects}
        description={labels.noProjectsDescription}
        icon={<Star className="h-7 w-7" />}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Tech filter */}
      {allTechs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {labels.filterByTech}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTech('all')}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTech === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {labels.filterAll}
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveTech(tech)}
                className={`rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
                  activeTech === tech
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title={labels.noResults}
          description=""
          icon={<Star className="h-7 w-7" />}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              labels={labels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  locale,
  labels,
}: {
  project: ProjectsPageProject;
  locale: 'en' | 'bn';
  labels: { viewProject: string; liveDemo: string; sourceCode: string; featured: string };
}) {
  const title = locale === 'bn' ? project.titleBn : project.titleEn;
  const summary = locale === 'bn' ? project.summaryBn : project.summaryEn;
  const techs = project.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4);

  return (
    <Card className="group flex flex-col overflow-hidden border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1">
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
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
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
        <div className="mt-auto flex items-center gap-2 pt-2">
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
