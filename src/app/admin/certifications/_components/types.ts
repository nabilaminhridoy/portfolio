'use client';

export interface CertificationRow {
  id: string;
  titleEn: string;
  titleBn: string;
  organization: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: Date;
  expiryDate: Date | null;
  certificateImageUrl: string | null;
  skills: string;
  isFeatured: boolean;
  status: string;
  order: number;
  createdAt: Date;
}
