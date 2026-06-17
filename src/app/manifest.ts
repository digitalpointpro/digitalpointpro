import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

/**
 * Web App Manifest — enables PWA install + "Add to Home Screen".
 * Improves mobile engagement and returning-traffic metrics.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name + ' — ' + SITE_CONFIG.tagline,
    short_name: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: SITE_CONFIG.backgroundColor,
    theme_color: SITE_CONFIG.themeColor,
    categories: ['news', 'magazines', 'education', 'business'],
    lang: SITE_CONFIG.language,
    dir: 'ltr',
    icons: [
      {
        src: '/icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Latest News',
        short_name: 'News',
        url: '/?news=1&utm_source=pwa_shortcut',
      },
      {
        name: 'AI Articles',
        short_name: 'AI',
        url: '/?category=artificial-intelligence&utm_source=pwa_shortcut',
      },
      {
        name: 'Technology',
        short_name: 'Tech',
        url: '/?category=technology-trends&utm_source=pwa_shortcut',
      },
    ],
  };
}
