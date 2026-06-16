'use client'

import React, { useEffect, useRef } from 'react'

// ============================================
// AD CONFIGURATION - UPDATE YOUR AD IDS HERE
// ============================================
// When you get your Adsterra ad codes, replace the IDs below.
// Format: { zoneId: string, width: number, height: number }
//
// To add your Adsterra ads:
// 1. Go to Adsterra dashboard
// 2. Create banner ads (NOT popunder/interstitial - those break the site)
// 3. Get the zone IDs from the ad code
// 4. Put them in the config below

export const AD_CONFIG = {
  // Top banner ad (728x90 leaderboard) - shown below header
  headerBanner: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 728,
    height: 90,
  },
  // In-article ad (responsive) - shown between article paragraphs
  inArticle: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 0,    // 0 = responsive
    height: 0,
  },
  // Sidebar ad (300x250 medium rectangle)
  sidebar: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 300,
    height: 250,
  },
  // Between articles ad (728x90) - shown between article cards
  betweenArticles: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 728,
    height: 90,
  },
  // Footer banner ad (728x90 leaderboard) - shown above footer
  footerBanner: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 728,
    height: 90,
  },
  // Mobile sticky ad (320x50) - shown at bottom on mobile
  mobileSticky: {
    zoneId: '',  // Put your Adsterra zone ID here
    width: 320,
    height: 50,
  },
}

type AdPosition = keyof typeof AD_CONFIG

interface AdSlotProps {
  position: AdPosition
  className?: string
}

// Adsterra script loader - loads banner ads only (NO popunders)
function loadAdsterraBanner(containerId: string, zoneId: string) {
  if (!zoneId || typeof window === 'undefined') return

  const container = document.getElementById(containerId)
  if (!container) return

  // Clear any existing content
  container.innerHTML = ''

  // Create the Adsterra iframe
  const iframe = document.createElement('iframe')
  iframe.src = `https://a.magsrv.com/iframe.php?zoneid=${zoneId}&output=iframe`
  iframe.width = '100%'
  iframe.height = '100%'
  iframe.frameBorder = '0'
  iframe.scrolling = 'no'
  iframe.style.border = 'none'
  iframe.style.maxWidth = '100%'
  iframe.allowTransparency = true
  container.appendChild(iframe)
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  const config = AD_CONFIG[position]
  const containerId = `ad-${position}-${Math.random().toString(36).substr(2, 9)}`
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (config.zoneId) {
      // Small delay to ensure container is mounted
      const timer = setTimeout(() => {
        loadAdsterraBanner(containerId, config.zoneId)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [config.zoneId, containerId])

  // If no zone ID configured, show a placeholder
  if (!config.zoneId) {
    return (
      <AdPlaceholder position={position} config={config} className={className} />
    )
  }

  // Live ad slot
  return (
    <div
      className={`ad-container flex items-center justify-center ${className}`}
      style={{
        width: config.width > 0 ? `${config.width}px` : '100%',
        maxWidth: '100%',
        minHeight: config.height > 0 ? `${config.height}px` : '100px',
      }}
    >
      <div id={containerId} ref={containerRef} className="w-full h-full" />
    </div>
  )
}

// Placeholder shown when no ad is configured yet
function AdPlaceholder({ position, config, className }: { position: AdPosition; config: typeof AD_CONFIG[AdPosition]; className: string }) {
  const labels: Record<AdPosition, string> = {
    headerBanner: '📢 Header Banner Ad (728×90)',
    inArticle: '📖 In-Article Ad (Responsive)',
    sidebar: '📌 Sidebar Ad (300×250)',
    betweenArticles: '📋 Between Articles Ad (728×90)',
    footerBanner: '📢 Footer Banner Ad (728×90)',
    mobileSticky: '📱 Mobile Sticky Ad (320×50)',
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 ${className}`}
      style={{
        width: config.width > 0 ? `min(${config.width}px, 100%)` : '100%',
        maxWidth: '100%',
        minHeight: config.height > 0 ? `${config.height}px` : '80px',
      }}
    >
      <div className="text-center px-4 py-2">
        <p className="text-xs text-muted-foreground/60 font-medium">{labels[position]}</p>
        <p className="text-[10px] text-muted-foreground/40 mt-0.5">Add your Adsterra Zone ID in src/components/ad-slot.tsx</p>
      </div>
    </div>
  )
}
