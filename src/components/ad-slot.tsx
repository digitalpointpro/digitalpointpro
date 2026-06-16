'use client'

import React from 'react'

// ============================================
// ADSTERRA BANNER ADS - SANDBOXED IFRAMES
// ============================================
// Each banner ad loads via /api/ad?position=xxx
// inside an iframe with sandbox="allow-scripts allow-same-origin"
//
// sandbox allows:
//   ✅ allow-scripts → ad scripts can execute
//   ✅ allow-same-origin → ad can create nested iframes & load content
//
// sandbox BLOCKS (by NOT including these):
//   ❌ allow-top-navigation → NO page redirects!
//   ❌ allow-top-navigation-by-user-activation → NO redirects even on click!
//   ❌ allow-popups → NO popup windows!
//   ❌ allow-popups-to-escape-sandbox → NO escaping!
//
// Without allow-top-navigation, the iframe CANNOT redirect parent page
// Without allow-popups, the iframe CANNOT open popup windows
// This is the KEY protection against ad redirects!
//
// Smart Link = simple clickable link (safe, no auto-redirect)
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
// Smart Link Button - Looks like "Continue Reading"
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
