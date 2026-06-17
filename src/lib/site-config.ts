/**
 * Central site configuration.
 * Used across sitemap, metadata, structured data, sharing, and analytics.
 */
export const SITE_CONFIG = {
  name: 'Digital Point Pro',
  shortName: 'DigitalPointPro',
  tagline: 'Breaking News, Tech, Business & Lifestyle',
  description:
    'Your premier source for breaking news, AI insights, tech trends, health tips, business strategies, and career guidance. Stay informed with Digital Point Pro.',
  // Live production URL (Vercel). Update this if you move to a custom domain.
  url: 'https://digitalpointpro.vercel.app',
  locale: 'en_US',
  language: 'en',
  timezone: 'Asia/Karachi',
  logo: '/logo.svg',
  defaultOgImage: '/og-default.jpg',
  themeColor: '#10b981',
  backgroundColor: '#ffffff',
  // Social handles (fill in real handles later)
  social: {
    twitter: '@digitalpointpro',
    facebook: 'https://facebook.com/digitalpointpro',
    telegram: 'https://t.me/digitalpointpro',
    youtube: 'https://youtube.com/@digitalpointpro',
  },
  // Analytics — replace with real IDs after setup
  ga4Id: 'G-9PRHFNLQ1S', // e.g. 'G-XXXXXXXXXX'
  // OneSignal push notifications — replace with real app ID after setup
  oneSignalAppId: 'a6d9b648-eb13-43e7-90fb-c744bf8cea57',
  // Google Search Console verification token
  // Step 1: search.google.com/search-console → Add property → URL prefix
  //         → https://digitalpointpro.vercel.app
  // Step 2: Choose "HTML tag" method → copy the content="..." value (NOT the whole tag)
  // Step 3: Paste that value between the quotes below
  // Step 4: Save → commit → push to GitHub → Vercel auto-deploys
  // Step 5: Back in GSC, click "Verify" — Google fetches the meta tag from your live site
  gscVerification: '',
} as const;

export type SiteConfig = typeof SITE_CONFIG;

/**
 * Build a shareable article URL.
 * Articles live on the single `/` route using a query param so direct visits
 * never 404 (critical for SEO + social sharing).
 */
export function articleUrl(slug: string): string {
  return `${SITE_CONFIG.url}/?article=${encodeURIComponent(slug)}`;
}

/** Build a category URL. */
export function categoryUrl(slug: string): string {
  return `${SITE_CONFIG.url}/?category=${encodeURIComponent(slug)}`;
}
