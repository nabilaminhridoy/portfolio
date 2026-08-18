import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  // Fetch settings for AI crawler restriction
  let aiCrawlerRestricted = false;
  try {
    const settings = await db.settings.findUnique({ where: { id: 'global' } });
    aiCrawlerRestricted = settings?.aiCrawlerRestricted ?? false;
  } catch {
    // DB might not be ready
  }

  // Build rules array
  const rules: MetadataRoute.Robots['rules'] = [
    // Legitimate search engines — always allowed
    { userAgent: 'Googlebot', allow: '/' },
    { userAgent: 'Bingbot', allow: '/' },
    { userAgent: 'DuckDuckBot', allow: '/' },
    { userAgent: 'Slurp', allow: '/' },
    { userAgent: 'Baiduspider', allow: '/' },
    { userAgent: 'YandexBot', allow: '/' },
    { userAgent: 'facebookexternalhit', allow: '/' },
    { userAgent: 'Twitterbot', allow: '/' },
    // Default — protected areas blocked
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/login', '/forgot-password', '/reset-password', '/logout'],
    },
  ];

  // If AI crawler restriction is enabled, add disallow rules for known AI crawlers
  if (aiCrawlerRestricted) {
    const aiCrawlers = [
      'GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Bytespider',
      'Amazonbot', 'PerplexityBot', 'Applebot-Extended', 'FacebookBot',
      'LinkedInBot', 'anthropic-ai', 'cohere-ai', 'ImagesiftBot',
      'Diffbot', 'Omgilibot', 'Omgili', 'ChatGPT-User', 'Meta-ExternalAgent',
    ];
    for (const crawler of aiCrawlers) {
      rules.push({ userAgent: crawler, disallow: '/' });
    }
  }

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
