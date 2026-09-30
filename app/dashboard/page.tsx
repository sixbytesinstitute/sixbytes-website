"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GDriveViewer from "../components/gdrive-viewer"
import ActivityGraph from "../components/dashboard/activity-graph"
import AvatarModal from "../components/dashboard/avatar-modal"
import {
  IconClipboard,
  IconFolder,
  IconBell,
  IconSettings,
  IconLogout,
  IconPaperclip,
  IconPin,
  IconAlertCircle,
  IconCalendar,
  IconExternalLink,
  IconGraduationCap,
  IconX,
  IconDashboard,
  IconEdit,
  IconSparkles,
  IconBity,
  IconBookOpen,
} from "@/app/components/ui/icons"
import { getAvatarById, AvatarGlyph } from "@/lib/avatars"

type Tab = "overview" | "assignments" | "materials" | "notices"

interface Assignment {
  _id: string
  title: string
  description: string
  subject: string
  dueDate: string
  fileUrl: string | null
  fileName?: string | null
  createdBy: { name: string }
}

interface Material {
  _id: string
  title: string
  description: string
  fileUrl: string
  subject: string
  category: string
}

interface Notice {
  _id: string
  title: string
  content: string
  priority: string
  pinned: boolean
  createdAt: string
  createdBy: { name: string }
}

