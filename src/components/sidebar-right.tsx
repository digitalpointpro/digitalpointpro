'use client'

import React, { useState, useEffect } from 'react'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import Newsletter from '@/components/newsletter'
import AdSlot from '@/components/ad-slot'
import { Clock } from 'lucide-react'

export default function SidebarRight() {
  const [recent, setRecent] = useState<ArticleListItem[]>([])

  useEffect(() => {
    fetch('/api/articles?limit=5')
      .then(res => res.json())
      .then(data => setRecent(data.articles || []))
      .catch(() => {})
  }, [])

  return (
    <aside className="space-y-6">
      {/* Recent Posts */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Recent Posts</h3>
        </div>
        <div className="space-y-1">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">No articles yet.</p>
          )}
          {recent.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Sidebar Ad 300x250 */}
      <AdSlot position="sidebar" />

      {/* Smart Link */}
      <div className="text-center">
        <AdSlot position="smartLink" />
      </div>
    </aside>
  )
}
