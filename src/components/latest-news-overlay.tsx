'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import Newsletter from '@/components/newsletter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { X, ChevronRight, ArrowLeft, Newspaper, Zap, AlertTriangle, Play, Home, Brain, Cpu, Heart, Briefcase, Pen, Shield, Smartphone, MapPin, Youtube } from 'lucide-react'

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

// Real YouTube war/conflict news videos from BBC, Al Jazeera, NBC, CNN etc.
const warVideos = [
  { id: 'Tzw3FusCNMg', title: '100th Day of US-Israel War with Iran - BBC News' },
  { id: 'E8NCz44JRS0', title: 'Iran & Israel Pause Strikes, Ceasefire Warnings - BBC News' },
  { id: 'GfN_5AN9_5o', title: 'US & Iran Exchange Strikes Across Middle East - BBC News' },
  { id: 'D3FWeG1Uqhg', title: 'Trump Tells Israel & Iran to Stop Shooting - BBC News' },
  { id: '9tLp08WpWjY', title: 'Trump Says US-Iran Deal to Be Signed Tomorrow - Al Jazeera' },
  { id: 'eqtYzJIq520', title: 'US & Iran Close to Signing Agreement - NBC News' },
]

export default function LatestNewsOverlay() {
  const { closeOverlay, openPage } = useNavigation()
  const [articles, setArticles] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/articles?category=latest-news&limit=20').then(res => res.json()),
    ])
      .then(([newsData]) => {
        if (cancelled) return
        const newsArticles = newsData.articles || []
        if (newsArticles.length > 0) {
          setArticles(newsArticles)
        } else {
          fetch('/api/articles?limit=20')
            .then(res => res.json())
            .then(data => {
              if (!cancelled) {
                setArticles(data.articles || [])
              }
            })
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleNavClick = (cat: typeof navCategories[number]) => {
    if (cat.action === 'home') {
      closeOverlay()
    } else if (cat.action === 'latest-news') {
      // Already here
    } else if (cat.action === 'category' && cat.slug) {
      openPage('category', cat.slug)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overlay-enter">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
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
        {/* Category navigation row */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mx-1 pb-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {navCategories.map((cat) => {
              const isActive = cat.action === 'latest-news'
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <Newspaper className="h-8 w-8 text-primary" />
                <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Latest News
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="destructive" className="text-[10px] px-2 py-0 h-5">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Breaking stories, geopolitical analysis & live updates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Live Videos Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Youtube className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-bold tracking-tight">Live War Coverage & Video Reports</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {warVideos.map((video) => (
                <div key={video.id} className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border group">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t my-8" />

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
                No breaking news at the moment. Check back soon!
              </p>
              <Button variant="outline" className="mt-4" onClick={closeOverlay}>
                Back to Home
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Articles Grid */}
              <div className="lg:col-span-8">
                {/* Featured first article */}
                {articles[0] && (
                  <div className="mb-6">
                    <ArticleCard article={articles[0]} variant="featured" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.slice(1).map((article) => (
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
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Latest Headlines
                    </h3>
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
