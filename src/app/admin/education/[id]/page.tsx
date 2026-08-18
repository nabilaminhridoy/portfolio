import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { EducationForm, toDateInputValue } from '../_components/education-form';

export const metadata = {
  title: 'Edit Education',
};

export const dynamic = 'force-dynamic';

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const education = await db.education.findUnique({ where: { id } });

  if (!education) {
    notFound();
  }

  return (
    <EducationForm
      mode="edit"
      initial={{
        id: education.id,
        institutionEn: education.institutionEn,
        institutionBn: education.institutionBn,
        degreeEn: education.degreeEn,
        degreeBn: education.degreeBn,
        fieldEn: education.fieldEn ?? '',
        fieldBn: education.fieldBn ?? '',
        descriptionEn: education.descriptionEn ?? '',
        descriptionBn: education.descriptionBn ?? '',
        startDate: toDateInputValue(education.startDate),
        endDate: education.endDate ? toDateInputValue(education.endDate) : '',
        current: education.current,
        order: education.order,
      }}
    />
  );
}
