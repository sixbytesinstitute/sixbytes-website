"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarLink {
  href: string
  label: string
  icon: string
}

const ADMIN_LINKS: SidebarLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/resources", label: "Resources", icon: "📝" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

const FACULTY_LINKS: SidebarLink[] = [
  { href: "/faculty/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/faculty/assignments", label: "Assignments", icon: "📋" },
  { href: "/faculty/materials", label: "Materials", icon: "📁" },
  { href: "/faculty/notices", label: "Notices", icon: "📢" },
  { href: "/faculty/students", label: "Students", icon: "🎓" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
]

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

  const links = role === "admin" ? ADMIN_LINKS : FACULTY_LINKS

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
    <>
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-orange-500/40 transition-colors">
            <img src="/logo.png" alt="SixBytes" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-cream block leading-none">
              SixBytes
            </span>
            <span className="text-[8px] uppercase font-bold tracking-[0.18em] text-orange-400">
              {role === "admin" ? "Admin Panel" : "Faculty Panel"}
            </span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <p className="text-xs font-semibold text-cream truncate">{userName || "User"}</p>
        <p className="text-[10px] text-muted-custom truncate">{userEmail || ""}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-muted-custom hover:text-cream hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
        >
          <span className="text-base">🚪</span>
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden rounded-lg bg-navy-mid/90 border border-white/10 p-2 text-cream backdrop-blur-xl"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[70px] bottom-0 z-40 w-64 flex flex-col bg-[#0d0f12]/95 border-r border-white/10 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
