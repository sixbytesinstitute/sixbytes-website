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
import ResourceStudio, { type ResourceFormData } from "@/app/components/resources/resource-studio"

interface ResourceRecord {
  _id: string
  title: string
  slug: string
  metaDescription: string
  subject: string
  targetClass: string
  board?: string
  resourceType?: string
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
  const [loadError, setLoadError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<ResourceFormData>({
    title: "",
    slug: "",
    metaDescription: "",
    subject: "Mathematics",
    targetClass: "10",
    board: "CBSE & ICSE",
    resourceType: "topic_guide",
    chapter: "",
    keywords: "",
    content: "",
    published: true,
  })

  const fetchResources = async () => {
    setLoading(true)
    setLoadError("")

    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (filterSubject) params.set("subject", filterSubject)
      const res = await fetch(`/api/admin/resources?${params}`)
      const data = await res.json()
      if (!res.ok || !data.success) {
        setResources([])
        setLoadError("The resources service is unavailable right now.")
        return
      }

      setResources(data.resources)
    } catch (err) {
      console.error(err)
      setResources([])
      setLoadError("The resources service is unavailable right now.")
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
      board: "CBSE & ICSE",
      resourceType: "topic_guide",
      chapter: "",
      keywords: "",
      content: "",
      published: true,
    })
    setError("")
    setSuccess("")
    setShowModal(true)
  }

  const openEditModal = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/resources/${id}`)
      const data = await res.json()
      if (data.success && data.resource) {
        const r = data.resource
        setEditingId(id)
        setForm({
          title: r.title || "",
          slug: r.slug || "",
          metaDescription: r.metaDescription || "",
          subject: r.subject || "Mathematics",
          targetClass: r.targetClass || "10",
          board: r.board || "CBSE & ICSE",
          resourceType: r.resourceType || "topic_guide",
          chapter: r.chapter || "",
          keywords: Array.isArray(r.keywords) ? r.keywords.join(", ") : (r.keywords || ""),
          content: r.content || "",
          published: r.published ?? true,
        })
        setError("")
        setSuccess("")
        setShowModal(true)
      } else {
        setError("Failed to load resource for editing")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to fetch resource details")
    } finally {
      setLoading(false)
    }
  }

  const handleStudioSubmit = async (formData: ResourceFormData) => {
    setError("")
    setSuccess("")
    setSubmitting(true)

    const payload = {
      ...formData,
      keywords: formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
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

      {loadError && (
        <div
          role="alert"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-200"
        >
          <div className="flex items-start gap-2.5">
            <IconAlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-100">Unable to load SEO resources</p>
              <p className="text-xs text-red-200/75 mt-0.5">The server could not retrieve the resource list. Please try again.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchResources}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-red-400/30 text-xs font-semibold text-red-100 hover:bg-red-500/10 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-sm text-emerald-200"
        >
          <div className="flex items-center gap-2.5">
            <IconCheck size={18} className="text-emerald-400 shrink-0" />
            <p className="font-semibold text-emerald-100">{success}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="p-1 text-emerald-400/60 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <IconX size={16} />
          </button>
        </div>
      )}

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

                    {/* Class, Subject & Type */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                          Class {r.targetClass}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {r.subject}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            r.resourceType === "question_bank"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : r.resourceType === "program_tutorial"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : r.resourceType === "formula_sheet"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          }`}
                        >
                          {r.resourceType === "question_bank"
                            ? "Q&A Bank"
                            : r.resourceType === "program_tutorial"
                            ? "Code Lab"
                            : r.resourceType === "formula_sheet"
                            ? "Formulas"
                            : "Guide"}
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
                          onClick={() => openEditModal(r._id)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-orange-500/20 text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
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

      {/* Visual Resource Studio & Live Preview */}
      {showModal && (
        <ResourceStudio
          initialData={form}
          editingId={editingId}
          onSubmit={handleStudioSubmit}
          onClose={() => setShowModal(false)}
          submitting={submitting}
          error={error}
        />
      )}
    </div>
  )
}
