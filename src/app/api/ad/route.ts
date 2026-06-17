import { NextRequest, NextResponse } from 'next/server'
import { ADS_CONFIG } from '@/lib/ads-config'

// API route that serves the single Adsterra banner ad (728x90) HTML.
// Ads load inside a SANDBOXED IFRAME on the client:
//   sandbox="allow-scripts allow-same-origin
//            allow-top-navigation-by-user-activation
//            allow-popups"
// This lets the ad render + open clicks in new tabs,
// but BLOCKS auto-redirect of the parent page.
//
// Only ONE banner ad position is used site-wide (headerBanner).
// Popunder + Social Bar are loaded directly in layout.tsx
// (not through this endpoint) because they need full-page access.

const BANNER_SIZE = ADS_CONFIG.bannerSize // { width: 728, height: 90 }

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const position = searchParams.get('position')

  if (position !== 'headerBanner') {
    return new NextResponse('Invalid ad position', { status: 400 })
  }

  const key = ADS_CONFIG.bannerKey

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { overflow: hidden; background: transparent; width: 100%; height: 100%; }
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key': '${key}',
    'format': 'iframe',
    'height': ${BANNER_SIZE.height},
    'width': ${BANNER_SIZE.width},
    'params': {}
  };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
