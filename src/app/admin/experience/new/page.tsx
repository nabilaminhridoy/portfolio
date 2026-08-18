import { ExperienceForm } from '../_components/experience-form';

export const metadata = {
  title: 'New Experience',
};

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function NewExperiencePage() {
  return (
    <ExperienceForm
      mode="create"
      initial={{
        companyEn: '',
        companyBn: '',
        roleEn: '',
        roleBn: '',
        descriptionEn: '',
        descriptionBn: '',
        locationEn: '',
        locationBn: '',
        startDate: todayIsoDate(),
        endDate: '',
        current: false,
        order: 0,
      }}
    />
  );
}
