'use client'

import React, { useEffect, useRef } from 'react'

// ============================================
// ADSTERRA ADS - BANNER + SMART LINK
// ============================================
// Using direct script injection (Adsterra's official method)
// Redirect protection added via window.open override
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

interface BannerConfig {
  key: string
  width: number
  height: number
}

const BANNER_ADS: Record<string, BannerConfig> = {
  headerBanner: { key: 'bee03c8feeebc403d01e864f5008c118', width: 728, height: 90 },
  betweenArticles: { key: 'de9c4f6555d0c2b70c90f6cf8b3c5c04', width: 468, height: 60 },
  sidebar: { key: 'b1f8bed5795a25e0bf744125256b244c', width: 300, height: 250 },
  sidebarTall: { key: 'd94b42a76e538f26af5695da265ba72e', width: 160, height: 600 },
  midSection: { key: 'f3c66e2f00457c1271edf2b126802ce7', width: 160, height: 300 },
  footerBanner: { key: 'bee03c8feeebc403d01e864f5008c118', width: 728, height: 90 },
  mobileSticky: { key: '182344e1b81fbbec81aaafe6d201cda9', width: 320, height: 50 },
}

const SMART_LINK_URL = 'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a'

// Install redirect protection ONCE globally
if (typeof window !== 'undefined') {
  // Block popup windows from ad scripts
  const originalOpen = window.open
  window.open = function(...args) {
    // Allow if user explicitly clicked something (not from ad script)
    const url = args[0] || ''
    if (url && !url.includes('highperformanceformat') && !url.includes('effectivecpmnetwork')) {
      return originalOpen.apply(window, args)
    }
    return null
  }
}

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  // Smart Link renders as a clickable button
  if (position === 'smartLink') {
    return <SmartLinkButton className={className} />
  }

  const config = BANNER_ADS[position]
  if (!config) return null

  return <BannerAd position={position} config={config} className={className} />
}

// ============================================
// Banner Ad Component - Direct Script Injection
// ============================================
function BannerAd({ position, config, className }: {
  position: string
  config: BannerConfig
  className: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const container = containerRef.current
    if (!container) return

    // Clear any existing content
    container.innerHTML = ''

    // Create the atOptions script
    const optionsScript = document.createElement('script')
    optionsScript.type = 'text/javascript'
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${config.key}',
        'format' : 'iframe',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : {}
      };
    `

    // Create the invoke script
    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`
    invokeScript.async = true

    container.appendChild(optionsScript)
    container.appendChild(invokeScript)
  }, [config, position])

  return (
    <div
      className={`ad-container flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: config.width > 0 ? `min(${config.width}px, 100%)` : '100%',
        maxWidth: '100%',
        minHeight: `${config.height}px`,
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        id={`adslot-${position}`}
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
