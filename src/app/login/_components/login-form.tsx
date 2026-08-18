'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TurnstileWidget } from '@/components/public/turnstile/turnstile-widget';

const errorMessages: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password. Please try again.',
  InsufficientPermissions: 'You do not have permission to access the admin area.',
  TurnstileFailed: 'Security verification failed. Please try again.',
  default: 'An unexpected error occurred. Please try again.',
};

interface TurnstileConfig {
  enabled: boolean;
  siteKey: string | null;
}

export function LoginForm({
  callbackUrl,
  initialError,
  turnstile,
}: {
  callbackUrl?: string;
  initialError?: string;
  turnstile?: TurnstileConfig;
}) {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    initialError ? errorMessages[initialError] ?? errorMessages.default : null
  );
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  const turnstileEnabled = turnstile?.enabled && turnstile?.siteKey;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // If Turnstile is enabled, require a token before submitting
    if (turnstileEnabled && !turnstileToken) {
      setError('Security verification is required. Please complete the challenge.');
      setIsSubmitting(false);
      return;
    }

    const result = await signIn('credentials', {
      email,
      password,
      turnstileToken: turnstileToken ?? '',
      redirect: false,
      callbackUrl: callbackUrl ?? '/admin/dashboard',
    });

    if (!result || result.error) {
      if (result?.error === 'TurnstileFailed') {
        setError(errorMessages.TurnstileFailed);
      } else {
        setError(errorMessages.CredentialsSignin);
      }
      // Reset Turnstile token so the user can retry
      setTurnstileToken(null);
      setIsSubmitting(false);
      return;
    }

    if (result.url) {
      const redirectUrl = result.url.startsWith('http')
        ? new URL(result.url).pathname
        : result.url;
      router.push(redirectUrl);
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur shadow-card">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-glow">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-h3">Admin Login</CardTitle>
        <CardDescription>
          Sign in to manage your portfolio content
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile — renders ABOVE the Login button when enabled */}
          {turnstileEnabled && turnstile.siteKey && (
            <div className="py-1">
              <TurnstileWidget
                siteKey={turnstile.siteKey}
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || Boolean(turnstileEnabled && !turnstileToken)}
            className="w-full gap-2"
            size="lg"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
