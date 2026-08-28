"use client"

import { useEffect, useState, type FormEvent } from "react"
import { MATERIAL_CATEGORIES } from "@/lib/constants"

interface MaterialRecord {
  _id: string; title: string; description: string; fileUrl: string; fileName: string | null
  class: string; subject: string; category: string; createdAt: string
}

interface FacultyInfo { assignedClasses: string[]; subjects: string[] }

export default function FacultyMaterialsPage() {
  const [materials, setMaterials] = useState<MaterialRecord[]>([])
  const [faculty, setFaculty] = useState<FacultyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({ title: "", description: "", fileUrl: "", fileName: "", class: "", subject: "", category: "Class Notes" })

  const fetchData = async () => {
    try {
      const [matRes, meRes] = await Promise.all([
        fetch("/api/faculty/materials").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ])
      if (matRes.success) setMaterials(matRes.materials)
      if (meRes.success) {
        setFaculty({ assignedClasses: meRes.user.assignedClasses, subjects: meRes.user.subjects })
        if (!form.class) setForm((p) => ({ ...p, class: meRes.user.assignedClasses[0] || "", subject: meRes.user.subjects[0] || "" }))
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true)
    try {
      const res = await fetch("/api/faculty/materials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setShowForm(false); setForm({ title: "", description: "", fileUrl: "", fileName: "", class: faculty?.assignedClasses[0] || "", subject: faculty?.subjects[0] || "", category: "Class Notes" }); fetchData() }
      else setError(data.error || "Failed")
    } catch { setError("Connection error") }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-display font-bold text-cream">Study Materials</h1><p className="text-sm text-muted-custom mt-1">Upload and manage study materials via Google Drive</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all">{showForm ? "Cancel" : "+ Upload Material"}</button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" required placeholder="Material title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60" />
            <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 resize-none" />
            <input type="url" required placeholder="Google Drive shareable link" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                {faculty?.assignedClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                {faculty?.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
                {MATERIAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold disabled:opacity-50">{submitting ? "Uploading..." : "Upload Material"}</button>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {materials.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-custom">No materials uploaded yet.</div>
        ) : materials.map((m) => (
          <div key={m._id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-cream truncate">{m.title}</h3>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">Class {m.class}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">{m.subject}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">{m.category}</span>
              </div>
            </div>
            <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs text-orange-400 hover:text-orange-300 font-medium">Open ↗</a>
          </div>
        ))}
      </div>
    </div>
  )
}
