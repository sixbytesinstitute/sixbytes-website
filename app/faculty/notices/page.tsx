"use client"

import { useEffect, useState, type FormEvent } from "react"

interface Notice { _id: string; title: string; content: string; targetClass: string; priority: string; pinned: boolean; createdAt: string }
interface FacultyInfo { assignedClasses: string[] }

export default function FacultyNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ title: "", content: "", targetClass: "All", priority: "normal" })

  const fetchData = async () => {
    try {
      const [noticeRes, meRes] = await Promise.all([
        fetch("/api/faculty/notices").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (noticeRes.success) setNotices(noticeRes.notices)
      if (meRes.success) setFaculty({ assignedClasses: meRes.user.assignedClasses })
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true)
    try {
      const res = await fetch("/api/faculty/notices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setShowForm(false); setForm({ title: "", content: "", targetClass: "All", priority: "normal" }); fetchData() }
      else setError(data.error || "Failed")
    } catch { setError("Connection error") }
    finally { setSubmitting(false) }
  }

  const priorityStyles: Record<string, string> = {
    normal: "bg-white/5 border-white/10",
    urgent: "bg-red-500/5 border-red-500/20",
    exam_alert: "bg-amber-500/5 border-amber-500/20",
  }
  const priorityBadge: Record<string, string> = {
    normal: "bg-white/10 text-white/60",
    urgent: "bg-red-500/10 text-red-400",
    exam_alert: "bg-amber-500/10 text-amber-400",
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-display font-bold text-cream">Notices</h1><p className="text-sm text-muted-custom mt-1">Post announcements for your classes</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all">{showForm ? "Cancel" : "+ Post Notice"}</button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Notice title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60" />
            <textarea required placeholder="Notice content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.targetClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                <option value="All">All Classes</option>
                {faculty?.assignedClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                <option value="normal">Normal</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="exam_alert">🟡 Exam Alert</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold disabled:opacity-50">{submitting ? "Posting..." : "Post Notice"}</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-custom">No notices posted yet.</div>
        ) : notices.map((n) => (
          <div key={n._id} className={`rounded-2xl border ${priorityStyles[n.priority] || priorityStyles.normal} p-5 space-y-2`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-cream">{n.pinned && "📌 "}{n.title}</h3>
              <div className="flex gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadge[n.priority]}`}>{n.priority.replace("_", " ")}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">{n.targetClass === "All" ? "All" : `Class ${n.targetClass}`}</span>
              </div>
            </div>
            <p className="text-xs text-muted-custom whitespace-pre-wrap">{n.content}</p>
            <p className="text-[10px] text-muted-custom/60">{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
