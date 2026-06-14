'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation } from '@/lib/store'
import { Category } from '@/lib/types'
import { X, Plus, Sparkles, Loader2, FileText, ImagePlus, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface FAQItem {
  question: string
  answer: string
}

export default function AdminOverlay() {
  const { closeOverlay } = useNavigation()
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showFaq, setShowFaq] = useState(false)

  // Manual form state
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    categorySlug: '',
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    author: 'Digital Point Pro Team',
    trending: false,
    featured: false,
    editorsPick: false,
  })

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>([{ question: '', answer: '' }])

  // AI generation form state
  const [aiForm, setAiForm] = useState({
    topic: '',
    category: '',
    focusKeyword: '',
  })

  // Generated article preview
  const [generatedArticle, setGeneratedArticle] = useState<{
    title: string
    content: string
    excerpt: string
    faq: FAQItem[]
  } | null>(null)

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || data || []))
      .catch(() => {})
  }, [])

  const handleFormChange = useCallback((field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFaqChange = useCallback((index: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const addFaq = useCallback(() => {
    setFaqs(prev => [...prev, { question: '', answer: '' }])
  }, [])

  const removeFaq = useCallback((index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Generate image for article
  const generateImage = useCallback(async (title: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Professional featured image for blog article: ${title}. High quality, modern, clean design, vibrant colors, 4K resolution`, width: 1344, height: 768 }),
      })
      const data = await response.json()
      if (data.url) return data.url
    } catch {
      // fallback
    }
    return '/images/placeholder.jpg'
  }, [])

  // Submit manual article
  const handleSubmitManual = useCallback(async () => {
    if (!form.title || !form.content || !form.category) {
      setErrorMsg('Title, content, and category are required!')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // Generate featured image
      let imageUrl = form.featuredImage
      if (!imageUrl) {
        setSuccessMsg('Generating HD featured image...')
        imageUrl = await generateImage(form.title)
      }

      const validFaqs = faqs.filter(f => f.question && f.answer)

      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          featuredImage: imageUrl,
          faq: JSON.stringify(validFaqs),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMsg('✅ Article published successfully!')
        // Reset form
        setForm({
          title: '',
          content: '',
          excerpt: '',
          category: '',
          categorySlug: '',
          focusKeyword: '',
          metaTitle: '',
          metaDescription: '',
          featuredImage: '',
          author: 'Digital Point Pro Team',
          trending: false,
          featured: false,
          editorsPick: false,
        })
        setFaqs([{ question: '', answer: '' }])
        setTimeout(() => setSuccessMsg(''), 5000)
      } else {
        setErrorMsg(data.error || 'Failed to create article')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [form, faqs, generateImage])

  // Generate article with AI
  const handleAIGenerate = useCallback(async () => {
    if (!aiForm.topic || !aiForm.category) {
      setErrorMsg('Topic and category are required for AI generation!')
      return
    }

    setIsGeneratingAI(true)
    setErrorMsg('')
    setSuccessMsg('')
    setGeneratedArticle(null)

    try {
      const response = await fetch('/api/ai-generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedArticle({
          title: data.article.title,
          content: data.article.content,
          excerpt: data.article.excerpt,
          faq: data.article.faqs || [],
        })
        setSuccessMsg('✅ Article generated! Review and publish below.')
      } else {
        setErrorMsg(data.error || 'AI generation failed')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsGeneratingAI(false)
    }
  }, [aiForm])

  // Publish AI-generated article
  const handlePublishAI = useCallback(async () => {
    if (!generatedArticle) return

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      setSuccessMsg('Generating HD featured image...')
      const imageUrl = await generateImage(generatedArticle.title)

      const catSlug = aiForm.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      const response = await fetch('/api/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedArticle.title,
          content: generatedArticle.content,
          excerpt: generatedArticle.excerpt,
          category: aiForm.category,
          categorySlug: catSlug,
          focusKeyword: aiForm.focusKeyword || generatedArticle.title.split(' ').slice(0, 5).join(' '),
          featuredImage: imageUrl,
          faq: JSON.stringify(generatedArticle.faq),
          trending: false,
          featured: false,
          editorsPick: false,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMsg('✅ AI Article published successfully!')
        setGeneratedArticle(null)
        setAiForm({ topic: '', category: '', focusKeyword: '' })
        setTimeout(() => setSuccessMsg(''), 5000)
      } else {
        setErrorMsg(data.error || 'Failed to publish')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [generatedArticle, aiForm, generateImage])

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-t-2xl p-4 sm:p-6 text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Admin Panel</h1>
                  <p className="text-emerald-100 text-sm">Create & Publish Articles</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeOverlay}
                className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'manual'
                    ? 'bg-white text-emerald-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Write Manual
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'ai'
                    ? 'bg-white text-emerald-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Sparkles className="h-4 w-4 inline mr-1" />
                AI Generate
              </button>
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-b-2xl shadow-2xl border border-t-0">
            {activeTab === 'manual' ? (
              /* ===== MANUAL ARTICLE FORM ===== */
              <div className="p-4 sm:p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Best AI Tools for Content Creators in 2026"
                    value={form.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="text-lg py-3 border-2 focus:border-emerald-500"
                  />
                </div>

                {/* Category + Author Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => {
                        const cat = categories.find(c => c.name === e.target.value)
                        handleFormChange('category', e.target.value)
                        handleFormChange('categorySlug', cat?.slug || '')
                      }}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-base focus:border-emerald-500 focus:outline-none focus:ring-0"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                      <option value="__new__">+ New Category...</option>
                    </select>
                    {form.category === '__new__' && (
                      <Input
                        placeholder="Enter new category name"
                        onChange={(e) => {
                          handleFormChange('category', e.target.value)
                          handleFormChange('categorySlug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                        }}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-base font-semibold">Author</Label>
                    <Input
                      id="author"
                      value={form.author}
                      onChange={(e) => handleFormChange('author', e.target.value)}
                      className="py-3"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-base font-semibold">Article Content * <span className="text-muted-foreground font-normal">(Markdown supported)</span></Label>
                  <Textarea
                    id="content"
                    placeholder={`Write your article here...\n\n## Introduction\nYour introduction paragraph...\n\n## Main Section\nYour content...\n\n## Conclusion\nYour conclusion...\n\n## Frequently Asked Questions\n**Q: Your question?**\n**A: Your answer**`}
                    value={form.content}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    className="min-h-[400px] text-base leading-relaxed font-serif border-2 focus:border-emerald-500"
                  />
                  <p className="text-sm text-muted-foreground">
                    {form.content.split(/\s+/).filter(Boolean).length} words • ~{Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min read
                  </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt" className="text-base font-semibold">Excerpt <span className="text-muted-foreground font-normal">(auto-generated if empty)</span></Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article (max 200 characters)"
                    value={form.excerpt}
                    onChange={(e) => handleFormChange('excerpt', e.target.value)}
                    className="min-h-[80px] border-2 focus:border-emerald-500"
                    maxLength={200}
                  />
                </div>

                {/* FAQ Section */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 space-y-3">
                  <button
                    onClick={() => setShowFaq(!showFaq)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <Label className="text-base font-semibold cursor-pointer">FAQ Section (Optional)</Label>
                    {showFaq ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  {showFaq && (
                    <div className="space-y-4 pt-2">
                      {faqs.map((faq, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2 relative">
                          {faqs.length > 1 && (
                            <button
                              onClick={() => removeFaq(index)}
                              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <Input
                            placeholder="Question"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                          <Textarea
                            placeholder="Answer"
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                            className="min-h-[60px] border-emerald-200 focus:border-emerald-500"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFaq}
                        className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add FAQ
                      </Button>
                    </div>
                  )}
                </div>

                {/* SEO Section */}
                <details className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <summary className="p-4 cursor-pointer font-semibold text-base hover:bg-gray-50 transition-colors">
                    🔍 SEO Settings (Optional)
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label>Focus Keyword</Label>
                      <Input
                        placeholder="e.g., best AI tools 2026"
                        value={form.focusKeyword}
                        onChange={(e) => handleFormChange('focusKeyword', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Title</Label>
                      <Input
                        placeholder="SEO title (auto-generated if empty)"
                        value={form.metaTitle}
                        onChange={(e) => handleFormChange('metaTitle', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Description</Label>
                      <Textarea
                        placeholder="SEO description (auto-generated if empty)"
                        value={form.metaDescription}
                        onChange={(e) => handleFormChange('metaDescription', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image URL</Label>
                      <Input
                        placeholder="Leave empty for AI-generated image"
                        value={form.featuredImage}
                        onChange={(e) => handleFormChange('featuredImage', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Leave empty and an HD image will be auto-generated for your article</p>
                    </div>
                  </div>
                </details>

                {/* Article Flags */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.trending}
                      onCheckedChange={(checked) => handleFormChange('trending', checked)}
                    />
                    <Label>Trending 🔥</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.featured}
                      onCheckedChange={(checked) => handleFormChange('featured', checked)}
                    />
                    <Label>Featured ⭐</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.editorsPick}
                      onCheckedChange={(checked) => handleFormChange('editorsPick', checked)}
                    />
                    <Label>Editor&apos;s Pick 🏆</Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitManual}
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Publishing Article...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Publish Article
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* ===== AI GENERATE TAB ===== */
              <div className="p-4 sm:p-6 space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-purple-900">AI Article Generator</h3>
                      <p className="text-sm text-purple-700 mt-1">
                        Just enter a topic and category. AI will write a complete SEO-optimized article (1000-1500 words) with FAQ section, then auto-generate an HD featured image!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Article Topic *</Label>
                    <Input
                      placeholder="e.g., How to use ChatGPT for business growth"
                      value={aiForm.topic}
                      onChange={(e) => setAiForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="text-lg py-3 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Category *</Label>
                    <select
                      value={aiForm.category}
                      onChange={(e) => setAiForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 text-base focus:border-purple-500 focus:outline-none focus:ring-0"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Focus Keyword <span className="text-muted-foreground font-normal">(optional)</span></Label>
                    <Input
                      placeholder="e.g., ChatGPT business"
                      value={aiForm.focusKeyword}
                      onChange={(e) => setAiForm(prev => ({ ...prev, focusKeyword: e.target.value }))}
                      className="py-3 border-2 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                  size="lg"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      AI is writing your article...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Article with AI
                    </>
                  )}
                </Button>

                {/* Generated Article Preview */}
                {generatedArticle && (
                  <div className="border-2 border-purple-200 rounded-xl overflow-hidden">
                    <div className="bg-purple-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-purple-600" />
                          <span className="font-bold text-purple-900">Article Generated Successfully!</span>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          {generatedArticle.content.split(/\s+/).length} words
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold mt-2 text-purple-900">{generatedArticle.title}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-serif">
                          {generatedArticle.content.substring(0, 1500)}...
                        </div>
                      </div>
                      {generatedArticle.faq.length > 0 && (
                        <div>
                          <p className="font-semibold text-sm text-muted-foreground">FAQ Items: {generatedArticle.faq.length}</p>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          onClick={handlePublishAI}
                          disabled={isSubmitting}
                          className="flex-1 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <ImagePlus className="h-4 w-4 mr-2" />
                              Publish with HD Image
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setGeneratedArticle(null)}
                          disabled={isSubmitting}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Quick Tips */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-2">💡 Tips for Best Results</h4>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc pl-4">
                    <li>Be specific with your topic for better AI articles</li>
                    <li>Include numbers or &quot;How to&quot; in topics for engaging titles</li>
                    <li>HD images are auto-generated for every article</li>
                    <li>AI articles include SEO meta tags and FAQ sections</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
