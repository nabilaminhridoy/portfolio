'use client';

export interface SkillRow {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  level: number;
  status: string;
  order: number;
  createdAt: Date;
}
