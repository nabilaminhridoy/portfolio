import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SkillForm } from '../_components/skill-form';

export const metadata = {
  title: 'Edit Skill',
};

export const dynamic = 'force-dynamic';

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await db.skill.findUnique({ where: { id } });

  if (!skill) {
    notFound();
  }

  return (
    <SkillForm
      mode="edit"
      initial={{
        id: skill.id,
        name: skill.name,
        slug: skill.slug,
        category: skill.category,
        descriptionEn: skill.descriptionEn ?? '',
        descriptionBn: skill.descriptionBn ?? '',
        logoUrl: skill.logoUrl ?? '',
        level: skill.level,
        status: skill.status,
        order: skill.order,
      }}
    />
  );
}
