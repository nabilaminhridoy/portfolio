import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { TestimonialForm } from '../_components/testimonial-form';

export const metadata = {
  title: 'Edit Testimonial',
};

export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await db.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    notFound();
  }

  return (
    <TestimonialForm
      mode="edit"
      initial={{
        id: testimonial.id,
        authorName: testimonial.authorName,
        authorRoleEn: testimonial.authorRoleEn ?? '',
        authorRoleBn: testimonial.authorRoleBn ?? '',
        companyEn: testimonial.companyEn ?? '',
        companyBn: testimonial.companyBn ?? '',
        avatarUrl: testimonial.avatarUrl ?? '',
        contentEn: testimonial.contentEn,
        contentBn: testimonial.contentBn,
        rating: testimonial.rating,
        status: testimonial.status,
        order: testimonial.order,
      }}
    />
  );
}
