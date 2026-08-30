"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  IconDashboard,
  IconUsers,
  IconBookOpen,
  IconSettings,
  IconClipboard,
  IconFolder,
  IconBell,
  IconGraduationCap,
  IconLogout,
  IconX,
} from "./ui/icons"

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  role: "admin" | "faculty"
  userName?: string
  userEmail?: string
}

export default function DashboardSidebar({ role, userName, userEmail }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const adminLinks: SidebarLink[] = [
    { href: "/admin/dashboard", label: "Overview", icon: <IconDashboard size={18} /> },
    { href: "/admin/users", label: "User Management", icon: <IconUsers size={18} /> },
    { href: "/admin/resources", label: "SEO Resources", icon: <IconBookOpen size={18} /> },
    { href: "/settings", label: "Account Security", icon: <IconSettings size={18} /> },
  ]

  const facultyLinks: SidebarLink[] = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: <IconDashboard size={18} /> },
    { href: "/faculty/assignments", label: "Assignments", icon: <IconClipboard size={18} /> },
    { href: "/faculty/materials", label: "Study Materials", icon: <IconFolder size={18} /> },
    { href: "/faculty/notices", label: "Notices & Alerts", icon: <IconBell size={18} /> },
    { href: "/faculty/students", label: "My Students", icon: <IconGraduationCap size={18} /> },
    { href: "/settings", label: "Account Security", icon: <IconSettings size={18} /> },
  ]

  const links = role === "admin" ? adminLinks : facultyLinks

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch {
      router.push("/login")
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-orange-500/40 transition-colors shadow-inner">
            <img src="/logo.png" alt="SixBytes" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-cream block tracking-tight leading-none">
              SixBytes
            </span>
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-orange-400">
              {role === "admin" ? "Admin Console" : "Faculty Portal"}
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors"
          aria-label="Close sidebar"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* User Card */}
      <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-cream truncate">{userName || "Authorized User"}</p>
            <p className="text-[10px] text-muted-custom truncate">{userEmail || ""}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-custom/60 font-sans">
          Navigation
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-orange-500/15 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/10"
                  : "text-muted-custom hover:text-cream hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <span className={`shrink-0 transition-colors ${isActive ? "text-orange-400" : "text-muted-custom"}`}>
                {link.icon}
              </span>
              <span className="truncate">{link.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 shadow-sm shadow-orange-400 animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/[0.08] bg-white/[0.01]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400/90 hover:text-red-300 bg-red-500/[0.06] hover:bg-red-500/[0.12] border border-red-500/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <IconLogout size={16} />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Floating Toggle */}
      <div className="fixed top-20 left-4 z-40 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-mid/95 border border-white/15 text-cream text-xs font-medium shadow-xl backdrop-blur-xl hover:border-orange-500/40 transition-colors"
          aria-label="Open navigation menu"
        >
          <IconDashboard size={16} className="text-orange-400" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 lg:top-[70px] bottom-0 z-50 lg:z-30 w-72 lg:w-64 bg-[#0a0c0e]/98 lg:bg-[#0f1318]/95 border-r border-white/[0.08] backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 shadow-2xl lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
