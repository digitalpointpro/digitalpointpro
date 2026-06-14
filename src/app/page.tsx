'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import ArticleCard from '@/components/article-card'
import SidebarRight from '@/components/sidebar-right'
import ArticleOverlay from '@/components/article-overlay'
import StaticPageOverlay from '@/components/static-page-overlay'
import CategoryOverlay from '@/components/category-overlay'
import SearchModal from '@/components/search-modal'
import AdminOverlay from '@/components/admin-overlay'
import LatestNewsOverlay from '@/components/latest-news-overlay'
import BackToTop from '@/components/back-to-top'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, Zap, Newspaper, Brain, Cpu, Heart, Briefcase, PenTool } from 'lucide-react'

export default function Home() {
  const { overlayType, isOverlayOpen, openPage } = useNavigation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [trending, setTrending] = useState<ArticleListItem[]>([])
  const [latest, setLatest] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch articles
  useEffect(() => {
    Promise.all([
      fetch('/api/articles?trending=true&limit=6').then(res => res.json()),
      fetch('/api/articles?limit=8').then(res => res.json()),
    ])
      .then(([trendingData, latestData]) => {
        setTrending(trendingData.articles || [])
        setLatest(latestData.articles || [])
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

  // Section cards for the frozen front page
  const sections = [
    { icon: Newspaper, label: 'Latest News', desc: 'Breaking stories & live updates', color: 'from-red-500 to-orange-500', action: () => openPage('latest-news') },
    { icon: Brain, label: 'AI', desc: 'Artificial Intelligence trends', color: 'from-violet-500 to-purple-500', action: () => openPage('category', 'artificial-intelligence') },
    { icon: Cpu, label: 'Technology', desc: 'Tech innovations & gadgets', color: 'from-blue-500 to-cyan-500', action: () => openPage('category', 'technology-trends') },
    { icon: Heart, label: 'Health', desc: 'Wellness & lifestyle tips', color: 'from-pink-500 to-rose-500', action: () => openPage('category', 'health-wellness') },
    { icon: Briefcase, label: 'Business', desc: 'Money & online business', color: 'from-emerald-500 to-teal-500', action: () => openPage('category', 'online-business') },
    { icon: PenTool, label: 'Freelancing', desc: 'Remote work & skills', color: 'from-amber-500 to-yellow-500', action: () => openPage('category', 'freelancing') },
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header - Sticky at Top */}
      <Header />

      {/* Main Content - Frozen, fits viewport */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Hero Banner */}
          <Hero />

          {/* Section Cards - Quick Access */}
          <section className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {sections.map((section) => (
                <button
                  key={section.label}
                  onClick={section.action}
                  className="group relative overflow-hidden rounded-xl border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/30"
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{section.label}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{section.desc}</p>
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                </button>
              ))}
            </div>
          </section>

          <Separator className="my-6" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Trending Articles */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    Trending Now
                  </h2>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[16/10] rounded-lg" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {trending.slice(0, 6).map((article) => (
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

              {/* Latest Articles */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                    Recent Posts
                  </h2>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-24 h-20 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {latest.slice(0, 8).map((article) => (
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

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20">
                <SidebarRight />
              </div>
            </div>
          </div>

          {/* Mobile sidebar */}
          <div className="lg:hidden mt-8 space-y-6">
            <Separator />
            <SidebarRight />
          </div>
        </div>
      </main>

      {/* Footer - Sticky at Bottom */}
      <Footer />

      {/* Overlays */}
      {isOverlayOpen && overlayType === 'article' && <ArticleOverlay />}
      {isOverlayOpen && overlayType === 'legal' && (
        <StaticPageOverlay type={overlayType} />
      )}
      {isOverlayOpen && overlayType === 'category' && <CategoryOverlay />}
      {isOverlayOpen && overlayType === 'admin' && <AdminOverlay />}
      {isOverlayOpen && overlayType === 'latest-news' && <LatestNewsOverlay />}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
