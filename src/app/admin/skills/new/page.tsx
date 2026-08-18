import { SkillForm } from '../_components/skill-form';

export const metadata = {
  title: 'New Skill',
};

export default function NewSkillPage() {
  return (
    <SkillForm
      mode="create"
      initial={{
        name: '',
        slug: '',
        category: 'Frontend',
        descriptionEn: '',
        descriptionBn: '',
        logoUrl: '',
        level: 50,
        status: 'ACTIVE',
        order: 0,
      }}
    />
  );
}
