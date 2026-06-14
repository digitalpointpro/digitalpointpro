'use client'

import React from 'react'
import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowRight,
  Brain,
  Cpu,
  Heart,
  Briefcase,
  Pen,
  Newspaper,
} from 'lucide-react'

export default function Footer() {
  const { openPage } = useNavigation()

  const sectionLinks = [
    { label: 'AI', icon: Brain, slug: 'artificial-intelligence' },
    { label: 'Technology', icon: Cpu, slug: 'technology-trends' },
    { label: 'Health', icon: Heart, slug: 'health-wellness' },
    { label: 'Business', icon: Briefcase, slug: 'online-business' },
    { label: 'Freelancing', icon: Pen, slug: 'freelancing' },
    { label: 'Latest News', icon: Newspaper, action: 'latest-news' as const },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight leading-none">
                  Digital Point
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary leading-none mt-0.5">
                  Pro
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              Your premier destination for expert insights in technology, business,
              finance, and personal development.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Section Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Sections</h3>
            <ul className="space-y-2">
              {sectionLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.action === 'latest-news') {
                        openPage('latest-news')
                      } else if (link.slug) {
                        openPage('category', link.slug)
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal & About</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => openPage('legal')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Legal & About
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get the latest articles delivered to your inbox weekly.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <Input
                type="email"
                placeholder="Your email"
                className="h-9 text-sm"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Digital Point Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button onClick={() => openPage('legal', 'privacy')} className="hover:text-primary transition-colors">
              Privacy
            </button>
            <button onClick={() => openPage('legal', 'terms')} className="hover:text-primary transition-colors">
              Terms
            </button>
            <button onClick={() => openPage('legal', 'disclaimer')} className="hover:text-primary transition-colors">
              Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
