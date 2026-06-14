'use client'

import React from 'react'
import { useNavigation } from '@/lib/store'
import { ArticleListItem } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowRight } from 'lucide-react'

type CardVariant = 'horizontal' | 'vertical' | 'compact' | 'featured'

interface ArticleCardProps {
  article: ArticleListItem
  variant?: CardVariant
}

export default function ArticleCard({ article, variant = 'vertical' }: ArticleCardProps) {
  const { openArticle } = useNavigation()

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (variant === 'horizontal') {
    return (
      <article
        className="group flex gap-4 sm:gap-6 cursor-pointer card-hover rounded-lg p-2 -m-2"
        onClick={() => openArticle(article.slug)}
      >
        <div className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-lg overflow-hidden">
          <img
            src={article.featuredImage || '/placeholder.jpg'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-medium">
              {article.category}
            </Badge>
            {article.trending && (
              <Badge className="text-[10px] px-2 py-0 h-5 bg-primary/10 text-primary hover:bg-primary/15 border-0 font-medium">
                Trending
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-sm sm:text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>·</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}m
            </span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article
        className="group flex items-start gap-3 cursor-pointer py-3"
        onClick={() => openArticle(article.slug)}
      >
        <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden">
          <img
            src={article.featuredImage || '/placeholder.jpg'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{formatDate(article.createdAt)}</span>
            <span>·</span>
            <span>{article.readTime}m</span>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'featured') {
    return (
      <article
        className="group relative cursor-pointer rounded-xl overflow-hidden card-hover"
        onClick={() => openArticle(article.slug)}
      >
        <div className="aspect-[16/9]">
          <img
            src={article.featuredImage || '/placeholder.jpg'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge variant="secondary" className="text-[10px] mb-3 font-medium bg-white/20 text-white border-0 backdrop-blur-sm">
            {article.category}
          </Badge>
          <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-white/80 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-white/70">
            <span>{article.author}</span>
            <span>·</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </article>
    )
  }

  // Default: vertical card
  return (
    <article
      className="group cursor-pointer rounded-lg border bg-card overflow-hidden card-hover"
      onClick={() => openArticle(article.slug)}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={article.featuredImage || '/placeholder.jpg'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-medium">
            {article.category}
          </Badge>
          {article.editorsPick && (
            <Badge className="text-[10px] px-2 py-0 h-5 bg-primary/10 text-primary hover:bg-primary/15 border-0 font-medium">
              Editor&apos;s Pick
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{article.author}</span>
            <span>·</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime}m
          </span>
        </div>
      </div>
    </article>
  )
}
