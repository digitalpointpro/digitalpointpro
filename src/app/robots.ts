import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * robots.txt — allows all crawlers, points to the sitemap.
 * Explicitly allows favicon + logo access for Googlebot-Image (favicon crawler).
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
      // Explicitly allow Google's favicon crawler to access icons + logo
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/favicon.ico', '/icon.png', '/logo.png', '/favicon-*.png', '/apple-touch-icon.png'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
