import { db } from '@/lib/db';
import { BingForm } from './_components/bing-form';

export const metadata = {
  title: 'Bing Verification',
};

export const dynamic = 'force-dynamic';

export default async function BingVerificationPage() {
  const seo = await db.seoSetting.findUnique({ where: { id: 'global' } });

  return (
    <BingForm
      initial={{
        bingVerification: seo?.bingVerification ?? '',
      }}
    />
  );
}
