'use client';

export interface ProjectsPageProject {
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
