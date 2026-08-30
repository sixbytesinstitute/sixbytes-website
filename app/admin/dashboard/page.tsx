"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  IconGraduationCap,
  IconTeacher,
  IconShield,
  IconBookOpen,
  IconPlus,
  IconUsers,
  IconExternalLink,
} from "@/app/components/ui/icons"

interface Stats {
  totalStudents: number
  totalFaculty: number
  totalAdmins: number
  totalResources: number
}

interface RecentUser {
  _id: string
  name: string
  email: string
  role: string
  class?: string
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalFaculty: 0, totalAdmins: 0, totalResources: 0 })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, resourcesRes] = await Promise.all([
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/admin/resources").then((r) => r.json()),
        ])

        if (usersRes.success) {
          const users = usersRes.users
          setStats({
            totalStudents: users.filter((u: { role: string }) => u.role === "student").length,
            totalFaculty: users.filter((u: { role: string }) => u.role === "faculty").length,
            totalAdmins: users.filter((u: { role: string }) => u.role === "admin").length,
            totalResources: resourcesRes.success ? resourcesRes.count : 0,
          })
          setRecentUsers(users.slice(0, 6))
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      label: "Enrolled Students",
      value: stats.totalStudents,
      subtitle: "Active classroom students",
      icon: <IconGraduationCap size={22} />,
      badge: "Class 9-12 & NDA",
    },
    {
      label: "Faculty Members",
      value: stats.totalFaculty,
      subtitle: "Mentors & educators",
      icon: <IconTeacher size={22} />,
      badge: "Active Faculty",
    },
    {
      label: "SEO Articles Live",
      value: stats.totalResources,
      subtitle: "Free public topics",
      icon: <IconBookOpen size={22} />,
      badge: "Google Indexed",
    },
    {
      label: "System Admins",
      value: stats.totalAdmins,
      subtitle: "Super administrators",
      icon: <IconShield size={22} />,
      badge: "Full Access",
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading console overview...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Admin Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Institute Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Real-time management for classroom batches, faculty, and public SEO resources.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
          >
            <IconPlus size={16} />
            <span>Onboard User</span>
          </Link>
          <Link
            href="/admin/resources"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-mid/80 hover:bg-navy-mid border border-white/10 hover:border-white/20 text-cream text-xs font-semibold transition-all"
          >
            <IconBookOpen size={16} className="text-orange-400" />
            <span>Write SEO Article</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group relative rounded-2xl bg-gradient-to-b from-navy-mid/90 to-[#0a0c0e]/90 border border-white/[0.08] hover:border-orange-500/30 p-5 shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Top Shine Bar */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-orange-500/[0.08] border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:border-orange-500/40 group-hover:scale-105 transition-all">
                {card.icon}
              </div>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-muted-custom">
                {card.badge}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-display font-bold text-cream tracking-tight">
                {card.value}
              </p>
              <p className="text-xs font-semibold text-cream/90 font-sans">
                {card.label}
              </p>
              <p className="text-[11px] text-muted-custom/70">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-cream font-sans flex items-center gap-2">
              <IconUsers size={16} className="text-orange-400" />
              <span>Recently Onboarded Users</span>
            </h2>
            <p className="text-[11px] text-muted-custom mt-0.5">Latest registrations across student and faculty roles</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <IconExternalLink size={14} />
          </Link>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {recentUsers.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-muted-custom">
              No users registered yet. Click &quot;Onboard User&quot; above to create accounts.
            </div>
          ) : (
            recentUsers.map((user) => {
              const roleBadge = {
                admin: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30", label: "Admin" },
                faculty: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", label: "Faculty" },
                student: { bg: "bg-white/[0.06]", text: "text-cream", border: "border-white/15", label: `Student (Class ${user.class || "—"})` },
              }[user.role as "admin" | "faculty" | "student"] || { bg: "bg-white/5", text: "text-cream", border: "border-white/10", label: user.role }

              return (
                <div
                  key={user._id}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-bold text-cream/80 shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-cream truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-custom truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                      {roleBadge.label}
                    </span>
                    <span className="text-[10px] text-muted-custom/60 hidden sm:inline-block">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
