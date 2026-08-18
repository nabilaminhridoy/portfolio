'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { ShieldCheck, Eye, EyeOff, Save, Loader2, Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/admin/form-layout';
import { updateTurnstileSettings } from '@/lib/actions/turnstile';

export function TurnstileConfigCard({
  enabled,
  siteKey,
  hasSecretKey,
}: {
  enabled: boolean;
  siteKey: string;
  hasSecretKey: boolean;
}) {
  const [turnstileEnabled, setTurnstileEnabled] = React.useState(enabled);
  const [turnstileSiteKey, setTurnstileSiteKey] = React.useState(siteKey);
  const [turnstileSecretKey, setTurnstileSecretKey] = React.useState('');
  const [showSecret, setShowSecret] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (turnstileEnabled) formData.set('turnstileEnabled', 'on');
      formData.set('turnstileSiteKey', turnstileSiteKey);
      formData.set('turnstileSecretKey', turnstileSecretKey);

      const result = await updateTurnstileSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save Turnstile settings');
        toast.error(result.error ?? 'Failed to save Turnstile settings');
      } else {
        toast.success('Turnstile settings saved successfully');
        // Clear the secret key field after saving (security: don't keep it in DOM)
        setTurnstileSecretKey('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-4 w-4 text-brand-blue" aria-hidden="true" />
              Cloudflare Turnstile
            </CardTitle>
            <CardDescription>Bot protection for Login and Contact forms</CardDescription>
          </div>
          {/* Status indicator */}
          <Badge className={turnstileEnabled ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
            {turnstileEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="turnstileEnabled" className="text-sm font-medium">
                Enable Turnstile
              </Label>
              <p className="text-xs text-muted-foreground">
                When enabled, Turnstile appears on the Login and Contact forms
              </p>
            </div>
            <Switch
              id="turnstileEnabled"
              checked={turnstileEnabled}
              onCheckedChange={setTurnstileEnabled}
            />
          </div>

          {/* Site Key */}
          <FormField
            label="Site Key"
            htmlFor="turnstileSiteKey"
            description="Public key from Cloudflare Dashboard → Turnstile → Site Settings"
          >
            <Input
              id="turnstileSiteKey"
              type="text"
              value={turnstileSiteKey}
              onChange={(e) => setTurnstileSiteKey(e.target.value)}
              placeholder="0x4AAAAAAA..."
            />
          </FormField>

          {/* Secret Key — masked, never shown after save */}
          <FormField
            label="Secret Key"
            htmlFor="turnstileSecretKey"
            description={
              hasSecretKey
                ? 'Secret key is configured. Enter a new value to replace it (leave blank to keep existing).'
                : 'Secret key from Cloudflare Dashboard → Turnstile → Site Settings'
            }
          >
            <div className="relative">
              <Input
                id="turnstileSecretKey"
                type={showSecret ? 'text' : 'password'}
                value={turnstileSecretKey}
                onChange={(e) => setTurnstileSecretKey(e.target.value)}
                placeholder={hasSecretKey ? '•••••••••••••••• (configured)' : '0x4AAAAAAA...'}
                className="pr-9"
              />
              <button
                type="button"
                onClick={() => setShowSecret((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showSecret ? 'Hide secret key' : 'Show secret key'}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          {/* Configuration status */}
          <div className="flex items-center gap-4 rounded-md bg-muted/20 p-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className={`flex h-2 w-2 rounded-full ${turnstileSiteKey ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
              Site Key: {turnstileSiteKey ? 'configured' : 'not set'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`flex h-2 w-2 rounded-full ${hasSecretKey ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
              Secret Key: {hasSecretKey ? 'configured' : 'not set'}
            </span>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSubmitting ? 'Saving...' : 'Save Turnstile Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
