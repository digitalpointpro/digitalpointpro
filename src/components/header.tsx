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
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sun,
  Moon,
  Search,
  Menu,
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
  DollarSign,
  Rocket,
  Megaphone,
  GraduationCap,
  TrendingUp,
  Share2,
  Zap,
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
  { label: 'Health & Lifestyle', icon: Heart, action: 'category', slug: 'health-wellness' },
  { label: 'Business', icon: Briefcase, action: 'category', slug: 'online-business' },
  { label: 'Freelancing', icon: Pen, action: 'category', slug: 'freelancing' },
]

const moreNavItems = [
  { label: 'Cyber Security', icon: Shield, slug: 'cyber-security' },
  { label: 'Smartphone Tips', icon: Smartphone, slug: 'smartphone-tips' },
  { label: 'Remote Jobs', icon: MapPin, slug: 'remote-jobs' },
  { label: 'Personal Finance', icon: DollarSign, slug: 'personal-finance' },
  { label: 'Side Hustles', icon: Rocket, slug: 'side-hustles' },
  { label: 'Digital Marketing', icon: Megaphone, slug: 'digital-marketing' },
  { label: 'Education & Learning', icon: GraduationCap, slug: 'education-learning' },
  { label: 'Future Careers', icon: TrendingUp, slug: 'future-careers' },
  { label: 'Social Media Growth', icon: Share2, slug: 'social-media-growth' },
  { label: 'Productivity', icon: Zap, slug: 'productivity' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { openPage } = useNavigation()
  const openAdmin = () => {
    useNavigation.setState({ overlayType: 'admin', overlayData: null, isOverlayOpen: true })
    window.history.pushState({ overlay: 'admin' }, '', '/admin')
    document.body.style.overflow = 'hidden'
  }
  const [mobileOpen, setMobileOpen] = useState(false)
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
      window.history.pushState({}, '', '/')
      window.location.reload()
    } else if (item.action === 'latest-news') {
      openPage('latest-news')
    } else if (item.action === 'category' && item.slug) {
      openPage('category', item.slug)
    }
    setMobileOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-background'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState({}, '', '/')
              window.location.reload()
            }}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg transition-transform group-hover:scale-105">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-foreground">
                Digital Point
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary leading-none mt-0.5">
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
                className="gap-1.5 text-sm font-medium h-9 px-2.5"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Button>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium h-9 px-2.5">
                  <span className="hidden xl:inline">More</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
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
              className="h-9 w-9"
              onClick={() => {
                const event = new CustomEvent('openSearch')
                window.dispatchEvent(event)
              }}
            >
              <Search className="h-4.5 w-4.5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4.5 w-4.5" />
                ) : (
                  <Moon className="h-4.5 w-4.5" />
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
              title="Admin Panel - Add Articles"
            >
              <PenSquare className="h-4.5 w-4.5" />
              <span className="sr-only">Admin</span>
            </Button>

            {/* Mobile Menu - only on mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <SheetTitle className="text-lg font-bold px-6 pt-6 pb-2">
                    Navigation
                  </SheetTitle>
                  <div className="flex-1 overflow-y-auto px-4 pb-6">
                    {/* Main Sections */}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1">
                        Sections
                      </p>
                      {mainNavItems.map((item) => (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className="w-full justify-start text-sm gap-3 h-10"
                          onClick={() => handleNavClick(item)}
                        >
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    {/* More Categories */}
                    <div className="mt-4 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1">
                        More Categories
                      </p>
                      {moreNavItems.map((item) => (
                        <Button
                          key={item.slug}
                          variant="ghost"
                          className="w-full justify-start text-sm gap-3 h-10"
                          onClick={() => {
                            openPage('category', item.slug)
                            setMobileOpen(false)
                          }}
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    {/* Admin & Legal */}
                    <div className="mt-4 pt-4 border-t space-y-1">
                      <Button
                        variant="default"
                        className="w-full gap-2 bg-primary text-primary-foreground h-10"
                        onClick={() => {
                          openAdmin()
                          setMobileOpen(false)
                        }}
                      >
                        <PenSquare className="h-4 w-4" />
                        Admin - Add Article
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm gap-3 h-10"
                        onClick={() => {
                          openPage('legal')
                          setMobileOpen(false)
                        }}
                      >
                        Legal & About
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
