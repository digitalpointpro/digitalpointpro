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
  { label: 'Home', icon: Home, action: 'home', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
  { label: 'Latest News', icon: Newspaper, action: 'latest-news', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
  { label: 'AI', icon: Brain, action: 'category', slug: 'artificial-intelligence', color: 'bg-gradient-to-r from-violet-500 to-purple-500' },
  { label: 'Technology', icon: Cpu, action: 'category', slug: 'technology-trends', color: 'bg-gradient-to-r from-cyan-500 to-teal-500' },
  { label: 'Health', icon: Heart, action: 'category', slug: 'health-lifestyle', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  { label: 'Business', icon: Briefcase, action: 'category', slug: 'online-business', color: 'bg-gradient-to-r from-emerald-500 to-green-500' },
  { label: 'Remote Jobs', icon: MapPin, action: 'category', slug: 'remote-jobs', color: 'bg-gradient-to-r from-sky-500 to-blue-500' },
]

const moreNavItems = [
  { label: 'Freelancing', icon: Pen, slug: 'freelancing', color: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
  { label: 'Cyber Security', icon: Shield, slug: 'cyber-security', color: 'bg-gradient-to-r from-red-600 to-rose-600' },
  { label: 'Smartphone Tips', icon: Smartphone, slug: 'smartphone-tips', color: 'bg-gradient-to-r from-fuchsia-500 to-pink-500' },
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
      useNavigation.getState().closeOverlay()
    } else if (item.action === 'latest-news') {
      openPage('latest-news')
    } else if (item.action === 'category' && item.slug) {
      openPage('category', item.slug)
    }
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
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo - BIGGER and more colorful */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              useNavigation.getState().closeOverlay()
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            {/* Professional D Logo - BIGGER */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-2xl leading-none tracking-tighter">D</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/25 to-transparent" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 opacity-30 blur-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Digital Point
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
                PRO
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation - Colorful pill buttons */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="group flex items-center gap-1.5 text-sm font-medium h-8 px-3 rounded-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-md ${item.color} shadow-sm transition-transform group-hover:scale-110`}>
                  <item.icon className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1 text-sm font-medium h-8 px-3 rounded-full transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-r from-slate-500 to-slate-600 shadow-sm">
                    <ChevronDown className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="hidden xl:inline">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-52">
                {moreNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.slug}
                    onClick={() => openPage('category', item.slug)}
                    className="cursor-pointer gap-2"
                  >
                    <span className={`inline-flex items-center justify-center h-5 w-5 rounded ${item.color}`}>
                      <item.icon className="h-3 w-3 text-white" />
                    </span>
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
              className="h-9 w-9 hover:bg-primary/5 hover:text-primary"
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
                className="h-9 w-9 hover:bg-primary/5 hover:text-primary"
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
              className="h-9 w-9 text-primary hover:bg-primary/10"
              onClick={openAdmin}
              title="Admin Panel"
            >
              <PenSquare className="h-4 w-4" />
              <span className="sr-only">Admin</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Bar - Colorful pills */}
        <div className="lg:hidden -mx-4 px-4 pb-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {mainNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="group flex items-center gap-1 text-xs font-medium h-8 px-2.5 shrink-0 rounded-full transition-all hover:shadow-sm"
              >
                <span className={`inline-flex items-center justify-center h-5 w-5 rounded ${item.color}`}>
                  <item.icon className="h-3 w-3 text-white" />
                </span>
                <span>{item.label === 'Latest News' ? 'News' : item.label}</span>
              </button>
            ))}
            {moreNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => openPage('category', item.slug)}
                className="group flex items-center gap-1 text-xs font-medium h-8 px-2.5 shrink-0 rounded-full transition-all hover:shadow-sm"
              >
                <span className={`inline-flex items-center justify-center h-5 w-5 rounded ${item.color}`}>
                  <item.icon className="h-3 w-3 text-white" />
                </span>
                <span>{item.label === 'Smartphone Tips' ? 'Phone' : item.label === 'Cyber Security' ? 'Security' : 'Freelance'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
