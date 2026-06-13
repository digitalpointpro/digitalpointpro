'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Newsletter</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Get the latest articles delivered to your inbox weekly. No spam, unsubscribe anytime.
      </p>
      {submitted ? (
        <div className="flex items-center gap-2 text-sm text-primary">
          <CheckCircle className="h-4 w-4" />
          <span>Subscribed successfully!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-9 text-sm"
          />
          <Button type="submit" size="sm" className="h-9 shrink-0">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
