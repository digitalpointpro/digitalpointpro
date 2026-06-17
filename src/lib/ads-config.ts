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
 *                   (Adsterra Social Bar widget bundles popunder
 *                    functionality — configured in dashboard)
 *  2. Banner 728x90 → single leaderboard on homepage
 *  3. Smart Link    → clickable "Continue Reading" button
 *
 * NOTE: Adsterra Social Bar widget, when configured in the
 * dashboard with "Popunder" enabled, automatically fires
 * popunders on user click. So one Social Bar script handles
 * BOTH social bar icons AND popunder behavior. No separate
 * popunder script is needed.
 *
 * ADS ONLY RENDER ON PRODUCTION:
 * Adsterra validates the referrer domain. On localhost the
 * scripts load but render nothing (this is normal).
 * Production = https://digitalpointpro.vercel.app ✓
 * ============================================
 */
export const ADS_CONFIG = {
  // --- Social Bar (floating widget + popunder behavior) ---
  // This is the REAL script URL from user's Adsterra dashboard.
  // Loaded globally in layout.tsx (NOT sandboxed) so it can:
  //   - Render floating social icons (WhatsApp, Telegram, etc)
  //   - Fire popunder on user click (configured in Adsterra dashboard)
  socialBarScriptUrl:
    'https://pl29749331.effectivecpmnetwork.com/18/49/31/1849316fdff11436e8c595fee5622180.js',

  // --- Banner Ad (728x90 leaderboard) ---
  // REAL key from user's Adsterra dashboard.
  // Rendered via sandboxed iframe in /api/ad/route.ts (safe —
  // allows clicks but blocks auto-redirect).
  bannerKey: 'bee03c8feeebc403d01e864f5008c118',
  bannerSize: { width: 728, height: 90 },

  // --- Smart Link (clickable URL) ---
  // REAL URL from user's Adsterra dashboard.
  // Rendered as "Continue Reading" button (safe — only activates on click).
  smartLinkUrl:
    'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a',
} as const;

export type AdsConfig = typeof ADS_CONFIG;
