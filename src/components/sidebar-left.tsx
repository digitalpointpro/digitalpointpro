'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import { TrendingUp, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function SidebarLeft() {
  const { openArticle } = useNavigation()
  const [trending, setTrending] = useState<ArticleListItem[]>([])
  const [recent, setRecent] = useState<ArticleListItem[]>([])

  useEffect(() => {
    fetch('/api/articles?trending=true&limit=5')
      .then(res => res.json())
      .then(data => setTrending(data.articles || []))
      .catch(() => {})

    fetch('/api/articles?limit=5')
      .then(res => res.json())
      .then(data => setRecent(data.articles || []))
      .catch(() => {})
  }, [])

  return (
    <aside className="space-y-6">
      {/* Trending Topics */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Trending Now</h3>
        </div>
        <div className="space-y-1">
          {trending.length === 0 && (
            <p className="text-sm text-muted-foreground">No trending articles yet.</p>
          )}
          {trending.map((article, idx) => (
            <div key={article.id}>
              <div
                className="flex items-start gap-3 py-2.5 cursor-pointer group"
                onClick={() => openArticle(article.slug)}
              >
                <span className="text-2xl font-bold text-primary/30 shrink-0 leading-none mt-0.5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {article.readTime} min read
                  </span>
                </div>
              </div>
              {idx < trending.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>

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
    </aside>
  )
}
