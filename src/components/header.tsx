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
import { Category } from '@/lib/types'
import {
  Sun,
  Moon,
  Search,
  Menu,
  ChevronDown,
  TrendingUp,
  PenSquare,
} from 'lucide-react'

const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { openPage } = useNavigation()
  const openAdmin = () => {
    window.history.pushState({ overlay: 'admin' }, '', '/admin')
    useNavigation.getState().overlayType = 'admin'
    useNavigation.getState().overlayData = null
    useNavigation.getState().isOverlayOpen = true
    document.body.style.overflow = 'hidden'
    useNavigation.setState({ overlayType: 'admin', overlayData: null, isOverlayOpen: true })
  }
  const [categories, setCategories] = useState<Category[]>([])
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

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  const navLinks = [
    { label: 'About', action: () => openPage('about') },
    { label: 'Privacy Policy', action: () => openPage('privacy') },
    { label: 'Terms', action: () => openPage('terms') },
    { label: 'Disclaimer', action: () => openPage('disclaimer') },
    { label: 'Contact', action: () => openPage('contact') },
  ]

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
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.history.pushState({}, '', '/')
              window.location.reload()
            }}
            className="flex items-center gap-2 group"
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium">
                  Categories
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => openPage('category', cat.slug)}
                    className="cursor-pointer"
                  >
                    <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                    <span>{cat.name}</span>
                    {cat._count && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {cat._count.articles}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                onClick={link.action}
                className="text-sm font-medium"
              >
                {link.label}
              </Button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
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

            {/* Theme Toggle */}
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

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <SheetTitle className="text-lg font-bold mb-6">
                  Digital Point Pro
                </SheetTitle>
                <div className="flex flex-col gap-2">
                  {categories.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
                        Categories
                      </p>
                      {categories.map((cat) => (
                        <Button
                          key={cat.id}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            openPage('category', cat.slug)
                            setMobileOpen(false)
                          }}
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="border-t pt-2 mt-1">
                    <Button
                      variant="default"
                      className="w-full mb-3 gap-2 bg-primary text-primary-foreground"
                      onClick={() => {
                        openAdmin()
                        setMobileOpen(false)
                      }}
                    >
                      <PenSquare className="h-4 w-4" />
                      Admin - Add Article
                    </Button>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
                      Pages
                    </p>
                    {navLinks.map((link) => (
                      <Button
                        key={link.label}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          link.action()
                          setMobileOpen(false)
                        }}
                      >
                        {link.label}
                      </Button>
                    ))}
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
