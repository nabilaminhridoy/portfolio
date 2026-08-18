import { EducationForm } from '../_components/education-form';

export const metadata = {
  title: 'New Education',
};

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function NewEducationPage() {
  return (
    <EducationForm
      mode="create"
      initial={{
        institutionEn: '',
        institutionBn: '',
        degreeEn: '',
        degreeBn: '',
        fieldEn: '',
        fieldBn: '',
        descriptionEn: '',
        descriptionBn: '',
        startDate: todayIsoDate(),
        endDate: '',
        current: false,
        order: 0,
      }}
    />
  );
}
