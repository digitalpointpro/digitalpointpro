'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react'

export default function Hero() {
  const { openArticle, openPage } = useNavigation()
  const [featured, setFeatured] = useState<ArticleListItem[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/api/articles?featured=true&limit=5')
      .then(res => res.json())
      .then(data => setFeatured(data.articles || []))
      .catch(() => {})
  }, [])

  // Also get trending articles for the ticker
  const [trending, setTrending] = useState<ArticleListItem[]>([])
  useEffect(() => {
    fetch('/api/articles?trending=true&limit=5')
      .then(res => res.json())
      .then(data => setTrending(data.articles || []))
      .catch(() => {})
  }, [])

  const next = () => setCurrent(prev => (prev + 1) % Math.max(featured.length, 1))
  const prev = () => setCurrent(prev => (prev - 1 + Math.max(featured.length, 1)) % Math.max(featured.length, 1))

  useEffect(() => {
    if (featured.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [featured.length])

  // If no featured articles, show a branded hero
  if (featured.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 border">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-xl shadow-primary/20 mb-6 mx-auto">
            <span className="text-primary-foreground font-black text-2xl leading-none">D</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Digital Point Pro
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Your premier destination for breaking news, expert tech insights, health tips,
            business strategies, and career guidance. Stay ahead of the curve.
          </p>
        </div>
      </section>
    )
  }

  const article = featured[current]

  return (
    <section className="relative overflow-hidden rounded-2xl border">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        <img
          src={article.featuredImage || '/placeholder.jpg'}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 dark:from-black/90 dark:via-black/70 dark:to-black/40" />
      </div>

      {/* Content */}
      <div className="relative mx-auto px-6 sm:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center min-h-[280px] sm:min-h-[340px]">
          {/* Left: Text */}
          <div>
            <Badge className="mb-3 bg-primary/90 text-primary-foreground border-0 text-[10px] font-semibold shadow-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3 leading-tight line-clamp-3">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 mb-5 text-xs text-white/60">
              <span className="font-medium text-white/90">{article.author}</span>
              <span>·</span>
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime} min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => openArticle(article.slug)} className="gap-1.5 bg-white text-black hover:bg-white/90 shadow-lg h-9 text-sm">
                Read Article
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openPage('category', article.categorySlug || '')}
                className="border-white/30 text-white hover:bg-white/10 h-9 text-sm"
              >
                {article.category}
              </Button>
            </div>
          </div>

          {/* Right: Carousel indicators */}
          <div className="hidden lg:flex items-end justify-end h-full">
            <div className="flex items-center gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'w-8 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Carousel nav + Trending ticker */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Carousel nav (mobile) */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Trending ticker */}
          {trending.length > 0 && (
            <div className="flex items-center gap-2 text-xs overflow-hidden flex-1 sm:justify-end">
              <Zap className="h-3 w-3 text-yellow-400 shrink-0" />
              <span className="text-white/50 font-medium shrink-0">TRENDING:</span>
              <div className="overflow-hidden relative">
                <div className="animate-ticker whitespace-nowrap">
                  {trending.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => openArticle(t.slug)}
                      className="text-white/80 hover:text-white transition-colors mr-6"
                    >
                      {t.title}
                      {i < trending.length - 1 && ' · '}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
