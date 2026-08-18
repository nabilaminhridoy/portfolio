'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, BarChart3, ServerCog, Power } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/admin/form-layout';
import { updateTrackingSettings } from '@/lib/actions/tracking';

interface TrackingData {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  metaPixelId: string;
  googleAdsId: string;
  metaConversionsApiToken: string;
  googleMeasurementProtocolSecret: string;
  isEnabled: boolean;
}

export function TrackingForm({ initial }: { initial?: TrackingData }) {
  const [googleAnalyticsId, setGoogleAnalyticsId] = React.useState(
    initial?.googleAnalyticsId ?? ''
  );
  const [googleTagManagerId, setGoogleTagManagerId] = React.useState(
    initial?.googleTagManagerId ?? ''
  );
  const [metaPixelId, setMetaPixelId] = React.useState(initial?.metaPixelId ?? '');
  const [googleAdsId, setGoogleAdsId] = React.useState(initial?.googleAdsId ?? '');
  const [metaConversionsApiToken, setMetaConversionsApiToken] = React.useState(
    initial?.metaConversionsApiToken ?? ''
  );
  const [googleMeasurementProtocolSecret, setGoogleMeasurementProtocolSecret] =
    React.useState(initial?.googleMeasurementProtocolSecret ?? '');
  const [isEnabled, setIsEnabled] = React.useState(initial?.isEnabled ?? false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('googleAnalyticsId', googleAnalyticsId);
      formData.set('googleTagManagerId', googleTagManagerId);
      formData.set('metaPixelId', metaPixelId);
      formData.set('googleAdsId', googleAdsId);
      formData.set('metaConversionsApiToken', metaConversionsApiToken);
      formData.set('googleMeasurementProtocolSecret', googleMeasurementProtocolSecret);
      if (isEnabled) formData.set('isEnabled', 'on');

      const result = await updateTrackingSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save tracking settings');
      } else {
        toast.success('Tracking settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Analytics IDs */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Analytics IDs
          </CardTitle>
          <CardDescription>
            Client-side tracking IDs injected into the public site header
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Google Analytics 4 Measurement ID"
              htmlFor="googleAnalyticsId"
              description="GA4 Measurement ID (e.g. G-XXXXXXXXXX). Find in Admin → Data Streams."
            >
              <Input
                id="googleAnalyticsId"
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                autoComplete="off"
                spellCheck={false}
              />
            </FormField>
            <FormField
              label="Google Tag Manager Container ID"
              htmlFor="googleTagManagerId"
              description="GTM container ID (e.g. GTM-XXXXXX). Find in Admin → Container."
            >
              <Input
                id="googleTagManagerId"
                type="text"
                value={googleTagManagerId}
                onChange={(e) => setGoogleTagManagerId(e.target.value)}
                placeholder="GTM-XXXXXX"
                autoComplete="off"
                spellCheck={false}
              />
            </FormField>
            <FormField
              label="Meta (Facebook) Pixel ID"
              htmlFor="metaPixelId"
              description="Pixel ID (e.g. 123456789012345). Find in Events Manager → Data Sources."
            >
              <Input
                id="metaPixelId"
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="123456789012345"
                autoComplete="off"
                spellCheck={false}
              />
            </FormField>
            <FormField
              label="Google Ads ID"
              htmlFor="googleAdsId"
              description="Google Ads customer ID (e.g. AW-XXXXXXXXX) for conversion tracking."
            >
              <Input
                id="googleAdsId"
                type="text"
                value={googleAdsId}
                onChange={(e) => setGoogleAdsId(e.target.value)}
                placeholder="AW-XXXXXXXXX"
                autoComplete="off"
                spellCheck={false}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Server-side */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ServerCog className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            Server-side Tracking
          </CardTitle>
          <CardDescription>
            Tokens/secrets used for server-side conversion API calls (stored securely)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField
            label="Meta Conversions API Token"
            htmlFor="metaConversionsApiToken"
            description="Access token for Meta Marketing API. Find in Events Manager → Settings → Conversions API."
          >
            <Input
              id="metaConversionsApiToken"
              type="text"
              value={metaConversionsApiToken}
              onChange={(e) => setMetaConversionsApiToken(e.target.value)}
              placeholder="EAAB..."
              autoComplete="off"
              spellCheck={false}
            />
          </FormField>
          <FormField
            label="Google Measurement Protocol Secret"
            htmlFor="googleMeasurementProtocolSecret"
            description="API secret from GA4 → Admin → Data Streams → Measurement Protocol API secret."
          >
            <Input
              id="googleMeasurementProtocolSecret"
              type="text"
              value={googleMeasurementProtocolSecret}
              onChange={(e) => setGoogleMeasurementProtocolSecret(e.target.value)}
              placeholder="e.g. abcDEF12345"
              autoComplete="off"
              spellCheck={false}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Master toggle */}
      <Card className="border-amber-500/30 bg-amber-500/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Power className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Master Toggle
          </CardTitle>
          <CardDescription>
            Disable to suppress all tracking scripts site-wide (e.g. during cookie opt-out)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isEnabled" className="text-sm font-medium">
                Enable tracking
              </Label>
              <p className="text-xs text-muted-foreground">
                When off, no tracking IDs (GA4, GTM, Pixel, Ads) will be rendered on the public site.
              </p>
            </div>
            <Switch
              id="isEnabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
              aria-label="Toggle tracking"
            />
          </div>
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
          {isSubmitting ? 'Saving...' : 'Save Tracking'}
        </Button>
      </div>
    </form>
  );
}
