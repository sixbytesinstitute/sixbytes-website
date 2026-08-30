"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import ParticleField from "../components/ui/particle-field"
import ShimmerLine from "../components/ui/shimmer-line"
import CustomSelect from "../components/ui/custom-select"
import { SUBJECTS, CLASSES } from "@/lib/constants"
import {
  IconBookOpen,
  IconSearch,
  IconEye,
  IconGraduationCap,
  IconSparkles,
  IconExternalLink,
} from "../components/ui/icons"

interface Resource {
  _id: string
  slug: string
  title: string
  metaDescription: string
  subject: string
  targetClass: string
  chapter: string | null
  viewCount: number
  createdAt: string
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
        .then((data) => {
          if (data.success) setResources(data.resources)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, filterSubject, filterClass])

  const subjectOptions = [
    { value: "", label: "All Subjects" },
    ...SUBJECTS.map((s) => ({ value: s, label: s })),
  ]

  const classOptions = [
    { value: "", label: "All Classes" },
    ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` })),
  ]

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream font-sans overflow-hidden">
      <ParticleField particleCount={25} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] uppercase font-bold tracking-[0.18em] text-orange-400">
            <IconSparkles size={13} />
            <span>Open Knowledge Repository</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold text-cream tracking-tight leading-tight">
            Curated Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Resources & Notes</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-custom leading-relaxed">
            Free chapter-wise formula cheatsheets, NCERT derivations, and top solved question banks for CBSE &amp; ICSE Classes 9–12. Completely login-free.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-navy-mid/60 border border-white/[0.08] backdrop-blur-xl shadow-2xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-custom">
              <IconSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Search topics, formulas, chapters (e.g. Light reflection, Quadratic equations)..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setLoading(true) }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all font-sans"
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomSelect
              options={subjectOptions}
              value={filterSubject}
              onChange={(val) => { setFilterSubject(val); setLoading(true) }}
              placeholder="Subject"
            />
          </div>

          <div className="w-full sm:w-40">
            <CustomSelect
              options={classOptions}
              value={filterClass}
              onChange={(val) => { setFilterClass(val); setLoading(true) }}
              placeholder="Class"
            />
          </div>
        </div>

        {/* Resource Articles Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            <p className="text-xs text-muted-custom font-sans">Filtering topics...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconBookOpen size={24} />
            </div>
            <p className="text-base font-semibold text-cream">No study resources found</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              We couldn&apos;t find any published topics matching your search. Try resetting your filters or check back as our faculty uploads more chapters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => (
              <Link
                key={r._id}
                href={`/resources/${r.slug}`}
                className="group relative rounded-2xl border border-white/[0.08] bg-navy-mid/40 hover:bg-navy-mid/70 hover:border-orange-500/40 p-6 space-y-4 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Badge Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                      Class {r.targetClass}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {r.subject}
                    </span>
                    {r.chapter && (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {r.chapter}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-semibold text-cream group-hover:text-orange-300 transition-colors font-display line-clamp-2 leading-snug">
                    {r.title}
                  </h2>

                  {/* Meta Description */}
                  <p className="text-xs text-muted-custom leading-relaxed line-clamp-3">
                    {r.metaDescription}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-muted-custom/70">
                  <span className="flex items-center gap-1">
                    <IconEye size={13} className="text-muted-custom" />
                    <span>{r.viewCount} reads</span>
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Guide</span>
                    <IconExternalLink size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <ShimmerLine />
      </div>
    </div>
  )
}
