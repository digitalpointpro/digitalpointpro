'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sun,
  Moon,
  Search,
  Home,
  Newspaper,
  Brain,
  Cpu,
  Heart,
  Briefcase,
  Pen,
  ChevronDown,
  PenSquare,
  Shield,
  Smartphone,
  MapPin,
} from 'lucide-react'

const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

const mainNavItems = [
  { label: 'Home', icon: Home, action: 'home' },
  { label: 'Latest News', icon: Newspaper, action: 'latest-news' },
  { label: 'AI', icon: Brain, action: 'category', slug: 'artificial-intelligence' },
  { label: 'Technology', icon: Cpu, action: 'category', slug: 'technology-trends' },
  { label: 'Health', icon: Heart, action: 'category', slug: 'health-lifestyle' },
  { label: 'Business', icon: Briefcase, action: 'category', slug: 'online-business' },
  { label: 'Remote Jobs', icon: MapPin, action: 'category', slug: 'remote-jobs' },
]

const moreNavItems = [
  { label: 'Freelancing', icon: Pen, slug: 'freelancing' },
  { label: 'Cyber Security', icon: Shield, slug: 'cyber-security' },
  { label: 'Smartphone Tips', icon: Smartphone, slug: 'smartphone-tips' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { openPage } = useNavigation()
  const openAdmin = () => {
    useNavigation.setState({ overlayType: 'admin', overlayData: null, isOverlayOpen: true })
    window.history.pushState({ overlay: 'admin' }, '', '/admin')
    document.body.style.overflow = 'hidden'
  }
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mounted = useMounted()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (item: typeof mainNavItems[number]) => {
    if (item.action === 'home') {
      window.history.pushState({}, '', '/')
      window.location.reload()
    } else if (item.action === 'latest-news') {
      openPage('latest-news')
    } else if (item.action === 'category' && item.slug) {
      openPage('category', item.slug)
    }
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState({}, '', '/')
              window.location.reload()
            }}
            className="flex items-center gap-2.5 group shrink-0"
          >
            {/* Professional D Logo */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <span className="text-primary-foreground font-black text-lg leading-none tracking-tighter">D</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight leading-none text-foreground">
                Digital Point
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-primary leading-none mt-0.5">
                Pro
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {mainNavItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item)}
                className="gap-1.5 text-sm font-medium h-8 px-2.5 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{item.label}</span>
              </Button>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium h-8 px-2.5 hover:bg-primary/5 hover:text-primary">
                  <span className="hidden xl:inline">More</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-52">
                {moreNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.slug}
                    onClick={() => openPage('category', item.slug)}
                    className="cursor-pointer gap-2"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/5 hover:text-primary"
              onClick={() => {
                const event = new CustomEvent('openSearch')
                window.dispatchEvent(event)
              }}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/5 hover:text-primary"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Admin Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:bg-primary/10"
              onClick={openAdmin}
              title="Admin Panel"
            >
              <PenSquare className="h-4 w-4" />
              <span className="sr-only">Admin</span>
            </Button>

            {/* Mobile Navigation - Simple scrollable nav instead of hamburger */}
            <nav className="flex lg:hidden items-center gap-0.5 ml-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/5 hover:text-primary"
                onClick={() => {
                  const event = new CustomEvent('openSearch')
                  window.dispatchEvent(event)
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Bar - scrollable pills instead of hamburger */}
        <div className="lg:hidden -mx-4 px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(mainNavItems[0])}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Home className="h-3 w-3" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('latest-news')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Newspaper className="h-3 w-3" />
              News
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'artificial-intelligence')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Brain className="h-3 w-3" />
              AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'technology-trends')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Cpu className="h-3 w-3" />
              Tech
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'health-lifestyle')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Heart className="h-3 w-3" />
              Health
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'online-business')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Briefcase className="h-3 w-3" />
              Business
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'remote-jobs')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <MapPin className="h-3 w-3" />
              Remote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'freelancing')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Pen className="h-3 w-3" />
              Freelance
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'cyber-security')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Shield className="h-3 w-3" />
              Security
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openPage('category', 'smartphone-tips')}
              className="gap-1 text-xs font-medium h-7 px-2 shrink-0 hover:bg-primary/5 hover:text-primary"
            >
              <Smartphone className="h-3 w-3" />
              Phone
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
