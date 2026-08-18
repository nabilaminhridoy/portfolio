'use client';

export interface EducationRow {
  id: string;
  institutionEn: string;
  institutionBn: string;
  degreeEn: string;
  degreeBn: string;
  fieldEn: string | null;
  fieldBn: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
  createdAt: Date;
}
