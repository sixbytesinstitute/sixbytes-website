"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  IconClipboard,
  IconFolder,
  IconBell,
  IconGraduationCap,
  IconPlus,
  IconBookOpen,
  IconTeacher,
} from "@/app/components/ui/icons"

interface FacultyProfile {
  name: string
  assignedClasses: string[]
  subjects: string[]
}

export default function FacultyDashboard() {
  const [user, setUser] = useState<FacultyProfile | null>(null)
  const [stats, setStats] = useState({ assignments: 0, materials: 0, notices: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, assignRes, matRes, noticeRes, studRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/faculty/assignments").then((r) => r.json()),
          fetch("/api/faculty/materials").then((r) => r.json()),
          fetch("/api/faculty/notices").then((r) => r.json()),
          fetch("/api/faculty/students").then((r) => r.json()),
        ])

        if (meRes.success) setUser(meRes.user)
        setStats({
          assignments: assignRes.success ? assignRes.count : 0,
          materials: matRes.success ? matRes.count : 0,
          notices: noticeRes.success ? noticeRes.count : 0,
          students: studRes.success ? studRes.count : 0,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    {
      label: "Active Assignments",
      value: stats.assignments,
      subtitle: "Given to your classes",
      icon: <IconClipboard size={22} />,
      href: "/faculty/assignments",
    },
    {
      label: "Study Materials",
      value: stats.materials,
      subtitle: "Uploaded notes & formulas",
      icon: <IconFolder size={22} />,
      href: "/faculty/materials",
    },
    {
      label: "Class Notices",
      value: stats.notices,
      subtitle: "Broadcasted announcements",
      icon: <IconBell size={22} />,
      href: "/faculty/notices",
    },
    {
      label: "Enrolled Students",
      value: stats.students,
      subtitle: "Across assigned batches",
      icon: <IconGraduationCap size={22} />,
      href: "/faculty/students",
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading faculty portal...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Faculty Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Welcome back, {user?.name ? `Prof. ${user.name.split(" ")[0]}` : "Faculty"}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-muted-custom">Assigned:</span>
            {user?.assignedClasses?.map((cls) => (
              <span key={cls} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                Class {cls}
              </span>
            ))}
            <span className="text-xs text-muted-custom ml-1">·</span>
            {user?.subjects?.map((sub) => (
              <span key={sub} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {sub}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/faculty/assignments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all"
          >
            <IconPlus size={16} />
            <span>New Assignment</span>
          </Link>
          <Link
            href="/faculty/notices"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-mid/80 hover:bg-navy-mid border border-white/10 hover:border-white/20 text-cream text-xs font-semibold transition-all"
          >
            <IconBell size={16} className="text-orange-400" />
            <span>Post Notice</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative rounded-2xl bg-gradient-to-b from-navy-mid/90 to-[#0a0c0e]/90 border border-white/[0.08] hover:border-orange-500/30 p-5 shadow-xl transition-all duration-300 hover:-translate-y-0.5 block"
          >
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-orange-500/[0.08] border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:border-orange-500/40 group-hover:scale-105 transition-all">
                {card.icon}
              </div>
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
          </Link>
        ))}
      </div>

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/faculty/assignments"
          className="p-5 rounded-2xl border border-white/[0.08] bg-navy-mid/40 hover:bg-navy-mid/70 hover:border-orange-500/30 transition-all space-y-2 group"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
            <IconClipboard size={16} />
            <span>Manage Assignments</span>
          </div>
          <p className="text-xs text-muted-custom leading-relaxed">
            Create homework tasks, set submission deadlines, and attach Google Drive question sheets for student review.
          </p>
        </Link>

        <Link
          href="/faculty/materials"
          className="p-5 rounded-2xl border border-white/[0.08] bg-navy-mid/40 hover:bg-navy-mid/70 hover:border-orange-500/30 transition-all space-y-2 group"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
            <IconFolder size={16} />
            <span>Upload Notes & Formulas</span>
          </div>
          <p className="text-xs text-muted-custom leading-relaxed">
            Organize chapter notes, PYQ solution banks, and mock test papers for your assigned classes.
          </p>
        </Link>

        <Link
          href="/faculty/students"
          className="p-5 rounded-2xl border border-white/[0.08] bg-navy-mid/40 hover:bg-navy-mid/70 hover:border-orange-500/30 transition-all space-y-2 group"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
            <IconGraduationCap size={16} />
            <span>View Student Rosters</span>
          </div>
          <p className="text-xs text-muted-custom leading-relaxed">
            Track student enrolment, contact details, and streams across all your active classroom batches.
          </p>
        </Link>
      </div>
    </div>
  )
}
