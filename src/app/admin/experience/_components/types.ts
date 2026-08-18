'use client';

export interface ExperienceRow {
  id: string;
  companyEn: string;
  companyBn: string;
  roleEn: string;
  roleBn: string;
  locationEn: string | null;
  locationBn: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
  createdAt: Date;
}
