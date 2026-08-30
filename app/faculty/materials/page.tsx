"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import { MATERIAL_CATEGORIES } from "@/lib/constants"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconFolder,
  IconPlus,
  IconExternalLink,
  IconAlertCircle,
  IconX,
  IconPaperclip,
} from "@/app/components/ui/icons"
import GDriveViewer from "@/app/components/gdrive-viewer"

interface MaterialRecord {
  _id: string
  title: string
  description: string
  fileUrl: string
  fileName: string | null
  class: string
  subject: string
  category: string
  createdAt: string
}

interface FacultyInfo {
  assignedClasses: string[]
  subjects: string[]
}

export default function FacultyMaterialsPage() {
  const [materials, setMaterials] = useState<MaterialRecord[]>([])
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [previewId, setPreviewId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
    class: "",
    subject: "",
    category: "Class Notes",
  })

  const fetchData = async () => {
    try {
      const [matRes, meRes] = await Promise.all([
        fetch("/api/faculty/materials").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (matRes.success) setMaterials(matRes.materials)
      if (meRes.success) {
        setFaculty({ assignedClasses: meRes.user.assignedClasses || [], subjects: meRes.user.subjects || [] })
        if (!form.class && meRes.user.assignedClasses?.length > 0) {
          setForm((p) => ({
            ...p,
            class: meRes.user.assignedClasses[0] || "",
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
      const res = await fetch("/api/faculty/materials", {
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
          fileUrl: "",
          fileName: "",
          class: faculty?.assignedClasses[0] || "",
          subject: faculty?.subjects[0] || "",
          category: "Class Notes",
        })
        fetchData()
      } else {
        setError(data.error || "Failed to upload material")
      }
    } catch {
      setError("Network connection error")
    } finally {
      setSubmitting(false)
    }
  }

  const classOptions = (faculty?.assignedClasses || []).map((c) => ({ value: c, label: `Class ${c}` }))
  const subjectOptions = (faculty?.subjects || []).map((s) => ({ value: s, label: s }))
  const categoryOptions = MATERIAL_CATEGORIES.map((c) => ({ value: c, label: c }))

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading study materials...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Learning Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Study Materials & Formulas
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Publish class notes, formula sheets, and PYQ banks directly to students via Google Drive embeds.
          </p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); setError("") }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          {showForm ? <IconX size={16} /> : <IconPlus size={16} />}
          <span>{showForm ? "Close Form" : "Upload Material"}</span>
        </button>
      </div>

      {/* Upload Form Panel */}
      {showForm && (
        <div className="rounded-2xl border border-orange-500/30 bg-[#0f1318] p-6 sm:p-7 space-y-5 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h2 className="text-base font-display font-bold text-cream flex items-center gap-2">
              <IconFolder size={18} className="text-orange-400" />
              <span>Upload Study Resource</span>
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-custom">
              Google Drive Cloud Storage (Zero MB Server Space)
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
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Resource Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Physics Chapter 3 Current Electricity Handwritten Notes"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Description / Topic Outline</label>
              <textarea
                placeholder="Covers Ohm's Law, Kirchhoff's Rules, Wheatstone Bridge, and numerical problem solutions."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none"
              />
            </div>

            {/* Google Drive Link */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                Google Drive Shareable Link (&quot;Anyone with link can view&quot;)
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-mono text-xs"
              />
            </div>

            {/* Class, Subject, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <CustomSelect
                  label="Class Batch"
                  options={classOptions}
                  value={form.class}
                  onChange={(val) => setForm({ ...form, class: val })}
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
              <div>
                <CustomSelect
                  label="Category Type"
                  options={categoryOptions}
                  value={form.category}
                  onChange={(val) => setForm({ ...form, category: val })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? "Uploading Resource Link..." : "Publish Study Material"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconFolder size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No study materials uploaded yet</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              Click &quot;Upload Material&quot; above to link your Google Drive notes, formulas, or question sheets.
            </p>
          </div>
        ) : (
          materials.map((m) => (
            <div
              key={m._id}
              className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl p-5 space-y-3 hover:border-orange-500/30 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                    Class {m.class}
                  </span>
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
                  <span>{previewId === m._id ? "Hide Preview" : "Preview PDF"}</span>
                </button>

                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-cream transition-all"
                >
                  <span>Open Drive</span>
                  <IconExternalLink size={12} />
                </a>
              </div>

              {previewId === m._id && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] animate-in fade-in duration-200">
                  <GDriveViewer url={m.fileUrl} title={m.title} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
