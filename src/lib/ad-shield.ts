// ============================================
// REDIRECT PROTECTION SCRIPT
// ============================================
// This script blocks automatic redirects and popunders
// from ad scripts while allowing user-initiated clicks.
//
// How it works:
// 1. Tracks when user clicks anywhere on the page
// 2. Blocks window.open() calls that happen without user click
// 3. Blocks window.location changes that happen without user click
// 4. Uses beforeunload to catch any remaining redirect attempts
// ============================================

export default function initRedirectProtection() {
  if (typeof window === 'undefined') return

  // Track user click state
  let lastUserClickTime = 0

  // Listen for real user clicks (capture phase = before everything)
  document.addEventListener('click', () => {
    lastUserClickTime = Date.now()
  }, true)

  document.addEventListener('touchstart', () => {
    lastUserClickTime = Date.now()
  }, true)

  // ============================================
  // 1. BLOCK AUTO window.open() (popunders)
  // ============================================
  const originalWindowOpen = window.open
  window.open = function (...args: Parameters<typeof window.open>) {
    const timeSinceClick = Date.now() - lastUserClickTime

    // Block if no click in last 1000ms (auto-popunder)
    if (timeSinceClick > 1000) {
      console.log('[Ad Shield] Blocked auto-popup:', args[0])
      return null
    }

    // Allow if user recently clicked (legitimate ad click)
    return originalWindowOpen.apply(window, args)
  }

  // ============================================
  // 2. BLOCK AUTO navigation via window.location
  // ============================================
  let lastAllowedNavigation = Date.now()

  // Override location setter to block auto-redirects
  try {
    const originalAssign = window.location.assign.bind(window.location)
    window.location.assign = function (url: string) {
      const timeSinceClick = Date.now() - lastUserClickTime
      if (timeSinceClick > 1000) {
        console.log('[Ad Shield] Blocked auto-redirect via location.assign:', url)
        return
      }
      lastAllowedNavigation = Date.now()
      return originalAssign(url)
    }

    const originalReplace = window.location.replace.bind(window.location)
    window.location.replace = function (url: string) {
      const timeSinceClick = Date.now() - lastUserClickTime
      if (timeSinceClick > 1000) {
        console.log('[Ad Shield] Blocked auto-redirect via location.replace:', url)
        return
      }
      lastAllowedNavigation = Date.now()
      return originalReplace(url)
    }
  } catch (e) {
    // location override may fail in some browsers, that's OK
  }

  // ============================================
  // 3. BLOCK iframe top-navigation attempts
  // ============================================
  // Intercept messages from iframes that try to navigate
  window.addEventListener('message', (event) => {
    // Block any message that contains a URL redirect
    if (event.data && typeof event.data === 'string' && event.data.includes('http')) {
      const timeSinceClick = Date.now() - lastUserClickTime
      if (timeSinceClick > 1000) {
        event.stopImmediatePropagation()
        console.log('[Ad Shield] Blocked iframe redirect message')
      }
    }
  }, true)

  // ============================================
  // 4. beforeunload - last line of defense
  // ============================================
  window.addEventListener('beforeunload', (event) => {
    const timeSinceClick = Date.now() - lastUserClickTime
    const timeSinceAllowedNav = Date.now() - lastAllowedNavigation

    // If no user click recently and no allowed navigation, block
    if (timeSinceClick > 2000 && timeSinceAllowedNav > 2000) {
      event.preventDefault()
      // Modern browsers require returnValue
      const confirmationMessage = 'Are you sure you want to leave?'
      event.returnValue = confirmationMessage
      return confirmationMessage
    }
  })

  console.log('[Ad Shield] Redirect protection active - auto-redirects blocked, clicks allowed')
}
