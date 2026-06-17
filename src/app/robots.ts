import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * robots.txt — allows all crawlers, points to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Don't index API endpoints or admin
        disallow: ['/api/', '/admin'],
      },
      // Explicitly allow Googlebot-News for Google News indexing
      {
        userAgent: 'Googlebot-News',
        allow: '/',
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
