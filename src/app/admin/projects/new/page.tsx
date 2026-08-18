import { ProjectForm } from '../_components/project-form';

export const metadata = {
  title: 'New Project',
};

export default function NewProjectPage() {
  return (
    <ProjectForm
      mode="create"
      initial={{
        titleEn: '',
        titleBn: '',
        slug: '',
        summaryEn: '',
        summaryBn: '',
        descriptionEn: '',
        descriptionBn: '',
        thumbnailUrl: '',
        demoUrl: '',
        githubUrl: '',
        technologies: '',
        status: 'PUBLISHED',
        isFeatured: false,
        order: 0,
      }}
    />
  );
}
