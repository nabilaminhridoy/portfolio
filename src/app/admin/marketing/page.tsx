import { db } from '@/lib/db';
import { MarketingForm } from './_components/marketing-form';

export const metadata = {
  title: 'Marketing',
};

export const dynamic = 'force-dynamic';

export default async function MarketingPage() {
  const marketing = await db.marketingSetting.findUnique({ where: { id: 'global' } });

  return (
    <MarketingForm
      initial={
        marketing
          ? {
              bannerTitleEn: marketing.bannerTitleEn ?? '',
              bannerTitleBn: marketing.bannerTitleBn ?? '',
              bannerTextEn: marketing.bannerTextEn ?? '',
              bannerTextBn: marketing.bannerTextBn ?? '',
              bannerCtaLabelEn: marketing.bannerCtaLabelEn ?? '',
              bannerCtaLabelBn: marketing.bannerCtaLabelBn ?? '',
              bannerCtaUrl: marketing.bannerCtaUrl ?? '',
              isBannerActive: marketing.isBannerActive,
            }
          : undefined
      }
    />
  );
}
