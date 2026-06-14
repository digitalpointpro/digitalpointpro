'use client'

import React from 'react'
import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
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
  Shield,
  Smartphone,
  MapPin,
} from 'lucide-react'

export default function Footer() {
  const { openPage } = useNavigation()

  const sectionLinks = [
    { label: 'Latest News', icon: Newspaper, action: 'latest-news' as const, slug: '' },
    { label: 'AI', icon: Brain, slug: 'artificial-intelligence', action: '' as const },
    { label: 'Technology', icon: Cpu, slug: 'technology-trends', action: '' as const },
    { label: 'Health', icon: Heart, slug: 'health-lifestyle', action: '' as const },
    { label: 'Business', icon: Briefcase, slug: 'online-business', action: '' as const },
    { label: 'Remote Jobs', icon: MapPin, slug: 'remote-jobs', action: '' as const },
    { label: 'Freelancing', icon: Pen, slug: 'freelancing', action: '' as const },
    { label: 'Cyber Security', icon: Shield, slug: 'cyber-security', action: '' as const },
    { label: 'Smartphone', icon: Smartphone, slug: 'smartphone-tips', action: '' as const },
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="mt-auto border-t bg-muted/30 shrink-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer - Compact */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-sm">
                <span className="text-primary-foreground font-black text-sm leading-none">D</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/20 to-transparent" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight leading-none">
                  Digital Point
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-primary leading-none mt-0.5">
                  Pro
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-xs">
              Your premier destination for expert insights in technology, business, health, and global news.
            </p>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Sections Quick Links */}
          <div>
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Sections</h3>
            <ul className="space-y-1">
              {sectionLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.action === 'latest-news') {
                        openPage('latest-news')
                      } else if (link.slug) {
                        openPage('category', link.slug)
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <link.icon className="h-3 w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Sections */}
          <div>
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">More</h3>
            <ul className="space-y-1">
              {sectionLinks.slice(5).map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.slug) {
                        openPage('category', link.slug)
                      }
                    }}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <link.icon className="h-3 w-3" />
                    {link.label}
                  </button>
                </li>
              ))}
              {/* Combined Legal & About link */}
              <li>
                <button
                  onClick={() => openPage('legal')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  About & Legal
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Newsletter</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Get the latest articles delivered weekly.
            </p>
            <form
              className="flex gap-1.5"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <Input
                type="email"
                placeholder="Your email"
                className="h-8 text-xs"
              />
              <Button type="submit" size="sm" className="h-8 shrink-0 px-3">
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Digital Point Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <button onClick={() => openPage('legal', 'privacy')} className="hover:text-primary transition-colors">
              Privacy
            </button>
            <button onClick={() => openPage('legal', 'terms')} className="hover:text-primary transition-colors">
              Terms
            </button>
            <button onClick={() => openPage('legal', 'disclaimer')} className="hover:text-primary transition-colors">
              Disclaimer
            </button>
            <button onClick={() => openPage('legal', 'about')} className="hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => openPage('legal', 'contact')} className="hover:text-primary transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
