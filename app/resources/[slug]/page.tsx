"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ParticleField from "../../components/ui/particle-field"
import ShimmerLine from "../../components/ui/shimmer-line"
import {
  IconEye,
  IconCalendar,
  IconSparkles,
  IconCheck,
  IconGraduationCap,
  IconExternalLink,
} from "../../components/ui/icons"

interface ResourceDetail {
  _id: string
  title: string
  slug: string
  metaDescription: string
  subject: string
  targetClass: string
  chapter: string | null
  content: string
  keywords: string[]
  viewCount: number
  createdAt: string
}

export default function ResourceDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [resource, setResource] = useState<ResourceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/resources/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setResource(data.resource)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-obsidian flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading topic content...</p>
      </div>
    )
  }

  if (notFound || !resource) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-obsidian flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-orange-400">
          <IconSparkles size={28} />
        </div>
        <h1 className="text-2xl font-display font-bold text-cream">Resource Not Found</h1>
        <p className="text-xs text-muted-custom max-w-sm">
          The requested study resource or chapter notes may have been moved or updated.
        </p>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 transition-all"
        >
          ← Browse All Resources
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream font-sans overflow-hidden">
      <ParticleField particleCount={15} />

      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-custom font-medium">
          <Link href="/" className="hover:text-cream transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="text-orange-400 hover:text-orange-300 transition-colors">Free Resources</Link>
          <span>/</span>
          <span className="text-cream/80 truncate max-w-[200px] sm:max-w-xs">{resource.title}</span>
        </nav>

        {/* Article Header Card */}
        <header className="rounded-2xl border border-white/[0.08] bg-navy-mid/50 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-2xl">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-white/[0.06] text-cream border border-white/10">
              Class {resource.targetClass}
            </span>
            <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {resource.subject}
            </span>
            {resource.chapter && (
              <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {resource.chapter}
              </span>
            )}
            <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <IconCheck size={11} />
              <span>Verified Faculty Notes</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-cream leading-tight tracking-tight">
            {resource.title}
          </h1>

          {/* Meta Description */}
          <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
            {resource.metaDescription}
          </p>

          {/* Stats Bar */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4 text-xs text-muted-custom/70">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <IconEye size={14} className="text-muted-custom" />
              <span>{resource.viewCount} reads</span>
            </span>

            <span className="flex items-center gap-1.5 text-[11px]">
              <IconCalendar size={13} className="text-muted-custom" />
              <span>Published {new Date(resource.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            </span>
          </div>
        </header>

        {/* Article Body Content */}
        <div
          className="rounded-2xl border border-white/[0.08] bg-navy-mid/30 backdrop-blur-xl p-6 sm:p-10 text-cream/90 font-sans leading-relaxed
            prose prose-invert prose-sm sm:prose-base max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-cream
            prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/[0.08]
            prose-h3:text-base sm:prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-orange-300
            prose-p:text-muted-custom prose-p:leading-relaxed prose-p:mb-4
            prose-ul:my-4 prose-ul:space-y-2 prose-li:text-muted-custom
            prose-strong:text-cream prose-strong:font-semibold
            prose-code:text-amber-300 prose-code:bg-white/[0.06] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-xs
            prose-pre:bg-[#07090b] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
            prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-500/[0.04] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />

        {/* Keywords Tags */}
        {resource.keywords.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-custom">
              Related Search Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {resource.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs px-3 py-1.5 rounded-xl bg-navy-mid/80 border border-white/[0.08] text-cream/80 hover:border-orange-500/30 transition-colors"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SixBytes Admission CTA Card */}
        <div className="relative rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/[0.12] via-amber-500/[0.06] to-transparent p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400">
                <IconGraduationCap size={14} />
                <span>SixBytes Academic Coaching</span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-cream">
                Targeting 95%+ in Board &amp; Competitive Exams?
              </h3>
              <p className="text-xs text-muted-custom max-w-xl">
                Join SixBytes in Shyampur &amp; Premnagar, Dehradun for daily batch coaching, personalized doubt solving, and structured test series for Classes 9–12 &amp; NDA.
              </p>
            </div>

            <a
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20found%20your%20study%20resources%20and%20want%20to%20inquire%20about%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all shrink-0 cursor-pointer"
            >
              <span>Inquire on WhatsApp</span>
              <IconExternalLink size={14} />
            </a>
          </div>
        </div>
      </article>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <ShimmerLine />
      </div>
    </div>
  )
}
