import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProjectForm } from '../_components/project-form';

export const metadata = {
  title: 'Edit Project',
};

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm
      mode="edit"
      initial={{
        id: project.id,
        titleEn: project.titleEn,
        titleBn: project.titleBn,
        slug: project.slug,
        summaryEn: project.summaryEn ?? '',
        summaryBn: project.summaryBn ?? '',
        descriptionEn: project.descriptionEn,
        descriptionBn: project.descriptionBn,
        thumbnailUrl: project.thumbnailUrl ?? '',
        demoUrl: project.demoUrl ?? '',
        githubUrl: project.githubUrl ?? '',
        technologies: project.technologies,
        status: project.status,
        isFeatured: project.isFeatured,
        order: project.order,
      }}
    />
  );
}
