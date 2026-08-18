'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Save, Globe, Tag, Share2, Twitter, Link2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/admin/form-layout';
import { BilingualInput, BilingualTextarea } from '@/components/admin/crud/bilingual-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateSeoSettings } from '@/lib/actions/seo';

interface SeoData {
  siteName: string;
  metaTitleEn: string;
  metaTitleBn: string;
  metaDescriptionEn: string;
  metaDescriptionBn: string;
  ogTitleEn: string;
  ogTitleBn: string;
  ogDescriptionEn: string;
  ogDescriptionBn: string;
  ogImageUrl: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  canonicalUrl: string;
  robotsTxt: string;
}

const DEFAULT_ROBOTS = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml`;

export function SeoForm({ initial }: { initial?: SeoData }) {
  const [siteName, setSiteName] = React.useState(initial?.siteName ?? '');
  const [metaTitleEn, setMetaTitleEn] = React.useState(initial?.metaTitleEn ?? '');
  const [metaTitleBn, setMetaTitleBn] = React.useState(initial?.metaTitleBn ?? '');
  const [metaDescriptionEn, setMetaDescriptionEn] = React.useState(
    initial?.metaDescriptionEn ?? ''
  );
  const [metaDescriptionBn, setMetaDescriptionBn] = React.useState(
    initial?.metaDescriptionBn ?? ''
  );
  const [ogTitleEn, setOgTitleEn] = React.useState(initial?.ogTitleEn ?? '');
  const [ogTitleBn, setOgTitleBn] = React.useState(initial?.ogTitleBn ?? '');
  const [ogDescriptionEn, setOgDescriptionEn] = React.useState(
    initial?.ogDescriptionEn ?? ''
  );
  const [ogDescriptionBn, setOgDescriptionBn] = React.useState(
    initial?.ogDescriptionBn ?? ''
  );
  const [ogImageUrl, setOgImageUrl] = React.useState(initial?.ogImageUrl ?? '');
  const [twitterCard, setTwitterCard] = React.useState(
    initial?.twitterCard ?? 'summary_large_image'
  );
  const [twitterSite, setTwitterSite] = React.useState(initial?.twitterSite ?? '');
  const [twitterCreator, setTwitterCreator] = React.useState(
    initial?.twitterCreator ?? ''
  );
  const [canonicalUrl, setCanonicalUrl] = React.useState(initial?.canonicalUrl ?? '');
  const [robotsTxt, setRobotsTxt] = React.useState(initial?.robotsTxt ?? DEFAULT_ROBOTS);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('siteName', siteName);
      formData.set('metaTitleEn', metaTitleEn);
      formData.set('metaTitleBn', metaTitleBn);
      formData.set('metaDescriptionEn', metaDescriptionEn);
      formData.set('metaDescriptionBn', metaDescriptionBn);
      formData.set('ogTitleEn', ogTitleEn);
      formData.set('ogTitleBn', ogTitleBn);
      formData.set('ogDescriptionEn', ogDescriptionEn);
      formData.set('ogDescriptionBn', ogDescriptionBn);
      formData.set('ogImageUrl', ogImageUrl);
      formData.set('twitterCard', twitterCard);
      formData.set('twitterSite', twitterSite);
      formData.set('twitterCreator', twitterCreator);
      formData.set('canonicalUrl', canonicalUrl);
      formData.set('robotsTxt', robotsTxt);

      const result = await updateSeoSettings(formData);
      if (!result.ok) {
        setError(result.error ?? 'Failed to save.');
        toast.error(result.error ?? 'Failed to save SEO settings');
      } else {
        toast.success('SEO settings saved successfully');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Site Identity */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Site Identity
          </CardTitle>
          <CardDescription>Global site name used in meta tags and sitemap</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            label="Site Name"
            htmlFor="siteName"
            description="Used as a suffix in meta titles and in structured data (e.g. — Nabil Amin Hridoy)."
          >
            <Input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Nabil Amin Hridoy"
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Meta Tags */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            Meta Tags
          </CardTitle>
          <CardDescription>Page-level title and description for search engines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="Meta Title"
            enId="metaTitleEn" bnId="metaTitleBn"
            enValue={metaTitleEn} bnValue={metaTitleBn}
            onEnChange={setMetaTitleEn} onBnChange={setMetaTitleBn}
            placeholderEn="Nabil Amin Hridoy — Full Stack Developer"
            placeholderBn="নাবিল আমিন হৃদয় — ফুল স্ট্যাক ডেভেলপার"
          />
          <BilingualTextarea
            label="Meta Description"
            enId="metaDescriptionEn" bnId="metaDescriptionBn"
            enValue={metaDescriptionEn} bnValue={metaDescriptionBn}
            onEnChange={setMetaDescriptionEn} onBnChange={setMetaDescriptionBn}
            rows={3}
            placeholderEn="Experienced full stack developer building modern web apps..."
            placeholderBn="অভিজ্ঞ ফুল স্ট্যাক ডেভেলপার যিনি আধুনিক ওয়েব অ্যাপ তৈরি করেন..."
          />
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            Open Graph
          </CardTitle>
          <CardDescription>Preview cards shown when sharing on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <BilingualInput
            label="OG Title"
            enId="ogTitleEn" bnId="ogTitleBn"
            enValue={ogTitleEn} bnValue={ogTitleBn}
            onEnChange={setOgTitleEn} onBnChange={setOgTitleBn}
            placeholderEn="Nabil Amin Hridoy — Full Stack Developer"
            placeholderBn="নাবিল আমিন হৃদয় — ফুল স্ট্যাক ডেভেলপার"
          />
          <BilingualTextarea
            label="OG Description"
            enId="ogDescriptionEn" bnId="ogDescriptionBn"
            enValue={ogDescriptionEn} bnValue={ogDescriptionBn}
            onEnChange={setOgDescriptionEn} onBnChange={setOgDescriptionBn}
            rows={3}
            placeholderEn="Experienced full stack developer building modern web apps..."
            placeholderBn="অভিজ্ঞ ফুল স্ট্যাক ডেভেলপার যিনি আধুনিক ওয়েব অ্যাপ তৈরি করেন..."
          />
          <FormField
            label="OG Image URL"
            htmlFor="ogImageUrl"
            description="Recommended size 1200×630. Used as the preview image when sharing the site."
          >
            <Input
              id="ogImageUrl"
              type="url"
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Twitter Card */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Twitter className="h-4 w-4 text-brand-blue" aria-hidden="true" />
            Twitter Card
          </CardTitle>
          <CardDescription>Twitter-specific card metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Card Type" htmlFor="twitterCard" description="summary = small, summary_large_image = large preview">
              <Select value={twitterCard} onValueChange={setTwitterCard}>
                <SelectTrigger id="twitterCard" className="w-full">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">summary</SelectItem>
                  <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Site (@handle)" htmlFor="twitterSite" description="The site's main Twitter handle">
              <Input
                id="twitterSite"
                type="text"
                value={twitterSite}
                onChange={(e) => setTwitterSite(e.target.value)}
                placeholder="@nabilhridoy"
              />
            </FormField>
            <FormField label="Creator (@handle)" htmlFor="twitterCreator" description="Author's Twitter handle">
              <Input
                id="twitterCreator"
                type="text"
                value={twitterCreator}
                onChange={(e) => setTwitterCreator(e.target.value)}
                placeholder="@nabilhridoy"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Canonical & Robots */}
      <Card className="border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            Canonical & robots.txt
          </CardTitle>
          <CardDescription>Canonical URL and crawl directives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField
            label="Canonical URL"
            htmlFor="canonicalUrl"
            description="The preferred absolute URL of the homepage (e.g. https://nabilhridoy.com)."
          >
            <Input
              id="canonicalUrl"
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </FormField>
          <FormField
            label="robots.txt"
            htmlFor="robotsTxt"
            description="Directives served at /robots.txt. Leave default to allow crawling of public pages and block /admin and /api."
          >
            <Textarea
              id="robotsTxt"
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              rows={8}
              className="font-mono text-xs resize-y"
              placeholder={DEFAULT_ROBOTS}
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
          {isSubmitting ? 'Saving...' : 'Save SEO'}
        </Button>
      </div>
    </form>
  );
}
