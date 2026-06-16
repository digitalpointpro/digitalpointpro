'use client'

import { useEffect } from 'react'
import initRedirectProtection from '@/lib/ad-shield'

// This component initializes the redirect protection
// on the client side when the app loads
export default function AdShieldInit() {
  useEffect(() => {
    initRedirectProtection()
  }, [])

  return null // No UI rendered
}
