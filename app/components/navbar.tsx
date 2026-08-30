"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/results", label: "Results" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Portal" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll position for clean header blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-[#0a0c0e]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-3"
            : "bg-[#0a0c0e]/50 backdrop-blur-md border-b border-white/[0.04] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand Name — Logo fits the container perfectly */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-0.5"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="SixBytes Institute Logo"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg sm:text-xl text-cream tracking-tight group-hover:text-orange-400 transition-colors leading-none">
                SixBytes
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-orange-400 mt-1">
                Institute
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Premium & Minimalist, No Neon Bleeds */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-full ${
                    active
                      ? "text-orange-400 font-semibold bg-white/[0.06] border border-white/[0.12]"
                      : "text-muted-custom hover:text-cream hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-muted-custom hover:text-cream px-3.5 py-2 rounded-lg hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
            >
              Portal Login
            </Link>

            <a
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20book%20a%20Free%20Demo%20Class."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange text-xs !py-2.5 !px-5"
            >
              <span>Book Free Demo</span>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
              </svg>
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current rounded transition-all duration-300 origin-left ${
                  menuOpen ? "rotate-45 translate-x-px" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded transition-all duration-300 origin-left ${
                  menuOpen ? "-rotate-45 translate-x-px" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#0f1318] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-base text-cream leading-none">
                      SixBytes
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-orange-400 mt-0.5">
                      Institute
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-1.5 mt-5">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                        active
                          ? "bg-white/[0.08] text-orange-400 font-semibold border border-white/[0.12]"
                          : "text-muted-custom hover:bg-white/[0.04] hover:text-cream"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-5 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/15 text-cream text-xs font-semibold hover:bg-white/[0.05] transition-colors"
              >
                Portal Login (Student / Faculty / Admin)
              </Link>
              <a
                href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20book%20a%20Free%20Demo%20Class."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange w-full text-center text-xs py-2.5"
              >
                Book Free Demo Class
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}