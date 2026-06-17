import { NextRequest, NextResponse } from 'next/server'
import { ADS_CONFIG, BANNER_SIZES, BannerType } from '@/lib/ads-config'

// API route that serves Adsterra banner ad HTML inside a SANDBOXED IFRAME.
//
// SANDBOX: allow-scripts allow-same-origin allow-popups
//   ✅ allow-scripts → ad renders
//   ✅ allow-same-origin → nested iframes work
//   ✅ allow-popups → ad click opens NEW TAB (user can view ad)
//   ❌ allow-top-navigation NOT included → main page NEVER redirects
//      (fixes ERR_BLOCKED_BY_RESPONSE — ad was redirecting main page
//       to one-vv0990.com which browser blocks)
//
// Supported positions: leaderboard, medium, box, mobileSticky

const VALID_POSITIONS: BannerType[] = ['leaderboard', 'medium', 'box', 'mobileSticky']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const position = searchParams.get('position') as BannerType | null

  if (!position || !VALID_POSITIONS.includes(position)) {
    return new NextResponse('Invalid ad position', { status: 400 })
  }

  const key = ADS_CONFIG.banners[position]
  const size = BANNER_SIZES[position]

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
    'height': ${size.height},
    'width': ${size.width},
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
