import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ServiceForm } from '../_components/service-form';

export const metadata = {
  title: 'Edit Service',
};

export const dynamic = 'force-dynamic';

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await db.service.findUnique({ where: { id } });

  if (!service) {
    notFound();
  }

  return (
    <ServiceForm
      mode="edit"
      initial={{
        id: service.id,
        titleEn: service.titleEn,
        titleBn: service.titleBn,
        descriptionEn: service.descriptionEn,
        descriptionBn: service.descriptionBn,
        icon: service.icon,
        featuresEn: service.featuresEn,
        featuresBn: service.featuresBn,
        status: service.status,
        order: service.order,
      }}
    />
  );
}
