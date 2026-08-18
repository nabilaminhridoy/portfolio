'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, Search } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/admin/form-layout';
import { updateGoogleVerification } from '@/lib/actions/seo';

interface GoogleData {
  googleVerification: string;
}

export function GoogleForm({ initial }: { initial: GoogleData }) {
  const [googleVerification, setGoogleVerification] = React.useState(
    initial.googleVerification ?? ''
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('googleVerification', googleVerification);

      const result = await updateGoogleVerification(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save Google verification');
      } else {
        toast.success('Google verification saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Google Search Console Verification
          </CardTitle>
          <CardDescription>
            Paste the content value from the Google Search Console verification meta tag.
            Example: <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;meta name=&quot;google-site-verification&quot; content=&quot;PASTE_THIS_VALUE&quot; /&gt;</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            label="google-site-verification content"
            htmlFor="googleVerification"
            description="The full content attribute value. Leave blank to remove the verification meta tag."
          >
            <Input
              id="googleVerification"
              type="text"
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
              placeholder="e.g. google1234567890abcdef"
              autoComplete="off"
              spellCheck={false}
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
          {isSubmitting ? 'Saving...' : 'Save Verification'}
        </Button>
      </div>
    </form>
  );
}
