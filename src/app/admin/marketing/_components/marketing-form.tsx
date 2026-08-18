'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, Megaphone, Power } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/admin/form-layout';
import {
  BilingualInput,
  BilingualTextarea,
} from '@/components/admin/crud/bilingual-field';
import { updateMarketingSettings } from '@/lib/actions/marketing';

interface MarketingData {
  bannerTitleEn: string;
  bannerTitleBn: string;
  bannerTextEn: string;
  bannerTextBn: string;
  bannerCtaLabelEn: string;
  bannerCtaLabelBn: string;
  bannerCtaUrl: string;
  isBannerActive: boolean;
}

export function MarketingForm({ initial }: { initial?: MarketingData }) {
  const [bannerTitleEn, setBannerTitleEn] = React.useState(initial?.bannerTitleEn ?? '');
  const [bannerTitleBn, setBannerTitleBn] = React.useState(initial?.bannerTitleBn ?? '');
  const [bannerTextEn, setBannerTextEn] = React.useState(initial?.bannerTextEn ?? '');
  const [bannerTextBn, setBannerTextBn] = React.useState(initial?.bannerTextBn ?? '');
  const [bannerCtaLabelEn, setBannerCtaLabelEn] = React.useState(
    initial?.bannerCtaLabelEn ?? ''
  );
  const [bannerCtaLabelBn, setBannerCtaLabelBn] = React.useState(
    initial?.bannerCtaLabelBn ?? ''
  );
  const [bannerCtaUrl, setBannerCtaUrl] = React.useState(initial?.bannerCtaUrl ?? '');
  const [isBannerActive, setIsBannerActive] = React.useState(
    initial?.isBannerActive ?? false
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('bannerTitleEn', bannerTitleEn);
      formData.set('bannerTitleBn', bannerTitleBn);
      formData.set('bannerTextEn', bannerTextEn);
      formData.set('bannerTextBn', bannerTextBn);
      formData.set('bannerCtaLabelEn', bannerCtaLabelEn);
      formData.set('bannerCtaLabelBn', bannerCtaLabelBn);
      formData.set('bannerCtaUrl', bannerCtaUrl);
      if (isBannerActive) formData.set('isBannerActive', 'on');

      const result = await updateMarketingSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save marketing settings');
      } else {
        toast.success('Marketing settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Banner visibility toggle */}
      <Card className="border-amber-500/30 bg-amber-500/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Power className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Banner Visibility
          </CardTitle>
          <CardDescription>
            Toggle the promo banner on/off without losing its content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isBannerActive" className="text-sm font-medium">
                Show promo banner
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, the banner appears at the top of the public site.
              </p>
            </div>
            <Switch
              id="isBannerActive"
              checked={isBannerActive}
              onCheckedChange={setIsBannerActive}
              aria-label="Toggle banner"
            />
          </div>
        </CardContent>
      </Card>

      {/* Banner content */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Banner Content
          </CardTitle>
          <CardDescription>
            Title, body, and CTA for the promo banner (EN + BN)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Banner Title"
            enId="bannerTitleEn" bnId="bannerTitleBn"
            enValue={bannerTitleEn} bnValue={bannerTitleBn}
            onEnChange={setBannerTitleEn} onBnChange={setBannerTitleBn}
            placeholderEn="New project just launched!"
            placeholderBn="নতুন প্রজেক্ট লঞ্চ হয়েছে!"
          />
          <BilingualTextarea
            label="Banner Text"
            enId="bannerTextEn" bnId="bannerTextBn"
            enValue={bannerTextEn} bnValue={bannerTextBn}
            onEnChange={setBannerTextEn} onBnChange={setBannerTextBn}
            rows={3}
            placeholderEn="Check out my latest open-source release on GitHub."
            placeholderBn="আমার সর্বশেষ ওপেন-সোর্স রিলিজটি GitHub-এ দেখুন।"
          />
          <BilingualInput
            label="CTA Label"
            enId="bannerCtaLabelEn" bnId="bannerCtaLabelBn"
            enValue={bannerCtaLabelEn} bnValue={bannerCtaLabelBn}
            onEnChange={setBannerCtaLabelEn} onBnChange={setBannerCtaLabelBn}
            placeholderEn="View on GitHub"
            placeholderBn="GitHub-এ দেখুন"
          />
          <FormField
            label="CTA URL"
            htmlFor="bannerCtaUrl"
            description="Destination for the banner button (absolute or relative)."
          >
            <Input
              id="bannerCtaUrl"
              type="url"
              value={bannerCtaUrl}
              onChange={(e) => setBannerCtaUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </FormField>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Saving...' : 'Save Marketing'}
        </Button>
      </div>
    </form>
  );
}
