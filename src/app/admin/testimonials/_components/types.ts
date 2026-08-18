'use client';

export interface TestimonialRow {
  id: string;
  authorName: string;
  authorRoleEn: string | null;
  authorRoleBn: string | null;
  companyEn: string | null;
  companyBn: string | null;
  avatarUrl: string | null;
  contentEn: string;
  contentBn: string;
  rating: number;
  status: string;
  order: number;
  createdAt: Date;
}
