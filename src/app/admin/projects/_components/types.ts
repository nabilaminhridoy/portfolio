'use client';

export interface ProjectRow {
  id: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  thumbnailUrl: string | null;
  technologies: string;
  status: string;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
}
