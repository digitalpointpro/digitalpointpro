'use client'

import React, { useEffect, useRef } from 'react'

// ============================================
// ADSTERRA AD CONFIGURATION - ONLY SAFE BANNER ADS
// ============================================
// RULE: Only use highperformanceformat.com banner ads.
// DO NOT use effectivecpmnetwork.com scripts - they cause redirects/popunders!
// DO NOT use social bar - it redirects and closes the website!
// DO NOT use native banner from effectivecpmnetwork - it redirects!

type AdType = 'highperformance' | 'smartlink'

interface AdConfig {
  type: AdType
  key?: string
  width: number
  height: number
  smartUrl?: string
}

export const AD_CONFIG = {
  // Header Banner 728x90 - SAFE
  headerBanner: {
    type: 'highperformance' as AdType,
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // Between Articles 468x60 - SAFE
  betweenArticles: {
    type: 'highperformance' as AdType,
    key: 'de9c4f6555d0c2b70c90f6cf8b3c5c04',
    width: 468,
    height: 60,
  },
  // Sidebar 300x250 - SAFE
  sidebar: {
    type: 'highperformance' as AdType,
    key: 'b1f8bed5795a25e0bf744125256b244c',
    width: 300,
    height: 250,
  },
  // Sidebar Tall 160x600 - SAFE
  sidebarTall: {
    type: 'highperformance' as AdType,
    key: 'd94b42a76e538f26af5695da265ba72e',
    width: 160,
    height: 600,
  },
  // Mid Section 160x300 - SAFE
  midSection: {
    type: 'highperformance' as AdType,
    key: 'f3c66e2f00457c1271edf2b126802ce7',
    width: 160,
    height: 300,
  },
  // Footer Banner 728x90 - SAFE (reuse header key)
  footerBanner: {
    type: 'highperformance' as AdType,
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // Mobile Sticky 320x50 - SAFE
  mobileSticky: {
    type: 'highperformance' as AdType,
    key: '182344e1b81fbbec81aaafe6d201cda9',
    width: 320,
    height: 50,
  },
  // Smart Link - SAFE (just a link button, no script)
  smartLink: {
    type: 'smartlink' as AdType,
    width: 0,
    height: 0,
    smartUrl: 'https://www.effectivecpmnetwork.com/wfpqbe5835?key=1785cba448cf21011923ee9ce9b92e8a',
  },
}

type AdPosition = keyof typeof AD_CONFIG

interface AdSlotProps {
  position: AdPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  const config = AD_CONFIG[position]
  const containerRef = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const container = containerRef.current
    if (!container) return

    if (config.type === 'highperformance' && config.key) {
      // Create a SANDBOXED iframe - prevents cross-origin access & redirects
      const iframeId = `ad-iframe-${position}-${Date.now()}`
      
      // Create the options script
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

      container.innerHTML = ''
      container.appendChild(optionsScript)
      container.appendChild(invokeScript)
    }
  }, [config, position])

  // Smart Link renders as a clickable button
  if (config.type === 'smartlink') {
    return <SmartLinkButton url={config.smartUrl || '#'} className={className} />
  }

  return (
    <div
      className={`ad-container flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: config.width > 0 ? `min(${config.width}px, 100%)` : '100%',
        maxWidth: '100%',
        minHeight: config.height > 0 ? `${config.height}px` : '60px',
      }}
    >
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" id={`adslot-${position}`} />
    </div>
  )
}

// Smart Link - looks like a natural "Continue" button for maximum clicks
function SmartLinkButton({ url, className = '' }: { url: string; className?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] no-underline ${className}`}
    >
      <span>📖</span> Continue Reading — More Insights
    </a>
  )
}
