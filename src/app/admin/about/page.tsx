import { db } from '@/lib/db';
import { AboutForm } from './_components/about-form';

export const metadata = {
  title: 'About',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const about = await db.about.findFirst({});

  return (
    <AboutForm
      initial={
        about
          ? {
              id: about.id,
              nameEn: about.nameEn,
              nameBn: about.nameBn,
              roleEn: about.roleEn,
              roleBn: about.roleBn,
              bioEn: about.bioEn,
              bioBn: about.bioBn,
              locationEn: about.locationEn ?? '',
              locationBn: about.locationBn ?? '',
              email: about.email ?? '',
              phone: about.phone ?? '',
              profileImageUrl: about.profileImageUrl ?? '',
              available: about.available,
              yearsExperience: about.yearsExperience,
              projectsCompleted: about.projectsCompleted,
              happyClients: about.happyClients,
              technologiesCount: about.technologiesCount,
            }
          : undefined
      }
    />
  );
}
