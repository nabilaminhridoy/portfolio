import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ExperienceForm, toDateInputValue } from '../_components/experience-form';

export const metadata = {
  title: 'Edit Experience',
};

export const dynamic = 'force-dynamic';

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experience = await db.experience.findUnique({ where: { id } });

  if (!experience) {
    notFound();
  }

  return (
    <ExperienceForm
      mode="edit"
      initial={{
        id: experience.id,
        companyEn: experience.companyEn,
        companyBn: experience.companyBn,
        roleEn: experience.roleEn,
        roleBn: experience.roleBn,
        descriptionEn: experience.descriptionEn,
        descriptionBn: experience.descriptionBn,
        locationEn: experience.locationEn ?? '',
        locationBn: experience.locationBn ?? '',
        startDate: toDateInputValue(experience.startDate),
        endDate: experience.endDate ? toDateInputValue(experience.endDate) : '',
        current: experience.current,
        order: experience.order,
      }}
    />
  );
}
