import { TestimonialForm } from '../_components/testimonial-form';

export const metadata = {
  title: 'New Testimonial',
};

export default function NewTestimonialPage() {
  return (
    <TestimonialForm
      mode="create"
      initial={{
        authorName: '',
        authorRoleEn: '',
        authorRoleBn: '',
        companyEn: '',
        companyBn: '',
        avatarUrl: '',
        contentEn: '',
        contentBn: '',
        rating: 5,
        status: 'ACTIVE',
        order: 0,
      }}
    />
  );
}
