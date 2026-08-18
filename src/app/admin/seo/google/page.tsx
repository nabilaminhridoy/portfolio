import { db } from '@/lib/db';
import { GoogleForm } from './_components/google-form';

export const metadata = {
  title: 'Google Verification',
};

export const dynamic = 'force-dynamic';

export default async function GoogleVerificationPage() {
  const seo = await db.seoSetting.findUnique({ where: { id: 'global' } });

  return (
    <GoogleForm
      initial={{
        googleVerification: seo?.googleVerification ?? '',
      }}
    />
  );
}
