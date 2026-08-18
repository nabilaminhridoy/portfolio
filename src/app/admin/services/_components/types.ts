'use client';

export interface ServiceRow {
  id: string;
  titleEn: string;
  titleBn: string;
  icon: string;
  featuresEn: string;
  featuresBn: string;
  status: string;
  order: number;
  createdAt: Date;
}
