"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconBell,
  IconPlus,
  IconPin,
  IconAlertCircle,
  IconX,
  IconCheck,
} from "@/app/components/ui/icons"

interface Notice {
  _id: string
  title: string
  content: string
  targetClass: string
  priority: string
  pinned: boolean
  createdAt: string
}

interface FacultyInfo {
  assignedClasses: string[]
}

export default function FacultyNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetClass: "All",
    priority: "normal",
  })

  const fetchData = async () => {
    try {
      const [noticeRes, meRes] = await Promise.all([
        fetch("/api/faculty/notices").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (noticeRes.success) setNotices(noticeRes.notices)
      if (meRes.success) setFaculty({ assignedClasses: meRes.user.assignedClasses || [] })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/faculty/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setForm({ title: "", content: "", targetClass: "All", priority: "normal" })
        fetchData()
      } else {
        setError(data.error || "Failed to post notice")
      }
    } catch {
      setError("Network connection error")
    } finally {
      setSubmitting(false)
    }
  }

  const priorityStyles: Record<string, { card: string; badge: string; iconColor: string; label: string }> = {
    normal: {
      card: "border-white/[0.08] bg-navy-mid/40",
      badge: "bg-white/[0.06] text-muted-custom border-white/10",
      iconColor: "text-muted-custom",
      label: "Normal Notice",
    },
    urgent: {
      card: "border-red-500/30 bg-red-500/[0.04]",
      badge: "bg-red-500/15 text-red-400 border-red-500/30",
      iconColor: "text-red-400",
      label: "Urgent Alert",
    },
    exam_alert: {
      card: "border-amber-500/30 bg-amber-500/[0.04]",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      iconColor: "text-amber-400",
      label: "Exam Alert",
    },
  }

  const classOptions = [
    { value: "All", label: "All Assigned Classes" },
    ...(faculty?.assignedClasses || []).map((c) => ({ value: c, label: `Class ${c}` })),
  ]

  const priorityOptions = [
    { value: "normal", label: "Normal Notice" },
    { value: "urgent", label: "Urgent Priority Alert" },
    { value: "exam_alert", label: "Upcoming Exam Notice" },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading notices...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Announcements & Alerts
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Class Notices
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Broadcast test schedules, holiday updates, and urgent alerts directly to students.
          </p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); setError("") }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          <span>{showForm ? "Close Form" : "Post Notice"}</span>
        </button>
      </div>

      {/* Creation Panel */}
      {showForm && (
        <div className="rounded-2xl border border-orange-500/30 bg-[#0f1318] p-6 sm:p-7 space-y-5 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h2 className="text-base font-display font-bold text-cream flex items-center gap-2">
              <IconBell size={18} className="text-orange-400" />
              <span>Broadcast Announcement</span>
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-custom">
              Instant Student Portal Sync
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <IconAlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Notice Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Physics Unit Test Scheduled for Friday"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Notice Details / Announcement Message</label>
              <textarea
                required
                rows={4}
                placeholder="All students must bring their formula sheets and non-programmable scientific calculators..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none"
              />
            </div>

            {/* Target Class & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <CustomSelect
                  label="Target Audience"
                  options={classOptions}
                  value={form.targetClass}
                  onChange={(val) => setForm({ ...form, targetClass: val })}
                />
              </div>
              <div>
                <CustomSelect
                  label="Alert Priority Level"
                  options={priorityOptions}
                  value={form.priority}
                  onChange={(val) => setForm({ ...form, priority: val })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? "Broadcasting Notice..." : "Publish Class Notice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconBell size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No notices posted yet</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              Click &quot;Post Notice&quot; above to announce test schedules or important updates to your classes.
            </p>
          </div>
        ) : (
          notices.map((n) => {
            const conf = priorityStyles[n.priority] || priorityStyles.normal

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
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                      {n.targetClass === "All" ? "All Classes" : `Class ${n.targetClass}`}
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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
