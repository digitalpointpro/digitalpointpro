'use client'

import React from 'react'
import { ADS_CONFIG } from '@/lib/ads-config'

// ============================================
// ADSTERRA ADS — BANNER + SMART LINK
// ============================================
// Banner ads run inside SANDBOXED IFRAMES:
//   sandbox="allow-scripts allow-same-origin
//            allow-top-navigation-by-user-activation
//            allow-popups"
//
// This ALLOWS:
//   ✅ allow-scripts → ad scripts execute
//   ✅ allow-same-origin → ad renders nested iframes
//   ✅ allow-top-navigation-by-user-activation → ad click NAVIGATES (user clicked!)
//   ✅ allow-popups → ad click opens new window/tab
//
// KEY PROTECTION:
//   ❌ allow-top-navigation is NOT included!
//   → Auto-redirect (without user click) is BLOCKED!
//   → Only USER CLICKS can navigate the page
//
// Smart Link = simple clickable URL (safe, no auto-redirect)
//
// NOTE: Popunder + Social Bar are loaded globally in layout.tsx
// (NOT via this component) because they need full-page access.
// ============================================

type AdPosition = 'headerBanner' | 'smartLink'

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  // Smart Link renders as a clickable button
  if (position === 'smartLink') {
    return <SmartLinkButton className={className} />
  }

  // Banner ad — single 728x90 leaderboard via sandboxed iframe
  if (position === 'headerBanner') {
    const size = ADS_CONFIG.bannerSize
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
          src={`/api/ad?position=headerBanner`}
          sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
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

  return null
}

// ============================================
// Smart Link Button - "Continue Reading"
// SAFE: Only activates on user click
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
