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
import AdSlot from '@/components/ad-slot'
import { Separator } from '@/components/ui/separator'
import { Newspaper, Brain, Cpu, Heart, Briefcase, Pen, Shield, Smartphone, MapPin } from 'lucide-react'

export default function HomePage() {
  const { overlayType, isOverlayOpen, openPage } = useNavigation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [latest, setLatest] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch articles
  useEffect(() => {
    fetch('/api/articles?limit=12')
      .then(res => res.json())
      .then(data => {
        setLatest(data.articles || [])
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

  // Navigation sections with icons and gradient colors - COLORFUL backgrounds
  const sections = [
    { icon: Newspaper, label: 'Latest News', desc: 'Breaking stories & war updates', gradient: 'from-red-500 to-orange-500', bg: 'bg-gradient-to-br from-red-500 to-orange-500', shadow: 'shadow-red-500/20' },
    { icon: Brain, label: 'AI', desc: 'Artificial Intelligence trends', gradient: 'from-violet-500 to-purple-600', bg: 'bg-gradient-to-br from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
    { icon: Cpu, label: 'Technology', desc: 'Tech innovations & gadgets', gradient: 'from-cyan-500 to-teal-500', bg: 'bg-gradient-to-br from-cyan-500 to-teal-500', shadow: 'shadow-cyan-500/20' },
    { icon: Heart, label: 'Health', desc: 'Wellness & lifestyle tips', gradient: 'from-pink-500 to-rose-500', bg: 'bg-gradient-to-br from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20' },
    { icon: Briefcase, label: 'Business', desc: 'Online money & business', gradient: 'from-emerald-500 to-green-600', bg: 'bg-gradient-to-br from-emerald-500 to-green-600', shadow: 'shadow-emerald-500/20' },
    { icon: MapPin, label: 'Remote Jobs', desc: 'Work from anywhere', gradient: 'from-sky-500 to-blue-600', bg: 'bg-gradient-to-br from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' },
    { icon: Pen, label: 'Freelancing', desc: 'Freelance career & skills', gradient: 'from-amber-500 to-yellow-500', bg: 'bg-gradient-to-br from-amber-500 to-yellow-500', shadow: 'shadow-amber-500/20' },
    { icon: Shield, label: 'Cyber Security', desc: 'Stay safe online', gradient: 'from-red-600 to-rose-700', bg: 'bg-gradient-to-br from-red-600 to-rose-700', shadow: 'shadow-red-600/20' },
    { icon: Smartphone, label: 'Smartphone', desc: 'Tips, tricks & apps', gradient: 'from-fuchsia-500 to-pink-600', bg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-500/20' },
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30">
      {/* Animated Background - More Colorful */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradient orbs - more vibrant */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-[700px] h-[700px] bg-teal-500/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-2/3 left-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '5s' }} />
        {/* Floating particles */}
        <div className="absolute top-20 left-[15%] w-2 h-2 bg-emerald-500/20 rounded-full animate-float" />
        <div className="absolute top-40 right-[20%] w-1.5 h-1.5 bg-teal-500/15 rounded-full animate-float-delayed" />
        <div className="absolute bottom-32 left-[30%] w-2.5 h-2.5 bg-violet-500/10 rounded-full animate-float-slow" />
        <div className="absolute top-[60%] right-[10%] w-1 h-1 bg-rose-500/20 rounded-full animate-float" />
        <div className="absolute top-[30%] left-[60%] w-2 h-2 bg-amber-500/10 rounded-full animate-float-delayed" />
        <div className="absolute top-[80%] left-[70%] w-1.5 h-1.5 bg-cyan-500/15 rounded-full animate-float" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.015)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)]" />
      </div>

      {/* Header - Fixed at Top */}
      <Header />

      {/* Main Content - Frozen, fits viewport */}
      <main className="flex-1 overflow-hidden relative z-10">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Header Banner Ad */}
            <AdSlot position="headerBanner" className="mb-4" />

            {/* Hero Banner */}
            <Hero />

            {/* Section Navigation Cards - Colorful backgrounds */}
            <section className="mt-6">
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
                {sections.map((section) => (
                  <button
                    key={section.label}
                    onClick={() => {
                      if (section.label === 'Latest News') {
                        openPage('latest-news')
                      } else {
                        const slugs: Record<string, string> = {
                          'AI': 'artificial-intelligence',
                          'Technology': 'technology-trends',
                          'Health': 'health-lifestyle',
                          'Business': 'online-business',
                          'Remote Jobs': 'remote-jobs',
                          'Freelancing': 'freelancing',
                          'Cyber Security': 'cyber-security',
                          'Smartphone': 'smartphone-tips',
                        }
                        openPage('category', slugs[section.label])
                      }
                    }}
                    className="group relative overflow-hidden rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.05] active:scale-[0.97]"
                    style={{ background: 'transparent' }}
                  >
                    {/* Colorful gradient background */}
                    <div className={`absolute inset-0 ${section.bg} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-300 rounded-xl`} />
                    <div className="absolute inset-0 border border-current/5 rounded-xl" />
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-1.5 sm:mb-2 rounded-xl ${section.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-md ${section.shadow}`}>
                      <section.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-foreground leading-tight relative z-10">{section.label}</h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 hidden sm:block relative z-10">{section.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <Separator className="my-4" />

            {/* Between Sections Ad */}
            <AdSlot position="betweenArticles" className="my-4" />

            {/* Main Content Grid - Latest Articles + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Articles */}
              <div className="lg:col-span-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Latest Articles
                    </h2>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                          <div className="aspect-[16/10] bg-muted rounded-lg" />
                          <div className="h-4 bg-muted rounded w-20" />
                          <div className="h-5 bg-muted rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {latest.slice(0, 4).map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            variant="vertical"
                          />
                        ))}
                      </div>

                      {/* Mid-Articles Ad */}
                      <AdSlot position="betweenArticles" className="my-4" />

                      {/* Smart Link - High Click Area */}
                      <div className="my-4 text-center">
                        <AdSlot position="smartLink" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {latest.slice(4, 8).map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            variant="vertical"
                          />
                        ))}
                      </div>
                    </>
                  )}
                </section>
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block lg:col-span-4">
                <div className="sticky top-20">
                  <SidebarRight />
                  {/* Sidebar Tall Ad 160x600 */}
                  <AdSlot position="sidebarTall" className="mt-4" />
                  {/* Mid Section Ad 160x300 */}
                  <AdSlot position="midSection" className="mt-4" />
                </div>
              </div>
            </div>

            {/* Mobile sidebar */}
            <div className="lg:hidden mt-8 space-y-6">
              <Separator />
              <SidebarRight />
            </div>

            {/* Footer Banner Ad */}
            <AdSlot position="footerBanner" className="mt-6" />

            {/* Bottom spacer for scroll */}
            <div className="h-8" />
          </div>
        </div>
      </main>

      {/* Footer - Sticky at Bottom */}
      <Footer />

      {/* Mobile Sticky Ad - shown only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t py-1 px-2">
        <AdSlot position="mobileSticky" />
      </div>

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

      {/* Back to Top */}
      <BackToTop />
    </div>
  )
}
