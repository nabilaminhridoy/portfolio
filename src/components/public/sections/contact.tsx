'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone, Globe } from 'lucide-react';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitContactMessage } from '@/lib/actions/contact';
import { trackContactSubmit } from '@/lib/tracking/events';
import { TurnstileWidget } from '@/components/public/turnstile/turnstile-widget';

// --- Social link types ---
interface SocialLinkItem {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  isActive: boolean;
  order: number;
}

// --- Official brand icon config ---
// Uses simpleicons.org CDN for official SVG brand logos with brand colors.
// For "website" (no brand icon exists), uses lucide Globe — the standard
// convention for representing a personal website link.
const SOCIAL_ICON_CONFIG: Record<string, { src: string | null; color: string }> = {
  website:  { src: null,                         color: '#175bea' },
  facebook: { src: 'https://cdn.simpleicons.org/facebook/1877F2',  color: '#1877F2' },
  instagram:{ src: 'https://cdn.simpleicons.org/instagram/E4405F', color: '#E4405F' },
  whatsapp: { src: 'https://cdn.simpleicons.org/whatsapp/25D366',  color: '#25D366' },
  linkedin: { src: 'https://cdn.simpleicons.org/linkedin/0A66C2',  color: '#0A66C2' },
  x:        { src: 'https://cdn.simpleicons.org/x/000000',          color: '#000000' },
  github:   { src: 'https://cdn.simpleicons.org/github/181717',     color: '#181717' },
  discord:  { src: 'https://cdn.simpleicons.org/discord/5865F2',   color: '#5865F2' },
};

// --- Contact info types ---
interface ContactInfo {
  email: string | null;
  phone: string | null;
  locationEn: string | null;
  locationBn: string | null;
  locale: 'en' | 'bn';
  socialLinks: SocialLinkItem[];
  turnstile?: { enabled: boolean; siteKey: string | null };
}

export function Contact({ info }: { info: ContactInfo }) {
  const t = useTranslations('Contact');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  const turnstileEnabled = info.turnstile?.enabled && info.turnstile?.siteKey;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('name', name);
      formData.set('email', email);
      formData.set('subject', subject);
      formData.set('message', message);
      formData.set('userAgent', navigator.userAgent);
      if (turnstileToken) {
        formData.set('turnstileToken', turnstileToken);
      }

      const result = await submitContactMessage(formData);
      if (!result.ok) {
        setError(result.error ?? t('error'));
      } else {
        trackContactSubmit(name, email);
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setError(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const location = info.locale === 'bn' ? info.locationBn : info.locationEn;

  // Filter social links: only show platforms that are active AND have a valid URL
  // (not "#" or empty). Respect Admin-defined display order (already sorted by DB query).
  const validSocialLinks = info.socialLinks.filter(
    (s) => s.isActive && s.url && s.url !== '#' && s.url.trim() !== ''
  );

  return (
    <section id="contact" className="border-t border-border bg-secondary py-16 text-secondary-foreground sm:py-24">
      <Container>
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
            {t('subtitle')}
          </p>
          <h2 className="text-h2 font-bold tracking-tight">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact info — LEFT */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('infoTitle')}</h3>
            <p className="text-sm text-secondary-foreground/70">
              {info.locale === 'bn'
                ? 'আপনার প্রশ্ন, প্রজেক্ট বা সহযোগিতার জন্য আমার সাথে যোগাযোগ  করুন। আমি সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দেই।'
                : 'Reach out for inquiries, projects, or collaborations. I usually respond within 24 hours.'}
            </p>

            {/* Contact items: Email, Phone, Location */}
            <div className="space-y-3">
              {info.email && (
                <a
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-3 rounded-md bg-secondary-foreground/5 p-3 transition-colors hover:bg-secondary-foreground/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20 text-accent">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-secondary-foreground/70">Email</p>
                    <p className="truncate text-sm font-medium">{info.email}</p>
                  </div>
                </a>
              )}

              {info.phone && (
                <div className="flex items-center gap-3 rounded-md bg-secondary-foreground/5 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20 text-accent">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-secondary-foreground/70">Phone</p>
                    <p className="text-sm font-medium">{info.phone}</p>
                  </div>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-3 rounded-md bg-secondary-foreground/5 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/20 text-accent">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-secondary-foreground/70">Location</p>
                    <p className="text-sm font-medium">{location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Follow me — social media brand icons from Admin Social Media settings */}
            {validSocialLinks.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/70">
                  {t('followMe')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {validSocialLinks.map((social) => {
                    const config = SOCIAL_ICON_CONFIG[social.platform];
                    if (!config) return null; // unknown platform — skip

                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label ?? social.platform}
                        title={social.label ?? social.platform}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-secondary-foreground/10 bg-secondary-foreground/5 transition-all hover:border-secondary-foreground/20 hover:bg-secondary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
                        style={{ color: config.color }}
                      >
                        {config.src ? (
                          <img
                            src={config.src}
                            alt={social.label ?? social.platform}
                            className="h-5 w-5"
                            loading="lazy"
                          />
                        ) : (
                          // Fallback for "website" — no brand icon exists, use Globe
                          <Globe className="h-5 w-5" aria-hidden="true" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact form — RIGHT */}
          <div>
            <Card className="border-border bg-background text-foreground shadow-card">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name" className="text-sm font-medium">
                        {t('name')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email" className="text-sm font-medium">
                        {t('email')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject" className="text-sm font-medium">
                      {t('subject')}
                    </Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message" className="text-sm font-medium">
                      {t('message')} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={5}
                      placeholder={info.locale === 'bn' ? 'আপনার বার্তা এখানে লিখুন...' : 'Type your message here...'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length}/5000 characters
                    </p>
                  </div>

                  {success && (
                    <div role="status" className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{t('success')}</span>
                    </div>
                  )}

                  {error && (
                    <div role="alert" className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Cloudflare Turnstile — renders ABOVE the Send button when enabled */}
                  {turnstileEnabled && info.turnstile?.siteKey && (
                    <div className="py-1">
                      <TurnstileWidget
                        siteKey={info.turnstile.siteKey}
                        onVerify={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || Boolean(turnstileEnabled && !turnstileToken)}
                    size="lg"
                    className="w-full gap-2 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSubmitting ? t('sending') : t('send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
