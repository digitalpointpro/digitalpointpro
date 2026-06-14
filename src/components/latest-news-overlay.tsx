'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { X, ChevronRight, Newspaper } from 'lucide-react'

export default function LatestNewsOverlay() {
  const { closeOverlay } = useNavigation()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/articles?limit=20')
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setArticles(data.articles || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-background overlay-enter">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={closeOverlay}
              className="hover:text-foreground transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Latest News</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closeOverlay}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 49px)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Latest News
              </h1>
            </div>
            <p className="text-muted-foreground">
              Stay up to date with the newest articles across all categories.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] rounded-lg" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No articles yet. Stay tuned for great content!
              </p>
              <Button variant="outline" className="mt-4" onClick={closeOverlay}>
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="vertical"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
