'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem, Category } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import Newsletter from '@/components/newsletter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { X, ChevronRight, ArrowLeft, Home, Newspaper, Brain, Cpu, Heart, Briefcase, Pen, Shield, Smartphone, MapPin } from 'lucide-react'

const navCategories = [
  { label: 'Home', icon: Home, action: 'home' as const },
  { label: 'News', icon: Newspaper, action: 'latest-news' as const },
  { label: 'AI', icon: Brain, action: 'category' as const, slug: 'artificial-intelligence' },
  { label: 'Tech', icon: Cpu, action: 'category' as const, slug: 'technology-trends' },
  { label: 'Health', icon: Heart, action: 'category' as const, slug: 'health-lifestyle' },
  { label: 'Business', icon: Briefcase, action: 'category' as const, slug: 'online-business' },
  { label: 'Remote', icon: MapPin, action: 'category' as const, slug: 'remote-jobs' },
  { label: 'Freelance', icon: Pen, action: 'category' as const, slug: 'freelancing' },
  { label: 'Security', icon: Shield, action: 'category' as const, slug: 'cyber-security' },
  { label: 'Phone', icon: Smartphone, action: 'category' as const, slug: 'smartphone-tips' },
]

export default function CategoryOverlay() {
  const { overlayData, closeOverlay, openPage } = useNavigation()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchedSlug = useRef<string | null>(null)

  useEffect(() => {
    if (!overlayData) return
    if (fetchedSlug.current === overlayData) return
    fetchedSlug.current = overlayData

    let cancelled = false
    Promise.all([
      fetch(`/api/articles?category=${overlayData}&limit=20`).then(res => res.json()),
      fetch('/api/categories').then(res => res.json()),
    ])
      .then(([articlesData, categoriesData]) => {
        if (cancelled) return
        setArticles(articlesData.articles || [])
        const cat = (categoriesData.categories || []).find(
          (c: Category) => c.slug === overlayData
        )
        setCategory(cat || null)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [overlayData])

  const handleNavClick = (cat: typeof navCategories[number]) => {
    if (cat.action === 'home') {
      closeOverlay()
    } else if (cat.action === 'latest-news') {
      openPage('latest-news')
    } else if (cat.action === 'category' && cat.slug) {
      openPage('category', cat.slug)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overlay-enter">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        {/* Main nav row */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeOverlay}
              className="gap-1.5 h-7 px-2 text-primary hover:bg-primary/10 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {category?.name || 'Category'}
            </span>
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
        {/* Category navigation row */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mx-1 pb-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {navCategories.map((cat) => {
              const isActive = cat.slug === overlayData || (cat.action === 'latest-news' && overlayData === 'latest-news')
              return (
                <Button
                  key={cat.label}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavClick(cat)}
                  className={`gap-1 text-xs font-medium h-7 px-2.5 shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <cat.icon className="h-3 w-3" />
                  {cat.label}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 88px)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <Badge className="mb-3">{category?.name || 'Category'}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {category?.name || 'Articles'}
            </h1>
            {category?.description && (
              <p className="text-lg text-muted-foreground">
                {category.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
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
              <p className="text-muted-foreground text-lg">
                No articles found in this category.
              </p>
              <Button variant="outline" className="mt-4" onClick={closeOverlay}>
                Browse all articles
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Articles Grid */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="vertical"
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-20 space-y-6">
                  <Newsletter />

                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="font-semibold text-sm mb-3">Popular in {category?.name}</h3>
                    <div className="space-y-1">
                      {articles.slice(0, 5).map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
