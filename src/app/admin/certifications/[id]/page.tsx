import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CertificationForm } from '../_components/certification-form';

export const metadata = {
  title: 'Edit Certification',
};

export const dynamic = 'force-dynamic';

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await db.certification.findUnique({ where: { id } });

  if (!cert) {
    notFound();
  }

  // Convert DB Date → yyyy-mm-dd for input[type=date]
  const toDateInput = (d: Date | null) => {
    if (!d) return '';
    return d.toISOString().slice(0, 10);
  };

  return (
    <CertificationForm
      mode="edit"
      initial={{
        id: cert.id,
        titleEn: cert.titleEn,
        titleBn: cert.titleBn,
        organization: cert.organization,
        credentialId: cert.credentialId ?? '',
        credentialUrl: cert.credentialUrl ?? '',
        issueDate: toDateInput(cert.issueDate),
        expiryDate: toDateInput(cert.expiryDate),
        certificateImageUrl: cert.certificateImageUrl ?? '',
        descriptionEn: cert.descriptionEn ?? '',
        descriptionBn: cert.descriptionBn ?? '',
        skills: cert.skills,
        isFeatured: cert.isFeatured,
        status: cert.status,
        order: cert.order,
      }}
    />
  );
}
