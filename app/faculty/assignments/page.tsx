"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import GDriveViewer from "@/app/components/gdrive-viewer"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconClipboard,
  IconPlus,
  IconPaperclip,
  IconCalendar,
  IconAlertCircle,
  IconX,
  IconCheck,
} from "@/app/components/ui/icons"

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
    title: "",
    description: "",
    targetClass: "",
    subject: "",
    dueDate: "",
    fileUrl: "",
    fileName: "",
  })

  const fetchData = async () => {
    try {
      const [assignRes, meRes] = await Promise.all([
        fetch("/api/faculty/assignments").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (assignRes.success) setAssignments(assignRes.assignments)
      if (meRes.success) {
        setFaculty({ assignedClasses: meRes.user.assignedClasses || [], subjects: meRes.user.subjects || [] })
        if (!form.targetClass && meRes.user.assignedClasses?.length > 0) {
          setForm((prev) => ({
            ...prev,
            targetClass: meRes.user.assignedClasses[0],
            subject: meRes.user.subjects?.[0] || "",
          }))
        }
      }
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
      const res = await fetch("/api/faculty/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setForm({
          title: "",
          description: "",
          targetClass: faculty?.assignedClasses[0] || "",
          subject: faculty?.subjects[0] || "",
          dueDate: "",
          fileUrl: "",
          fileName: "",
        })
        fetchData()
      } else {
        setError(data.error || "Failed to create assignment")
      }
    } catch {
      setError("Network connection error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const classOptions = (faculty?.assignedClasses || []).map((c) => ({ value: c, label: `Class ${c}` }))
  const subjectOptions = (faculty?.subjects || []).map((s) => ({ value: s, label: s }))

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading assignments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Homework & Tasks
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Class Assignments
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Create homework tasks, set submission deadlines, and attach Google Drive question sheets.
          </p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); setError("") }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          <span>{showForm ? "Close Form" : "Create Assignment"}</span>
        </button>
      </div>

      {/* Creation Form Panel */}
      {showForm && (
        <div className="rounded-2xl border border-orange-500/30 bg-[#0f1318] p-6 sm:p-7 space-y-5 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h2 className="text-base font-display font-bold text-cream flex items-center gap-2">
              <IconClipboard size={18} className="text-orange-400" />
              <span>New Assignment Task</span>
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-custom">
              Assigned to your batch
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
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Assignment Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Chapter 4 Quadratic Equations Problem Set 1"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Instructions / Notes (Optional)</label>
              <textarea
                placeholder="Complete all odd questions from the attached sheet. Show step-by-step working."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none"
              />
            </div>

            {/* Class, Subject, Due Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <CustomSelect
                  label="Target Class"
                  options={classOptions}
                  value={form.targetClass}
                  onChange={(val) => setForm({ ...form, targetClass: val })}
                />
              </div>
              <div>
                <CustomSelect
                  label="Subject"
                  options={subjectOptions}
                  value={form.subject}
                  onChange={(val) => setForm({ ...form, subject: val })}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-1.5">Submission Deadline</label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            {/* Google Drive URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Google Drive Attachment Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Attachment Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic_Equations_Set1.pdf"
                  value={form.fileName}
                  onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? "Assigning to Students..." : "Publish Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconClipboard size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No assignments assigned yet</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              Click &quot;Create Assignment&quot; above to publish homework and task sheets for your classes.
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
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                        Class {a.targetClass}
                      </span>
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

                {/* Google Drive Preview Section */}
                {a.fileUrl && (
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => setPreviewId(previewId === a._id ? null : a._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                      >
                        <IconPaperclip size={14} />
                        <span>{previewId === a._id ? "Collapse Document Preview" : `View Attached Sheet (${a.fileName || "Google Drive Document"})`}</span>
                      </button>

                      <a
                        href={a.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-muted-custom hover:text-cream underline transition-colors"
                      >
                        Open Direct Link ↗
                      </a>
                    </div>

                    {previewId === a._id && (
                      <div className="mt-3 animate-in fade-in duration-200">
                        <GDriveViewer url={a.fileUrl} title={a.fileName || a.title} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
