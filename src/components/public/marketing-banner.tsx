import { getTranslations } from 'next-intl/server';
import { ArrowRight, X } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface BannerData {
  bannerTitleEn: string | null;
  bannerTitleBn: string | null;
  bannerTextEn: string | null;
  bannerTextBn: string | null;
  bannerCtaLabelEn: string | null;
  bannerCtaLabelBn: string | null;
  bannerCtaUrl: string | null;
  isBannerActive: boolean;
  locale: 'en' | 'bn';
}

/**
 * MarketingBanner — conditional banner shown on the home page when
 * MarketingSetting.isBannerActive is true.
 * Renders as a premium gradient strip between Hero and About sections.
 */
export async function MarketingBanner({ data }: { data: BannerData }) {
  if (!data.isBannerActive) return null;

  const title = data.locale === 'bn' ? data.bannerTitleBn : data.bannerTitleEn;
  const text = data.locale === 'bn' ? data.bannerTextBn : data.bannerTextEn;
  const ctaLabel = data.locale === 'bn' ? data.bannerCtaLabelBn : data.bannerCtaLabelEn;
  const ctaUrl = data.bannerCtaUrl || '/contact';

  if (!title && !text) return null;

  return (
    <div className="border-b border-primary/20 bg-gradient-brand py-4 text-white">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 sm:text-left">
          {title && (
            <p className="text-sm font-bold tracking-tight sm:text-base">{title}</p>
          )}
          {text && (
            <p className="text-xs text-white/80 sm:text-sm">{text}</p>
          )}
        </div>
        {ctaLabel && (
          <Link
            href={ctaUrl}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/30"
          >
            {ctaLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
