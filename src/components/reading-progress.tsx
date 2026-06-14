'use client'

import React, { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const overlay = document.getElementById('article-overlay-content')
    if (!overlay) return

    const handleScroll = () => {
      const scrollTop = overlay.scrollTop
      const scrollHeight = overlay.scrollHeight - overlay.clientHeight
      if (scrollHeight > 0) {
        setProgress((scrollTop / scrollHeight) * 100)
      }
    }

    overlay.addEventListener('scroll', handleScroll, { passive: true })
    return () => overlay.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
  )
}