interface UserProfile {
  name: string
  email: string
  phone: string
  class: string
  stream: string
  role: string
  avatar?: string
  isEnrolled?: boolean
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [tab, setTab] = useState<Tab>("overview")
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("")
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      try {
        const meRes = await fetch("/api/auth/me").then((r) => r.json())

        if (meRes.success && meRes.user.role === "student") {
          setUser(meRes.user)
          if (meRes.user.mustChangePassword) {
            router.push("/settings")
            return
          }

          // Log login activity
          fetch("/api/student/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "login" }),
          }).catch(() => {})

          // Only fetch enrolled-student data if enrolled
          if (meRes.user.isEnrolled) {
            const [assignRes, matRes, noticeRes] = await Promise.all([
              fetch("/api/student/assignments").then((r) => r.json()),
              fetch("/api/student/materials").then((r) => r.json()),
              fetch("/api/student/notices").then((r) => r.json()),
            ])
            if (assignRes.success) setAssignments(assignRes.assignments)
            if (matRes.success) setMaterials(matRes.materials)
            if (noticeRes.success) setNotices(noticeRes.notices)
          }
        } else {
          router.push("/login")
          return
        }
      } catch {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Connecting to student portal...</p>
      </div>
    )
  }

  if (!user) return null

  const urgentNotices = notices.filter((n) => n.priority !== "normal").length
  const isEnrolled = user.isEnrolled ?? false

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", count: 0, icon: <IconDashboard size={16} /> },
    ...(isEnrolled
      ? [
          { key: "assignments" as Tab, label: "Assignments", count: assignments.length, icon: <IconClipboard size={16} /> },
          { key: "materials" as Tab, label: "Study Vault", count: materials.length, icon: <IconFolder size={16} /> },
          { key: "notices" as Tab, label: "Notice Board", count: notices.length, icon: <IconBell size={16} /> },
        ]
      : []),
  ]

  const priorityBadgeStyle: Record<string, { badge: string; card: string; label: string }> = {
    normal: {
      badge: "bg-white/[0.06] text-muted-custom border-white/10",
      card: "border-white/[0.08] bg-navy-mid/40",
      label: "General Notice",
    },
    urgent: {
      badge: "bg-red-500/15 text-red-400 border-red-500/30",
      card: "border-red-500/30 bg-red-500/[0.04]",
      label: "Urgent Alert",
    },
    exam_alert: {
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      card: "border-amber-500/30 bg-amber-500/[0.04]",
      label: "Upcoming Exam",
    },
  }

  const uniqueSubjects = Array.from(new Set([
    ...assignments.map((a) => a.subject),
    ...materials.map((m) => m.subject),
  ])).filter(Boolean)

  return (
    <div className="min-h-screen bg-obsidian text-cream font-sans">
      {/* Mobile Floating Menu Button */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-mid/95 border border-white/15 text-cream text-xs font-medium shadow-xl backdrop-blur-xl hover:border-orange-500/40 transition-colors"
          aria-label="Open student portal menu"
        >
          <IconDashboard size={16} className="text-orange-400" />
          <span>Portal Menu</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 lg:z-30 w-72 lg:w-64 bg-[#0a0c0e]/98 lg:bg-[#0f1318]/95 border-r border-white/[0.08] backdrop-blur-2xl transition-transform duration-300 ease-out lg:translate-x-0 shadow-2xl lg:shadow-none flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-orange-500/40 transition-colors">
              <img src="/logo.png" alt="SixBytes" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-cream block tracking-tight leading-none">
                SixBytes
              </span>
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-orange-400">
                Student Portal
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06]"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {(() => {
              const av = getAvatarById(user.avatar)
              return (
                <button
                  type="button"
                  onClick={() => setAvatarModalOpen(true)}
                  title="Click to customize your profile avatar"
                  className={`group relative w-10 h-10 rounded-xl ${av.borderColor} border flex items-center justify-center font-bold ${av.textColor} shrink-0 shadow-md cursor-pointer hover:scale-105 hover:ring-2 hover:ring-orange-500/50 transition-all`}
                  style={{ background: av.gradient }}
                >
                  <AvatarGlyph iconName={av.iconName} initial={user.name.charAt(0).toUpperCase()} size={16} />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm opacity-90 group-hover:opacity-100">
                    <IconEdit size={9} />
                  </span>
                </button>
              )
            })()}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-cream truncate">{user.name}</p>
                <button
                  type="button"
                  onClick={() => setAvatarModalOpen(true)}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-medium transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                  Class {user.class || "Student"}
                </span>
                {user.stream && user.stream !== "N/A" && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {user.stream}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-custom/60">
            My Academics
          </div>

          {tabs.map((t) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/15 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-500/10"
                    : "text-muted-custom hover:text-cream hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-orange-400" : "text-muted-custom"}>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isActive ? "bg-orange-500/20 text-orange-300" : "bg-white/[0.06] text-muted-custom"
                }`}>
                  {t.count}
                </span>
              </button>
            )
          })}

          <div className="pt-3 border-t border-white/[0.06]">
            <Link
              href="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-muted-custom hover:text-cream hover:bg-white/[0.04] transition-all"
            >
              <IconSettings size={16} />
              <span>Change Password</span>
            </Link>
          </div>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400/90 hover:text-red-300 bg-red-500/[0.06] hover:bg-red-500/[0.12] border border-red-500/20 transition-all duration-200 cursor-pointer"
          >
            <IconLogout size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="flex items-start gap-4">
            {(() => {
              const av = getAvatarById(user.avatar)
              return (
                <button
                  type="button"
                  onClick={() => setAvatarModalOpen(true)}
                  title="Click to customize profile avatar"
                  className={`group relative w-14 h-14 rounded-2xl ${av.borderColor} border-2 flex items-center justify-center font-bold ${av.textColor} shrink-0 shadow-xl cursor-pointer hover:scale-105 hover:ring-2 hover:ring-orange-500/50 transition-all`}
                  style={{ background: av.gradient }}
                >
                  <AvatarGlyph iconName={av.iconName} initial={user.name.charAt(0).toUpperCase()} size={24} />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <IconSparkles size={11} />
                  </span>
                </button>
              )
            })()}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400">
                  {isEnrolled ? (
                    <>{"Class " + user.class} {user.stream !== "N/A" ? `· ${user.stream}` : ""}</>
                  ) : (
                    <>Free Account</>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-custom hover:text-cream px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <span>Change Avatar</span>
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
                Hello, {user.name.split(" ")[0]}
              </h1>
              <p className="text-xs sm:text-sm text-muted-custom mt-1">
                {isEnrolled
                  ? `You have ${assignments.length} assignments assigned and ${materials.length} notes ready to study.`
                  : "Explore free resources, track your progress, and build your study streak!"}
              </p>
            </div>
          </div>

          {urgentNotices > 0 && isEnrolled && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/[0.08] border border-red-500/30 text-red-400 text-xs font-semibold">
              <IconAlertCircle size={16} />
              <span>{urgentNotices} Urgent Notice{urgentNotices > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* Enrollment CTA for non-enrolled students */}
        {!isEnrolled && (
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/[0.08] via-amber-500/[0.05] to-orange-500/[0.08] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 shrink-0">
              <IconGraduationCap size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-cream font-display">Unlock the Full SixBytes Experience</h3>
              <p className="text-xs text-muted-custom mt-1">Enroll at SixBytes to get assignments, study materials, faculty notes, and personalized notice alerts.</p>
            </div>
            <a
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20enroll%20in%20your%20coaching%20program."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all"
            >
              <IconGraduationCap size={16} />
              <span>Enroll Now</span>
            </a>
          </div>
        )}

        {/* Tab Navigation Pill Row */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                tab === t.key
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                  : "bg-white/[0.04] text-muted-custom hover:text-cream hover:bg-white/[0.08]"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                tab === t.key ? "bg-white/20 text-white" : "bg-white/10 text-muted-custom"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 0: OVERVIEW — Activity Graph + Streaks */}
        {tab === "overview" && (
          <div className="space-y-6">
            <ActivityGraph />

            {/* Quick Links for non-enrolled */}
            {!isEnrolled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/resources"
                  className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-5 space-y-2 hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <IconBookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-cream font-display group-hover:text-orange-400 transition-colors">Study Vault</h3>
                      <p className="text-[11px] text-muted-custom">Curated guides, formulas & solved questions</p>
                    </div>
                  </div>
                </Link>
                <div
                  className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-5 space-y-2 hover:border-orange-500/40 transition-all group cursor-pointer"
                  onClick={() => {
                    const tutorBtn = (document.querySelector('button[data-tutor-launcher="true"]') ||
                      document.querySelector('button[aria-label="Open Bity Socratic AI"]')) as HTMLButtonElement
                    tutorBtn?.click()
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-inner group-hover:scale-105 transition-transform">
                      <IconBity size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-cream font-display group-hover:text-orange-300 transition-colors">Bity</h3>
                      <p className="text-[11px] text-muted-custom">SixBytes Socratic companion • Conceptual hints</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-5 space-y-2 hover:border-orange-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <IconSettings size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-cream font-display group-hover:text-orange-400 transition-colors">Profile & Settings</h3>
                      <p className="text-[11px] text-muted-custom">Customize avatar, name & credentials</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: ASSIGNMENTS */}
        {tab === "assignments" && (
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
                  <IconClipboard size={24} />
                </div>
                <p className="text-sm font-semibold text-cream">No pending assignments</p>
                <p className="text-xs text-muted-custom max-w-sm mx-auto">
                  You are all caught up! Your faculty has not posted any active assignments for Class {user.class}.
                </p>
              </div>
            ) : (
              assignments.map((a) => {
                const isDueSoon = new Date(a.dueDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000

                return (
                  <div
                    key={a._id}
                    className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl p-5 sm:p-6 space-y-4 hover:border-orange-500/30 transition-all shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {a.subject}
                          </span>
                          {isDueSoon && (
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              Due Soon
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-cream font-display">{a.title}</h3>
                        {a.description && (
                          <p className="text-xs text-muted-custom leading-relaxed whitespace-pre-wrap">{a.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-xs text-muted-custom bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-xl">
                        <IconCalendar size={14} className="text-orange-400" />
                        <span>Due: <strong className="text-cream font-medium">{new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/[0.06] text-xs">
                      <span className="text-[11px] text-muted-custom">Assigned by {a.createdBy?.name || "Faculty"}</span>

                      {a.fileUrl && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPreviewId(previewId === a._id ? null : a._id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                          >
                            <IconPaperclip size={14} />
                            <span>{previewId === a._id ? "Close Document" : "Open Attached Sheet"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {previewId === a._id && a.fileUrl && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06] animate-in fade-in duration-200">
                        <GDriveViewer url={a.fileUrl} title={a.title} />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* TAB 2: STUDY MATERIALS */}
        {tab === "materials" && (
          <div className="space-y-4">
            {/* Subject Filters */}
            {uniqueSubjects.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pb-2">
                <span className="text-xs text-muted-custom mr-1">Filter by subject:</span>
                <button
                  onClick={() => setSelectedSubjectFilter("")}
                  className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedSubjectFilter === ""
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold"
                      : "bg-white/[0.02] text-muted-custom border-white/10 hover:text-cream"
                  }`}
                >
                  All Subjects
                </button>
                {uniqueSubjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubjectFilter(sub)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                      selectedSubjectFilter === sub
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold"
                        : "bg-white/[0.02] text-muted-custom border-white/10 hover:text-cream"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {materials.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
                  <IconFolder size={24} />
                </div>
                <p className="text-sm font-semibold text-cream">No study materials available</p>
                <p className="text-xs text-muted-custom max-w-sm mx-auto">
                  Your teachers have not uploaded any chapter notes for Class {user.class} yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {materials
                  .filter((m) => !selectedSubjectFilter || m.subject === selectedSubjectFilter)
                  .map((m) => (
                    <div
                      key={m._id}
                      className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl p-5 space-y-3 hover:border-orange-500/30 transition-all shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {m.subject}
                          </span>
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {m.category}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-cream font-display leading-snug">{m.title}</h3>
                        {m.description && (
                          <p className="text-xs text-muted-custom leading-relaxed line-clamp-2">{m.description}</p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                        <button
                          onClick={() => setPreviewId(previewId === m._id ? null : m._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                        >
                          <IconPaperclip size={14} />
                          <span>{previewId === m._id ? "Close PDF" : "Preview PDF"}</span>
                        </button>

                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cream transition-all"
                        >
                          <span>Open in Drive</span>
                          <IconExternalLink size={12} />
                        </a>
                      </div>

                      {previewId === m._id && (
                        <div className="mt-3 pt-3 border-t border-white/[0.06] animate-in fade-in duration-200">
                          <GDriveViewer url={m.fileUrl} title={m.title} />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTICES */}
        {tab === "notices" && (
          <div className="space-y-3">
            {notices.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
                  <IconBell size={24} />
                </div>
                <p className="text-sm font-semibold text-cream">No notices on the board</p>
                <p className="text-xs text-muted-custom max-w-sm mx-auto">
                  All active announcements for your batch will be displayed here.
                </p>
              </div>
            ) : (
              notices.map((n) => {
                const conf = priorityBadgeStyle[n.priority] || priorityBadgeStyle.normal

                return (
                  <div
                    key={n._id}
                    className={`rounded-2xl border ${conf.card} backdrop-blur-xl p-5 sm:p-6 space-y-3 shadow-xl transition-all hover:border-orange-500/30`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {n.pinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            <IconPin size={11} />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${conf.badge}`}>
                          {conf.label}
                        </span>
                      </div>

                      <span className="text-[11px] text-muted-custom/70">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-cream font-display">{n.title}</h3>
                    <p className="text-xs text-muted-custom leading-relaxed whitespace-pre-wrap">{n.content}</p>

                    <div className="pt-2 border-t border-white/[0.04] text-[11px] text-muted-custom/60">
                      Posted by {n.createdBy?.name || "SixBytes Faculty"}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={user.avatar}
        userName={user.name}
        onAvatarUpdated={(newId) => {
          setUser((prev) => (prev ? { ...prev, avatar: newId } : null))
        }}
      />
    </div>
  )
}
