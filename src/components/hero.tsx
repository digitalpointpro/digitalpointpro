'use client'

import React, { useState, useEffect } from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem, Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  TrendingUp,
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

  const next = () => setCurrent(prev => (prev + 1) % Math.max(featured.length, 1))
  const prev = () => setCurrent(prev => (prev - 1 + Math.max(featured.length, 1)) % Math.max(featured.length, 1))

  useEffect(() => {
    if (featured.length === 0) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [featured.length])

  if (featured.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Welcome to{' '}
              <span className="text-primary">Digital Point Pro</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Your premier destination for expert insights in technology, business,
              finance, and personal development. Stay ahead of the curve.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const article = featured[current]

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <Badge variant="secondary" className="mb-4 text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{article.author}</span>
              <span>·</span>
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => openArticle(article.slug)} className="gap-2">
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => openPage('category', article.categorySlug || '')}
              >
                {article.category}
              </Button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <div
              className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg cursor-pointer card-hover"
              onClick={() => openArticle(article.slug)}
            >
              <img
                src={article.featuredImage || '/placeholder.jpg'}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        {featured.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
