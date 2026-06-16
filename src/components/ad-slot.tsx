'use client'

import React from 'react'

// ============================================
// ADSTERRA BANNER ADS - SANDBOXED IFRAMES
// ============================================
// CRITICAL: All ads run inside sandboxed iframes with:
//   sandbox="allow-scripts" 
// This BLOCKS:
//   - allow-top-navigation (NO page redirects!)
//   - allow-popups (NO popup windows!)
//   - allow-same-origin (NO parent page access!)
// Only allow-scripts so the ad can render its creative.
// ============================================

type BannerPosition =
  | 'headerBanner'
  | 'betweenArticles'
  | 'sidebar'
  | 'sidebarTall'
  | 'midSection'
  | 'footerBanner'
  | 'mobileSticky'

interface BannerConfig {
  key: string
  width: number
  height: number
}

const BANNER_ADS: Record<BannerPosition, BannerConfig> = {
  // Header Banner 728x90
  headerBanner: {
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // Between Articles 468x60
  betweenArticles: {
    key: 'de9c4f6555d0c2b70c90f6cf8b3c5c04',
    width: 468,
    height: 60,
  },
  // Sidebar 300x250
  sidebar: {
    key: 'b1f8bed5795a25e0bf744125256b244c',
    width: 300,
    height: 250,
  },
  // Sidebar Tall 160x600
  sidebarTall: {
    key: 'd94b42a76e538f26af5695da265ba72e',
    width: 160,
    height: 600,
  },
  // Mid Section 160x300
  midSection: {
    key: 'f3c66e2f00457c1271edf2b126802ce7',
    width: 160,
    height: 300,
  },
  // Footer Banner 728x90
  footerBanner: {
    key: 'bee03c8feeebc403d01e864f5008c118',
    width: 728,
    height: 90,
  },
  // Mobile Sticky 320x50
  mobileSticky: {
    key: '182344e1b81fbbec81aaafe6d201cda9',
    width: 320,
    height: 50,
  },
}

interface AdSlotProps {
  position: BannerPosition
  className?: string
}

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  const config = BANNER_ADS[position]

  // Build the HTML that will run inside the sandboxed iframe
  const adHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; }
  body { overflow: hidden; background: transparent; }
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key': '${config.key}',
    'format': 'iframe',
    'height': ${config.height},
    'width': ${config.width},
    'params': {}
  };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js"></script>
</body>
</html>`

  return (
    <div
      className={`ad-container flex items-center justify-center ${className}`}
      style={{
        width: '100%',
        maxWidth: `${config.width}px`,
        minHeight: `${config.height}px`,
      }}
    >
      <iframe
        srcDoc={adHtml}
        sandbox="allow-scripts"
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          maxWidth: '100%',
          border: 'none',
          overflow: 'hidden',
          display: 'block',
        }}
        scrolling="no"
        title={`Advertisement`}
        aria-hidden="true"
      />
    </div>
  )
}
