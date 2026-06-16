'use client'

import React, { useEffect, useRef } from 'react'

// ============================================
// ADSTERRA AD CONFIGURATION - ALL REAL ADS
// ============================================

type AdType = 'highperformance' | 'effectivecpm' | 'native' | 'social' | 'smartlink'

interface AdConfig {
  type: AdType
  key?: string
  width: number
  height: number
  scriptUrl?: string
  containerId?: string
  smartUrl?: string
}

export const AD_CONFIG = {
  // Header Banner 728x90
  headerBanner: {
    type: 'highperformance' as AdType,
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // In-Article Native Banner
  inArticle: {
    type: 'native' as AdType,
    key: '2761c91d10614f91e57209b5fe40a64f',
    width: 0,
    height: 0,
    scriptUrl: 'https://pl29749330.effectivecpmnetwork.com/2761c91d10614f91e57209b5fe40a64f/invoke.js',
    containerId: 'container-2761c91d10614f91e57209b5fe40a64f',
  },
  // Sidebar 300x250
  sidebar: {
    type: 'highperformance' as AdType,
    key: 'b1f8bed5795a25e0bf744125256b244c',
    width: 300,
    height: 250,
  },
  // Sidebar Tall 160x600
  sidebarTall: {
    type: 'highperformance' as AdType,
    key: 'd94b42a76e538f26af5695da265ba72e',
    width: 160,
    height: 600,
  },
  // Between Articles 468x60
  betweenArticles: {
    type: 'highperformance' as AdType,
    key: 'de9c4f6555d0c2b70c90f6cf8b3c5c04',
    width: 468,
    height: 60,
  },
  // Mid Section 160x300
  midSection: {
    type: 'highperformance' as AdType,
    key: 'f3c66e2f00457c1271edf2b126802ce7',
    width: 160,
    height: 300,
  },
  // Footer Banner 728x90 (reuse header)
  footerBanner: {
    type: 'highperformance' as AdType,
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // Mobile Sticky 320x50
  mobileSticky: {
    type: 'highperformance' as AdType,
    key: '182344e1b81fbbec81aaafe6d201cda9',
    width: 320,
    height: 50,
  },
  // Social Bar
  socialBar: {
    type: 'social' as AdType,
    width: 0,
    height: 0,
    scriptUrl: 'https://pl29749331.effectivecpmnetwork.com/18/49/31/1849316fdff11436e8c595fee5622180.js',
  },
  // Smart Link
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

// Generate unique container IDs
let adCounter = 0
function getUniqueId(position: string) {
  adCounter++
  return `ad-${position}-${adCounter}-${Date.now()}`
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  const config = AD_CONFIG[position]
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueId = useRef(getUniqueId(position))
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const container = containerRef.current
    if (!container) return

    if (config.type === 'highperformance' && config.key) {
      // Highperformanceformat.com ad (728x90, 468x60, 300x250, 320x50, 160x300, 160x600)
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
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`
      invokeScript.async = true

      container.innerHTML = ''
      container.appendChild(optionsScript)
      container.appendChild(invokeScript)
    } else if (config.type === 'native' && config.scriptUrl && config.containerId) {
      // Native banner ad
      const containerDiv = document.createElement('div')
      containerDiv.id = config.containerId
      container.appendChild(containerDiv)

      const script = document.createElement('script')
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      script.src = config.scriptUrl
      container.appendChild(script)
    } else if (config.type === 'social' && config.scriptUrl) {
      // Social bar
      const script = document.createElement('script')
      script.src = config.scriptUrl
      container.appendChild(script)
    }
  }, [config])

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
