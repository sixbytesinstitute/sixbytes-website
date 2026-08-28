"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ParticleField from "../components/ui/particle-field"
import ShimmerLine from "../components/ui/shimmer-line"

interface Resource {
  _id: string; slug: string; title: string; metaDescription: string
  subject: string; targetClass: string; chapter: string | null
  viewCount: number; createdAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterClass, setFilterClass] = useState("")

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (filterSubject) params.set("subject", filterSubject)
    if (filterClass) params.set("class", filterClass)

    const timeout = setTimeout(() => {
      fetch(`/api/resources?${params}`)
        .then((r) => r.json())
        .then((data) => { if (data.success) setResources(data.resources) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, filterSubject, filterClass])

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science", "Computer Science"]
  const classes = ["9", "10", "11", "12"]

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
      <ParticleField particleCount={20} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-cream">
            Free Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Resources</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-custom max-w-2xl mx-auto">
            Explore chapter-wise notes, important questions, and formula sheets for Classes 9-12. No login required.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search topics, chapters, keywords..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setLoading(true) }}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/40"
          />
          <select
            value={filterSubject}
            onChange={(e) => { setFilterSubject(e.target.value); setLoading(true) }}
            className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterClass}
            onChange={(e) => { setFilterClass(e.target.value); setLoading(true) }}
            className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
          >
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-custom">No resources found.</p>
            <p className="text-xs text-muted-custom/60 mt-2">Try different search terms or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <Link
                key={r._id}
                href={`/resources/${r.slug}`}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3 hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition-all"
              >
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                    Class {r.targetClass}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                    {r.subject}
                  </span>
                  {r.chapter && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">
                      {r.chapter}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-cream group-hover:text-orange-400 transition-colors line-clamp-2">
                  {r.title}
                </h3>
                <p className="text-xs text-muted-custom line-clamp-2">{r.metaDescription}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-custom/60">
                  <span>{r.viewCount} views</span>
                  <span>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0"><ShimmerLine /></div>
    </div>
  )
}
