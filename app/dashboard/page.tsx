"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GDriveViewer from "../components/gdrive-viewer"

type Tab = "assignments" | "materials" | "notices"

interface Assignment { _id: string; title: string; description: string; subject: string; dueDate: string; fileUrl: string | null; createdBy: { name: string } }
interface Material { _id: string; title: string; description: string; fileUrl: string; subject: string; category: string }
interface Notice { _id: string; title: string; content: string; priority: string; pinned: boolean; createdAt: string; createdBy: { name: string } }
interface UserProfile { name: string; email: string; phone: string; class: string; stream: string; role: string }

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [tab, setTab] = useState<Tab>("assignments")
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [meRes, assignRes, matRes, noticeRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/student/assignments").then((r) => r.json()),
          fetch("/api/student/materials").then((r) => r.json()),
          fetch("/api/student/notices").then((r) => r.json()),
        ])
        if (meRes.success && meRes.user.role === "student") {
          setUser(meRes.user)
          if (meRes.user.mustChangePassword) { router.push("/settings"); return }
        } else { router.push("/login"); return }
        if (assignRes.success) setAssignments(assignRes.assignments)
        if (matRes.success) setMaterials(matRes.materials)
        if (noticeRes.success) setNotices(noticeRes.notices)
      } catch { router.push("/login") }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) return <div className="min-h-screen bg-[#0a0c0e] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" /></div>
  if (!user) return null

  const urgentNotices = notices.filter((n) => n.priority !== "normal").length

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "assignments", label: "Assignments", count: assignments.length },
    { key: "materials", label: "Materials", count: materials.length },
    { key: "notices", label: "Notices", count: notices.length },
  ]

  return (
    <div className="min-h-screen bg-[#0a0c0e]">
      {/* Mobile sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed top-20 left-4 z-50 lg:hidden rounded-lg bg-navy-mid/90 border border-white/10 p-2 text-cream backdrop-blur-xl" aria-label="Toggle sidebar">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {sidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-[70px] bottom-0 z-40 w-64 flex flex-col bg-[#0d0f12]/95 border-r border-white/10 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-orange-500/40 transition-colors">
              <img src="/logo.png" alt="SixBytes" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-cream block leading-none">SixBytes</span>
              <span className="text-[8px] uppercase font-bold tracking-[0.18em] text-orange-400">Student Portal</span>
            </div>
          </Link>
        </div>

        <div className="px-5 py-4 border-b border-white/[0.06] space-y-1">
          <p className="text-xs font-semibold text-cream">{user.name}</p>
          <p className="text-[10px] text-muted-custom">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">Class {user.class}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">{user.stream}</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); setSidebarOpen(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-muted-custom hover:text-cream hover:bg-white/[0.04]"}`}>
              <span>{t.key === "assignments" ? "📋" : t.key === "materials" ? "📁" : "📢"} {t.label}</span>
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{t.count}</span>
            </button>
          ))}
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-custom hover:text-cream hover:bg-white/[0.04] transition-all">⚙️ Settings</Link>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">🚪 Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-[calc(100vh-70px)] p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-custom mt-1">
            Class {user.class} ({user.stream}) · {assignments.length} assignments · {urgentNotices > 0 && <span className="text-red-400">{urgentNotices} urgent notices</span>}
          </p>
        </div>

        {/* Tab Content */}
        {tab === "assignments" && (
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-cream">📋 Assignments</h2>
            {assignments.length === 0 ? <p className="text-sm text-muted-custom py-8 text-center">No assignments yet.</p> : assignments.map((a) => (
              <div key={a._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-cream">{a.title}</h3>
                    {a.description && <p className="text-xs text-muted-custom mt-1">{a.description}</p>}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold shrink-0">{a.subject}</span>
                </div>
                <div className="flex gap-4 text-[11px] text-muted-custom">
                  <span>Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  <span>By: {a.createdBy?.name}</span>
                </div>
                {a.fileUrl && (
                  <>
                    <button onClick={() => setPreviewId(previewId === a._id ? null : a._id)} className="text-xs text-orange-400 hover:text-orange-300 font-medium">{previewId === a._id ? "Hide" : "📎 View Attachment"}</button>
                    {previewId === a._id && <GDriveViewer url={a.fileUrl} title={a.title} />}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "materials" && (
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-cream">📁 Study Materials</h2>
            {materials.length === 0 ? <p className="text-sm text-muted-custom py-8 text-center">No materials available.</p> : materials.map((m) => (
              <div key={m._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-cream truncate">{m.title}</h3>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold">{m.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-semibold">{m.category}</span>
                  </div>
                </div>
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:scale-[1.02] transition-all">Open</a>
              </div>
            ))}
          </div>
        )}

        {tab === "notices" && (
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-cream">📢 Notices</h2>
            {notices.length === 0 ? <p className="text-sm text-muted-custom py-8 text-center">No notices.</p> : notices.map((n) => (
              <div key={n._id} className={`rounded-2xl border p-5 space-y-2 ${n.priority === "urgent" ? "bg-red-500/5 border-red-500/20" : n.priority === "exam_alert" ? "bg-amber-500/5 border-amber-500/20" : "bg-white/[0.02] border-white/10"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-cream">{n.pinned && "📌 "}{n.title}</h3>
                  {n.priority !== "normal" && <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${n.priority === "urgent" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{n.priority === "urgent" ? "🔴 Urgent" : "🟡 Exam Alert"}</span>}
                </div>
                <p className="text-xs text-muted-custom whitespace-pre-wrap">{n.content}</p>
                <p className="text-[10px] text-muted-custom/60">{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {n.createdBy?.name}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
