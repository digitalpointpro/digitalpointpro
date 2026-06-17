'use client'

import React, { useEffect, useRef } from 'react'
import { ADS_CONFIG, BANNER_SIZES, BannerType } from '@/lib/ads-config'

// ============================================
// ADSTERRA ADS — BANNER + SMART LINK
// ============================================
// Banner ads run inside SANDBOXED IFRAMES:
//   sandbox="allow-scripts allow-same-origin allow-popups"
//
// This ALLOWS:
//   ✅ allow-scripts → ad scripts execute
//   ✅ allow-same-origin → ad renders nested iframes
//   ✅ allow-popups → ad click opens NEW TAB (user sees ad)
//
// KEY PROTECTION (fixes ERR_BLOCKED_BY_RESPONSE):
//   ❌ allow-top-navigation NOT included
//   ❌ allow-top-navigation-by-user-activation NOT included
//   → Main page NEVER redirects on ad click
//   → Before, ad click redirected main page to one-vv0990.com
//     which browser blocked → ERR_BLOCKED_BY_RESPONSE error
//   → Now clicks open new tabs only — main page stays safe
//
// Smart Link = simple clickable URL (safe, opens in new tab)
//
// NOTE: Social Bar is loaded globally in layout.tsx (not here)
// ============================================

type AdPosition = 'leaderboard' | 'medium' | 'box' | 'mobileSticky' | 'smartLink'

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  // Smart Link renders as a clickable button
  if (position === 'smartLink') {
    return <SmartLinkButton className={className} />
  }

  const size = BANNER_SIZES[position as BannerType]
  if (!size) return null

  return (
    <div
      className={`ad-container flex items-center justify-center w-full ${className}`}
      style={{
        width: '100%',
        maxWidth: `${size.width}px`,
        minHeight: `${size.height}px`,
        margin: '0 auto',
      }}
    >
      <iframe
        src={`/api/ad?position=${position}`}
        sandbox="allow-scripts allow-same-origin allow-popups"
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          maxWidth: '100%',
          border: 'none',
          overflow: 'hidden',
          display: 'block',
        }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  )
}

// ============================================
// Bottom Sticky Ad — fixed at bottom of viewport
// Shows mobile sticky (320x50) on small screens,
// leaderboard (728x90) on large screens.
// Dismissible with close button.
// ============================================
export function BottomStickyAd() {
  const [visible, setVisible] = React.useState(true)
  const dismissedRef = useRef(false)

  useEffect(() => {
    if (dismissedRef.current) return
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Close button */}
      <button
        onClick={() => {
          dismissedRef.current = true
          setVisible(false)
        }}
        aria-label="Close ad"
        className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-slate-800/70 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
        style={{ transform: 'translateY(-100%)' }}
      >
        ✕
      </button>

      {/* Mobile: 320x50 sticky | Desktop: 728x90 leaderboard */}
      <div className="block sm:hidden">
        <iframe
          src="/api/ad?position=mobileSticky"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{
            width: '320px',
            height: '50px',
            border: 'none',
            display: 'block',
          }}
          scrolling="no"
          title="Advertisement"
        />
      </div>
      <div className="hidden sm:block">
        <iframe
          src="/api/ad?position=leaderboard"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{
            width: '728px',
            height: '90px',
            border: 'none',
            display: 'block',
          }}
          scrolling="no"
          title="Advertisement"
        />
      </div>
    </div>
  )
}

// ============================================
// Smart Link Button - "Continue Reading"
// SAFE: Only activates on user click, opens new tab
// ============================================
function SmartLinkButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={ADS_CONFIG.smartLinkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] no-underline ${className}`}
    >
      <span>📖</span> Continue Reading — More Insights
    </a>
  )
}
