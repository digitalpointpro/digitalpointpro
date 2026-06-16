'use client'

import React from 'react'

// ============================================
// ADSTERRA - ONLY SMART LINK (SAFE)
// ============================================
// highperformanceformat.com BANNER ads REMOVED
// because they include popunder/redirect code that
// automatically redirects the page on mobile.
//
// No JavaScript protection can stop this because
// the scripts use window.top.location which
// bypasses all JS-level overrides.
//
// Smart Link = simple clickable URL (SAFE)
// It only activates when user CLICKS it.
// No auto-redirect, no popunder, no script.
// ============================================

type AdPosition = 'smartLink'

const SMART_LINK_URL = 'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a'

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  if (position === 'smartLink') {
    return <SmartLinkButton className={className} />
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
      href={SMART_LINK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] no-underline ${className}`}
    >
      <span>📖</span> Continue Reading — More Insights
    </a>
  )
}
