"use client"

import { useEffect, useState, type FormEvent } from "react"
import GDriveViewer from "@/app/components/gdrive-viewer"

interface Assignment {
  _id: string
  title: string
  description: string
  targetClass: string
  subject: string
  dueDate: string
  fileUrl: string | null
  fileName: string | null
  createdBy: { name: string }
  createdAt: string
}

interface FacultyInfo {
  assignedClasses: string[]
  subjects: string[]
}

export default function FacultyAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [previewId, setPreviewId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "", description: "", targetClass: "", subject: "",
    dueDate: "", fileUrl: "", fileName: "",
  })

  const fetchData = async () => {
    try {
      const [assignRes, meRes] = await Promise.all([
        fetch("/api/faculty/assignments").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (assignRes.success) setAssignments(assignRes.assignments)
      if (meRes.success) {
        setFaculty({ assignedClasses: meRes.user.assignedClasses, subjects: meRes.user.subjects })
        if (!form.targetClass && meRes.user.assignedClasses.length > 0) {
          setForm((prev) => ({ ...prev, targetClass: meRes.user.assignedClasses[0], subject: meRes.user.subjects[0] || "" }))
        }
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/faculty/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setForm({ title: "", description: "", targetClass: faculty?.assignedClasses[0] || "", subject: faculty?.subjects[0] || "", dueDate: "", fileUrl: "", fileName: "" })
        fetchData()
      } else {
        setError(data.error || "Failed to create assignment")
      }
    } catch { setError("Connection error") }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-cream">Assignments</h1>
          <p className="text-sm text-muted-custom mt-1">Create and manage class assignments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all">
          {showForm ? "Cancel" : "+ New Assignment"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Assignment title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60" />
            <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 resize-none" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select value={form.targetClass} onChange={(e) => setForm({ ...form, targetClass: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                {faculty?.assignedClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                {faculty?.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60" />
            </div>
            <input type="url" placeholder="Google Drive link (optional)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60" />
            <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold disabled:opacity-50">{submitting ? "Creating..." : "Create Assignment"}</button>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-custom">No assignments yet. Create your first one!</div>
        ) : assignments.map((a) => (
          <div key={a._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-cream">{a.title}</h3>
                {a.description && <p className="text-xs text-muted-custom mt-1">{a.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">Class {a.targetClass}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">{a.subject}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-custom">
              <span>Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span>By: {a.createdBy?.name || "—"}</span>
            </div>
            {a.fileUrl && (
              <>
                <button onClick={() => setPreviewId(previewId === a._id ? null : a._id)} className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  {previewId === a._id ? "Hide Preview" : "📎 View Attachment"}
                </button>
                {previewId === a._id && <GDriveViewer url={a.fileUrl} title={a.fileName || a.title} />}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
