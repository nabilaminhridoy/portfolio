import { ServiceForm } from '../_components/service-form';

export const metadata = {
  title: 'New Service',
};

export default function NewServicePage() {
  return (
    <ServiceForm
      mode="create"
      initial={{
        titleEn: '',
        titleBn: '',
        descriptionEn: '',
        descriptionBn: '',
        icon: 'Code2',
        featuresEn: '',
        featuresBn: '',
        status: 'ACTIVE',
        order: 0,
      }}
    />
  );
}
