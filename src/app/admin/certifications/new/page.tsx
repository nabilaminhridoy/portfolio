import { CertificationForm } from '../_components/certification-form';

export const metadata = {
  title: 'New Certification',
};

export default function NewCertificationPage() {
  // Default issue date = today
  const today = new Date().toISOString().slice(0, 10);

  return (
    <CertificationForm
      mode="create"
      initial={{
        titleEn: '',
        titleBn: '',
        organization: '',
        credentialId: '',
        credentialUrl: '',
        issueDate: today,
        expiryDate: '',
        certificateImageUrl: '',
        descriptionEn: '',
        descriptionBn: '',
        skills: '',
        isFeatured: false,
        status: 'ACTIVE',
        order: 0,
      }}
    />
  );
}
