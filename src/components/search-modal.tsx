'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArticleListItem } from '@/lib/types'
import ArticleCard from '@/components/article-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Loader2 } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModalContent({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      return
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.articles || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const hasQuery = query.trim().length > 0
  const showNoResults = hasQuery && !loading && results.length === 0
  const showResults = results.length > 0
  const showPlaceholder = !hasQuery

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overlay-enter">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 sm:pt-16">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 text-lg rounded-xl border-2 focus:border-primary"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {showNoResults && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No articles found for &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try different keywords or browse categories
              </p>
            </div>
          )}

          {showResults && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              {results.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                />
              ))}
            </div>
          )}

          {showPlaceholder && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Start typing to search articles
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Search by title, category, or content
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null
  // Using key to reset component state when modal opens/closes
  return <SearchModalContent key={Date.now()} onClose={onClose} />
}
