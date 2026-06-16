'use client'

import React from 'react'

// ============================================
// ADSTERRA ADS - BANNER + SMART LINK
// ============================================
// Banner ads run inside SANDBOXED IFRAMES:
//   sandbox="allow-scripts allow-same-origin"
//
// This ALLOWS:
//   ✅ allow-scripts → ad scripts execute
//   ✅ allow-same-origin → ad can create nested iframes & render content
//
// This BLOCKS (by NOT including):
//   ❌ allow-top-navigation → CANNOT redirect parent page!
//   ❌ allow-popups → CANNOT open popup windows!
//
// Smart Link = simple clickable URL (safe, no auto-redirect)
// ============================================

type AdPosition =
  | 'headerBanner'
  | 'betweenArticles'
  | 'sidebar'
  | 'sidebarTall'
  | 'midSection'
  | 'footerBanner'
  | 'mobileSticky'
  | 'smartLink'

const BANNER_SIZES: Record<string, { width: number; height: number }> = {
  headerBanner: { width: 728, height: 90 },
  betweenArticles: { width: 468, height: 60 },
  sidebar: { width: 300, height: 250 },
  sidebarTall: { width: 160, height: 600 },
  midSection: { width: 160, height: 300 },
  footerBanner: { width: 728, height: 90 },
  mobileSticky: { width: 320, height: 50 },
}

const SMART_LINK_URL = 'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a'

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  // Smart Link renders as a clickable button
  if (position === 'smartLink') {
    return <SmartLinkButton className={className} />
  }

  const size = BANNER_SIZES[position]
  if (!size) return null

  return (
    <div
      className={`ad-container flex items-center justify-center ${className}`}
      style={{
        width: '100%',
        maxWidth: `${size.width}px`,
        minHeight: `${size.height}px`,
      }}
    >
      <iframe
        src={`/api/ad?position=${position}`}
        sandbox="allow-scripts allow-same-origin"
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
// Smart Link Button - "Continue Reading"
// SAFE: Only activates on user click
// ============================================
function SmartLinkButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={SMART_LINK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] no-underline ${className}`}
    >
      <span>📖</span> Continue Reading — More Insights
    </a>
  )
}
