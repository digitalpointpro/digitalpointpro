/**
 * ============================================
 * ADSTERRA AD CONFIGURATION
 * ============================================
 * Central place for all Adsterra ad zone keys.
 *
 * HOW TO GET KEYS:
 * 1. Login to Adsterra dashboard → https://adsterra.com
 * 2. Go to "Websites" → Click your site → "Get Ad Code"
 * 3. Create ad zones of each type:
 *    - Popunder       → copy the zone KEY (32-char hex)
 *    - Social Bar     → copy the zone KEY (32-char hex)
 *    - Banner 728x90  → copy the zone KEY (32-char hex)
 *    - Smart Link     → copy the Smart Link URL
 * 4. Paste values below between the quotes
 *
 * AD DOMAIN NOTE:
 * Adsterra uses several CDN domains. The most common ones:
 *  - www.highperformanceformat.com  → banners & popunders
 *  - www.profitabledisplaynetwork.com → social bar & native
 *  - www.effectivecpmnetwork.com    → smart links
 * The domain auto-matches the key, so just use the right KEY.
 *
 * ADS ONLY RENDER ON PRODUCTION:
 * Adsterra validates the referrer domain. On localhost the
 * scripts load but render nothing (this is normal).
 * Production = https://digitalpointpro.vercel.app ✓
 * ============================================
 */
export const ADS_CONFIG = {
  // --- Popunder Ad (fires on user click - opens tab behind) ---
  // Create in Adsterra: Popunder zone → copy KEY
  popunderKey: 'a4e5c8a3f2b1d9e7c6a5b4c3d2e1f0a9',

  // --- Social Bar (floating social icon widget) ---
  // Create in Adsterra: Social Bar zone → copy KEY
  socialBarKey: 'f1e2d3c4b5a697886958473625160718',

  // --- Banner Ad (728x90 leaderboard) ---
  // Create in Adsterra: Banner 728x90 zone → copy KEY
  bannerKey: 'bee03c8feeebc403d01e864f5008c118',

  // --- Smart Link (clickable URL) ---
  // Create in Adsterra: Smart Link → copy full URL
  smartLinkUrl:
    'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a',

  // Banner ad size (728x90 leaderboard - most visible)
  bannerSize: { width: 728, height: 90 },
} as const;

export type AdsConfig = typeof ADS_CONFIG;

/**
 * Adsterra banner/popunder script URL builder.
 * Same format works for both — the difference is the zone type
 * configured in the Adsterra dashboard, not the script itself.
 */
export function adsterraScriptUrl(key: string): string {
  return `https://www.highperformanceformat.com/${key}/invoke.js`;
}

/**
 * Adsterra Social Bar script URL builder.
 * Social Bar uses a different CDN domain than banners/popunders.
 */
export function adsterraSocialBarScriptUrl(key: string): string {
  return `https://www.profitabledisplaynetwork.com/${key}/invoke.js`;
}
