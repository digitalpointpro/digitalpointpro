'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, X, BellRing } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'

/**
 * Push notification subscribe prompt.
 *
 * - If OneSignal is configured (app ID set in site-config.ts), clicking
 *   "Allow" triggers OneSignal's native permission prompt.
 * - If OneSignal is NOT configured, the prompt hides itself after the user
 *   dismisses it (stored in localStorage so it doesn't nag).
 *
 * Shows after 15 seconds on site (engaged visitors), only once per session
 * unless dismissed.
 */
export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    // Don't show if OneSignal isn't configured OR user already dismissed
    const dismissed = localStorage.getItem('dpp-push-dismissed')
    if (dismissed === '1') return

    const timer = setTimeout(() => setVisible(true), 15000)
    return () => clearTimeout(timer)
  }, [])

  // Check subscription status with OneSignal
  useEffect(() => {
    if (!SITE_CONFIG.oneSignalAppId) return
    const w = window as unknown as { OneSignal?: { isPushNotificationsEnabled?: () => Promise<boolean>; on?: (e: string, cb: () => void) => void } }
    if (!w.OneSignal) return
    w.OneSignal.isPushNotificationsEnabled?.().then(setSubscribed).catch(() => {})
  }, [])

  const handleAllow = async () => {
    const w = window as unknown as { OneSignal?: { showSlidedownPrompt?: () => Promise<void>; registerForPushNotifications?: () => Promise<void> } }
    if (w.OneSignal?.showSlidedownPrompt) {
      try {
        await w.OneSignal.showSlidedownPrompt()
        setSubscribed(true)
      } catch {
        // user denied
      }
    }
    setVisible(false)
  }

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem('dpp-push-dismissed', '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-xs animate-in slide-in-from-bottom-5 duration-300 lg:bottom-4">
      <div className="rounded-xl border bg-card/95 backdrop-blur-md shadow-lg p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss notification prompt"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            {subscribed ? <BellRing className="h-5 w-5 text-white" /> : <Bell className="h-5 w-5 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">
              {subscribed ? 'Notifications On!' : 'Get Breaking News Alerts'}
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {subscribed
                ? 'You\u2019ll receive the latest news as it happens.'
                : 'Stay updated with real-time notifications for breaking stories.'}
            </p>
            {!subscribed && (
              <div className="flex gap-2">
                <Button
                  onClick={handleAllow}
                  size="sm"
                  className="h-7 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  Allow
                </Button>
                <Button onClick={handleDismiss} variant="ghost" size="sm" className="h-7 text-xs">
                  Not now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
