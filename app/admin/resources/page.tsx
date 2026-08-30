"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import { SUBJECTS, CLASSES } from "@/lib/constants"
import Link from "next/link"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconBookOpen,
  IconPlus,
  IconSearch,
  IconEye,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconExternalLink,
  IconSparkles,
} from "@/app/components/ui/icons"

interface ResourceRecord {
  _id: string
  title: string
  slug: string
  metaDescription: string
  subject: string
  targetClass: string
  chapter: string | null
  keywords: string[]
  published: boolean
  viewCount: number
  createdAt: string
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    subject: "Mathematics",
    targetClass: "10",
    chapter: "",
    keywords: "",
    content: "",
    published: true,
  })

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (filterSubject) params.set("subject", filterSubject)
      const res = await fetch(`/api/admin/resources?${params}`)
      const data = await res.json()
      if (data.success) setResources(data.resources)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [search, filterSubject])

  const openCreateModal = () => {
    setEditingId(null)
    setForm({
      title: "",
      slug: "",
      metaDescription: "",
      subject: "Mathematics",
      targetClass: "10",
      chapter: "",
      keywords: "",
      content: "",
      published: true,
    })
    setError("")
    setSuccess("")
    setShowModal(true)
  }

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: !editingId ? autoSlug : prev.slug,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    const payload = {
      ...form,
      keywords: form.keywords
        ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
    }

    try {
      const url = editingId
        ? `/api/admin/resources/${editingId}`
        : "/api/admin/resources"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setSuccess(editingId ? "Resource updated successfully!" : "SEO Article published and indexed!")
        setShowModal(false)
        fetchResources()
      } else {
        setError(data.error || "Failed to save resource")
      }
    } catch {
      setError("Network connection error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleTogglePublish = async (resItem: ResourceRecord) => {
    try {
      await fetch(`/api/admin/resources/${resItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !resItem.published }),
      })
      fetchResources()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this SEO article?")) return
    try {
      await fetch(`/api/admin/resources/${id}`, { method: "DELETE" })
      fetchResources()
    } catch (err) {
      console.error(err)
    }
  }

  const subjectFilterOptions = [
    { value: "", label: "All Academic Subjects" },
    ...SUBJECTS.map((s) => ({ value: s, label: s })),
  ]

  const classOptions = CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))
  const subjectFormOptions = SUBJECTS.map((s) => ({ value: s, label: s }))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            SEO Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Public Resources & Topics
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Publish login-free chapter notes, formulas, and PYQ banks (Byju&apos;s / Shaalaa style) for Google search traffic.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <IconPlus size={16} />
          <span>Publish SEO Article</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-custom">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search articles by title, keywords, or chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all font-sans"
          />
        </div>

        <div>
          <CustomSelect
            options={subjectFilterOptions}
            value={filterSubject}
            onChange={setFilterSubject}
            placeholder="Filter by subject"
          />
        </div>
      </div>

      {/* Resources Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            <p className="text-xs text-muted-custom font-sans">Loading SEO articles...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconBookOpen size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No articles found</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              Start publishing chapter-wise question banks and formulas to begin attracting organic Google search traffic.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Article Details</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Category</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Chapter</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Views</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Status</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {resources.map((r) => (
                  <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Title & Slug Link */}
                    <td className="px-5 py-3.5 max-w-xs sm:max-w-md">
                      <p className="font-semibold text-cream truncate">{r.title}</p>
                      <Link
                        href={`/resources/${r.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition-colors mt-0.5"
                      >
                        <span>/resources/{r.slug}</span>
                        <IconExternalLink size={12} />
                      </Link>
                    </td>

                    {/* Class & Subject */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                          Class {r.targetClass}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {r.subject}
                        </span>
                      </div>
                    </td>

                    {/* Chapter */}
                    <td className="px-5 py-3.5 text-muted-custom">
                      {r.chapter || "—"}
                    </td>

                    {/* Views */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-cream/90 font-mono text-[11px]">
                        <IconEye size={13} className="text-muted-custom" />
                        <span>{r.viewCount}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          r.published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${r.published ? "bg-emerald-400" : "bg-amber-400"}`} />
                        <span>{r.published ? "Live" : "Draft"}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(r)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10 text-muted-custom hover:text-cream hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                          {r.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Publish / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0f1318] border border-white/10 p-6 sm:p-7 space-y-5 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-white/10 font-sans">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-orange-400 mb-1">
                  SEO Content Studio
                </div>
                <h2 className="text-xl font-display font-bold text-cream">
                  {editingId ? "Edit SEO Article" : "Publish New Topic / Chapter"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors"
                aria-label="Close dialog"
              >
                <IconX size={20} />
              </button>
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                  Target Search Headline (Include Class, Subject & Topic)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Class 10 Science Chapter 10 Light Reflection Formulas & Important Questions"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                  Permanent URL Slug
                </label>
                <div className="flex items-center rounded-xl bg-navy-mid/70 border border-white/10 px-3.5 py-1">
                  <span className="text-xs text-muted-custom/60 font-mono">/resources/</span>
                  <input
                    type="text"
                    required
                    placeholder="class-10-light-reflection-notes"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="flex-1 py-1.5 px-1 bg-transparent text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                    Google Meta Description (Snippet)
                  </label>
                  <span className={`text-[10px] ${form.metaDescription.length > 160 ? "text-amber-400" : "text-muted-custom/60"}`}>
                    {form.metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={2}
                  placeholder="Free comprehensive study notes, formula cheatsheet, and top 10 solved questions for CBSE Class 10 Science Light chapter by SixBytes Dehradun."
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 resize-none"
                />
              </div>

              {/* Class, Subject, Chapter */}
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
                    options={subjectFormOptions}
                    value={form.subject}
                    onChange={(val) => setForm({ ...form, subject: val })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-1.5">
                    Chapter Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Chapter 10: Light"
                    value={form.chapter}
                    onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                  Target Search Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="cbse class 10 science notes, light chapter questions, physics formula sheet dehradun"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Content Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                    Article Body Content (HTML & Clean Formatting)
                  </label>
                  <span className="text-[10px] text-orange-400 flex items-center gap-1">
                    <IconSparkles size={12} />
                    <span>Supports &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;pre&gt;</span>
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  placeholder={`<h2>1. Core Concepts of Reflection</h2>\n<p>Light travels in straight lines. When light hits an opaque surface, it bounces back...</p>\n\n<h2>2. Essential Formulas</h2>\n<ul>\n  <li><strong>Mirror Formula:</strong> 1/f = 1/v + 1/u</li>\n  <li><strong>Magnification:</strong> m = -v/u = h'/h</li>\n</ul>`}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full font-mono text-xs px-4 py-3 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/50 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 leading-relaxed"
                />
              </div>

              {/* Publish Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 text-orange-500 focus:ring-orange-500 bg-navy-mid"
                  />
                  <div>
                    <p className="text-xs font-semibold text-cream">Publish immediately</p>
                    <p className="text-[11px] text-muted-custom">When checked, article is publicly discoverable at /resources/{form.slug || "slug"}</p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {submitting ? "Publishing to Search Index..." : editingId ? "Save Changes" : "Publish SEO Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
