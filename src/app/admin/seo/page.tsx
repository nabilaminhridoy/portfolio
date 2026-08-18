import { db } from '@/lib/db';
import { SeoForm } from './_components/seo-form';

export const metadata = {
  title: 'SEO',
};

export const dynamic = 'force-dynamic';

export default async function SeoPage() {
  const seo = await db.seoSetting.findUnique({ where: { id: 'global' } });

  return (
    <SeoForm
      initial={
        seo
          ? {
              siteName: seo.siteName ?? '',
              metaTitleEn: seo.metaTitleEn ?? '',
              metaTitleBn: seo.metaTitleBn ?? '',
              metaDescriptionEn: seo.metaDescriptionEn ?? '',
              metaDescriptionBn: seo.metaDescriptionBn ?? '',
              ogTitleEn: seo.ogTitleEn ?? '',
              ogTitleBn: seo.ogTitleBn ?? '',
              ogDescriptionEn: seo.ogDescriptionEn ?? '',
              ogDescriptionBn: seo.ogDescriptionBn ?? '',
              ogImageUrl: seo.ogImageUrl ?? '',
              twitterCard: seo.twitterCard ?? 'summary_large_image',
              twitterSite: seo.twitterSite ?? '',
              twitterCreator: seo.twitterCreator ?? '',
              canonicalUrl: seo.canonicalUrl ?? '',
              robotsTxt: seo.robotsTxt ?? '',
            }
          : undefined
      }
    />
  );
}
