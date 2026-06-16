import { NextRequest, NextResponse } from 'next/server'

// API route that serves Adsterra ad HTML for sandboxed iframes
// This allows ads to render in an iframe with sandbox="allow-scripts"
// which BLOCKS: top-navigation, popups, same-origin access to parent

const BANNER_CONFIGS: Record<string, { key: string; width: number; height: number }> = {
  headerBanner: { key: 'bee03c8feeebc403d01e864f5008c118', width: 728, height: 90 },
  betweenArticles: { key: 'de9c4f6555d0c2b70c90f6cf8b3c5c04', width: 468, height: 60 },
  sidebar: { key: 'b1f8bed5795a25e0bf744125256b244c', width: 300, height: 250 },
  sidebarTall: { key: 'd94b42a76e538f26af5695da265ba72e', width: 160, height: 600 },
  midSection: { key: 'f3c66e2f00457c1271edf2b126802ce7', width: 160, height: 300 },
  footerBanner: { key: 'bee03c8feeebc403d01e864f5008c118', width: 728, height: 90 },
  mobileSticky: { key: '182344e1b81fbbec81aaafe6d201cda9', width: 320, height: 50 },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const position = searchParams.get('position')

  if (!position || !BANNER_CONFIGS[position]) {
    return new NextResponse('Invalid ad position', { status: 400 })
  }

  const config = BANNER_CONFIGS[position]

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { overflow: hidden; background: transparent; width: ${config.width}px; height: ${config.height}px; }
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

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  })
}
