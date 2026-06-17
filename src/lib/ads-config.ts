/**
 * ============================================
 * ADSTERRA AD CONFIGURATION
 * ============================================
 * Central place for all Adsterra ad zone codes.
 *
 * ALL KEYS BELOW ARE REAL — recovered from git history
 * (commit 6766a2e "Add ALL Adsterra ads") where user originally
 * pasted them from the Adsterra dashboard.
 *
 * AD TYPES ACTIVE:
 *  1. Social Bar  → floating widget + includes popunder behavior
 *  2. Banner 728x90 → top (above hero) + center (below section cards)
 *  3. Mobile Sticky 320x50 → bottom fixed bar (mobile only)
 *  4. Smart Link    → clickable "Continue Reading" button
 *
 * SANDBOX POLICY (banner ads):
 *   sandbox="allow-scripts allow-same-origin allow-popups"
 *   ✅ allow-scripts → ad renders
 *   ✅ allow-same-origin → nested iframes work
 *   ✅ allow-popups → ad click opens NEW TAB (user can see ad)
 *   ❌ allow-top-navigation REMOVED → main page NEVER redirects
 *   This fixes ERR_BLOCKED_BY_RESPONSE error (was happening because
 *   ad click was redirecting main page to one-vv0990.com which
 *   browser blocks). Now clicks open new tabs — main page stays safe.
 *
 * ADS ONLY RENDER ON PRODUCTION:
 * Adsterra validates referrer domain. On localhost scripts load
 * but render nothing (normal). Production = digitalpointpro.vercel.app ✓
 * ============================================
 */
export const ADS_CONFIG = {
  // --- Social Bar (floating widget + popunder behavior) ---
  socialBarScriptUrl:
    'https://pl29749331.effectivecpmnetwork.com/18/49/31/1849316fdff11436e8c595fee5622180.js',

  // --- Banner Ad keys (all REAL from Adsterra dashboard) ---
  banners: {
    // 728x90 leaderboard — used for top + center + bottom-desktop
    leaderboard: 'bee03c8feeebc403d01e864f5008c118',
    // 468x60 — between articles
    medium: 'de9c4f6555d0c2b70c90f6cf8b3c5c04',
    // 300x250 — sidebar
    box: 'b1f8bed5795a25e0bf744125256b244c',
    // 320x50 — mobile sticky bottom
    mobileSticky: '182344e1b81fbbec81aaafe6d201cda9',
  },

  // --- Smart Link (clickable URL) ---
  smartLinkUrl:
    'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a',
} as const;

export type AdsConfig = typeof ADS_CONFIG;

// Banner size map (width x height in px)
export const BANNER_SIZES = {
  leaderboard: { width: 728, height: 90 },
  medium: { width: 468, height: 60 },
  box: { width: 300, height: 250 },
  mobileSticky: { width: 320, height: 50 },
} as const;

export type BannerType = keyof typeof ADS_CONFIG.banners;
