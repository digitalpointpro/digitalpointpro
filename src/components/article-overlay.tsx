'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigation } from '@/lib/store'
import { Article, ArticleListItem, FAQ } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import ReadingProgress from '@/components/reading-progress'
import Newsletter from '@/components/newsletter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import AdSlot from '@/components/ad-slot'
import {
  X,
  Clock,
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  List,
  Home,
  Newspaper,
  Brain,
  Cpu,
  Heart,
  Briefcase,
  Pen,
  Shield,
  Smartphone,
  MapPin,
} from 'lucide-react'

// Component that splits article content and inserts ads between paragraphs
function ArticleBodyWithAds({ content }: { content: string }) {
  // Split content at H2 headings to insert ads between sections
  const sections = content.split(/(?=^## )/m)

  return (
    <div id="article-body-content" className="article-body">
      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section}</ReactMarkdown>
          {/* Insert ad after every 2nd section (roughly every 2 H2 headings) */}
          {(idx > 0 && idx % 2 === 0 && idx < sections.length - 1) && (
            <div className="my-6">
              <AdSlot position="inArticle" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

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

export default function ArticleOverlay() {
  const { overlayData, goBack, openPage, closeOverlay, previousOverlayType, previousOverlayData } = useNavigation()
  const [article, setArticle] = useState<Article | null>(null)
  const [related, setRelated] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)
  const fetchedSlug = useRef<string | null>(null)

  useEffect(() => {
    if (!overlayData) return
    if (fetchedSlug.current === overlayData) return
    fetchedSlug.current = overlayData

    let cancelled = false
    fetch(`/api/articles/${overlayData}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return
        setArticle(data.article || null)
        setRelated(data.related || [])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [overlayData])

  const articleContent = article?.content ?? ''
  const headings = useMemo(() => {
    if (!articleContent) return []
    const lines = articleContent.split('\n')
    const result: { id: string; text: string; level: number }[] = []
    let idx = 0
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/)
      if (match) {
        result.push({
          id: `heading-${idx}`,
          text: match[2].replace(/\*\*/g, '').replace(/`/g, ''),
          level: match[1].length,
        })
        idx++
      }
    }
    return result
  }, [articleContent])

  useEffect(() => {
    if (!article?.content) return
    const timer = setTimeout(() => {
      const contentEl = document.getElementById('article-body-content')
      if (!contentEl) return
      const hElements = contentEl.querySelectorAll('h2, h3')
      hElements.forEach((el, idx) => {
        el.id = `heading-${idx}`
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [article?.content])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = article?.title || ''

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const faqs: FAQ[] = article?.faq ? (() => {
    try {
      return JSON.parse(article.faq)
    } catch {
      return []
    }
  })() : []

  const handleNavClick = (cat: typeof navCategories[number]) => {
    if (cat.action === 'home') {
      closeOverlay()
    } else if (cat.action === 'latest-news') {
      openPage('latest-news')
    } else if (cat.action === 'category' && cat.slug) {
      openPage('category', cat.slug)
    }
  }

  // Determine which category is active
  const activeCategorySlug = article?.categorySlug || ''

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-4 w-full max-w-3xl px-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-64 bg-muted rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="fixed inset-0 z-50 bg-background overlay-enter">
      <ReadingProgress />

      {/* Top Navigation Bar with all categories */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        {/* Main nav row with back arrow + breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          <div className="flex items-center gap-2 text-sm">
            {/* Back Arrow Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="gap-1.5 h-7 px-2 text-primary hover:bg-primary/10 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-[300px]">
              {article.title}
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
              const isActive = cat.slug === activeCategorySlug || (cat.action === 'latest-news' && activeCategorySlug === 'latest-news')
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

      {/* Scrollable content */}
      <div
        id="article-overlay-content"
        className="overflow-y-auto"
        style={{ height: 'calc(100vh - 88px)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Banner Ad in Article */}
          <AdSlot position="headerBanner" className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Featured Image */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <img
                  src={article.featuredImage || '/placeholder.jpg'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Meta */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="font-medium">{article.category}</Badge>
                  {article.trending && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      Trending
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{article.author}</span>
                  </div>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(article.createdAt)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime} min read
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Table of Contents (mobile: collapsed) */}
              {headings.length > 0 && (
                <div className="mb-8 rounded-lg border bg-muted/30 p-4 lg:hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <List className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Table of Contents</h3>
                  </div>
                  <nav className="space-y-1">
                    {headings.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => scrollToHeading(h.id)}
                        className={`block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full ${
                          h.level === 3 ? 'pl-4' : ''
                        }`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Article Body with In-Article Ads */}
              <ArticleBodyWithAds content={article.content || ''} />

              {/* Social Sharing */}
              <Separator className="my-8" />
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <Share2 className="h-4 w-4" />
                  Share this article:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" asChild>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-3.5 w-3.5" />
                      Facebook
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" asChild>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-3.5 w-3.5" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" asChild>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" asChild>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger className="text-sm font-medium text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((relArticle) => (
                      <ArticleCard
                        key={relArticle.id}
                        article={relArticle}
                        variant="vertical"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-20 space-y-6">
                {/* Table of Contents (desktop) */}
                {headings.length > 0 && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <List className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm">Table of Contents</h3>
                    </div>
                    <nav className="space-y-1.5 max-h-64 overflow-y-auto">
                      {headings.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => scrollToHeading(h.id)}
                          className={`block text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full ${
                            h.level === 3 ? 'pl-4' : ''
                          }`}
                        >
                          {h.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                <Newsletter />

                {/* Sidebar Ad */}
                <AdSlot position="sidebar" />

                {/* Recommended Reads */}
                {related.length > 0 && (
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="font-semibold text-sm mb-3">Recommended Reads</h3>
                    <div className="space-y-1">
                      {related.map((relArticle) => (
                        <ArticleCard
                          key={relArticle.id}
                          article={relArticle}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
