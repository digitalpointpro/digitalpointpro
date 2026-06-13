'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem, Category } from '@/lib/types'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import ArticleCard from '@/components/article-card'
import SidebarLeft from '@/components/sidebar-left'
import SidebarRight from '@/components/sidebar-right'
import ArticleOverlay from '@/components/article-overlay'
import StaticPageOverlay from '@/components/static-page-overlay'
import CategoryOverlay from '@/components/category-overlay'
import SearchModal from '@/components/search-modal'
import BackToTop from '@/components/back-to-top'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, Zap, Star, Eye } from 'lucide-react'

export default function Home() {
  const { overlayType, isOverlayOpen } = useNavigation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [trending, setTrending] = useState<ArticleListItem[]>([])
  const [latest, setLatest] = useState<ArticleListItem[]>([])
  const [editorsPicks, setEditorsPicks] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch articles
  useEffect(() => {
    Promise.all([
      fetch('/api/articles?trending=true&limit=6').then(res => res.json()),
      fetch('/api/articles?limit=8').then(res => res.json()),
      fetch('/api/articles?editorsPick=true&limit=6').then(res => res.json()),
    ])
      .then(([trendingData, latestData, editorsData]) => {
        setTrending(trendingData.articles || [])
        setLatest(latestData.articles || [])
        setEditorsPicks(editorsData.articles || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Search modal event listener
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true)
    window.addEventListener('openSearch', handleOpenSearch)
    return () => window.removeEventListener('openSearch', handleOpenSearch)
  }, [])

  // Popstate for browser back/forward
  useEffect(() => {
    const handlePopstate = () => {
      const nav = useNavigation.getState()
      if (!window.location.pathname || window.location.pathname === '/') {
        nav.closeOverlay()
      }
    }
    window.addEventListener('popstate', handlePopstate)
    return () => window.removeEventListener('popstate', handlePopstate)
  }, [])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <Hero />

        {/* Main Content Area */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - hidden on mobile */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-20">
                <SidebarLeft />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-7 space-y-12">
              {/* Trending Articles */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Trending Articles
                  </h2>
                </div>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-36 h-36 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : trending.length === 0 ? (
                  <div className="text-center py-12 rounded-lg border bg-muted/20">
                    <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No trending articles yet. Check back soon!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trending.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                )}
              </section>

              <Separator />

              {/* Latest Articles */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Latest Articles
                  </h2>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="aspect-[16/10] rounded-lg" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : latest.length === 0 ? (
                  <div className="text-center py-12 rounded-lg border bg-muted/20">
                    <Zap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No articles yet. Stay tuned for great content!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {latest.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="vertical"
                      />
                    ))}
                  </div>
                )}
              </section>

              <Separator />

              {/* Editor's Picks */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Editor&apos;s Picks
                  </h2>
                </div>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-36 h-36 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : editorsPicks.length === 0 ? (
                  <div className="text-center py-12 rounded-lg border bg-muted/20">
                    <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No editor&apos;s picks yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editorsPicks.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right Sidebar - hidden on mobile */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <SidebarRight />
              </div>
            </div>
          </div>

          {/* Mobile sidebars - show as sections below main content */}
          <div className="lg:hidden mt-12 space-y-8">
            <Separator />
            <SidebarLeft />
            <Separator />
            <SidebarRight />
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />

      {/* Overlays */}
      {isOverlayOpen && overlayType === 'article' && <ArticleOverlay />}
      {isOverlayOpen && overlayType && ['about', 'privacy', 'disclaimer', 'terms', 'contact'].includes(overlayType) && (
        <StaticPageOverlay type={overlayType} />
      )}
      {isOverlayOpen && overlayType === 'category' && <CategoryOverlay />}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
