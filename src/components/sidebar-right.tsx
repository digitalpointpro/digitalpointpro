'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem, Category } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import Newsletter from '@/components/newsletter'
import { Star, BookOpen, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SidebarRight() {
  const { openPage } = useNavigation()
  const [editorsPicks, setEditorsPicks] = useState<ArticleListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/articles?editorsPick=true&limit=4')
      .then(res => res.json())
      .then(data => setEditorsPicks(data.articles || []))
      .catch(() => {})

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  return (
    <aside className="space-y-6">
      {/* Editor's Picks */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Editor&apos;s Picks</h3>
        </div>
        <div className="space-y-1">
          {editorsPicks.length === 0 && (
            <p className="text-sm text-muted-foreground">No editor&apos;s picks yet.</p>
          )}
          {editorsPicks.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Categories */}
      {categories.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Categories</h3>
          </div>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                className="w-full justify-between text-sm h-auto py-2 font-normal"
                onClick={() => openPage('category', cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {cat._count?.articles || 0}
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
