"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

interface ResourceDetail {
  _id: string; title: string; slug: string; metaDescription: string
  subject: string; targetClass: string; chapter: string | null
  content: string; keywords: string[]; viewCount: number; createdAt: string
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
      <div className="min-h-[calc(100vh-70px)] bg-[#0a0c0e] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (notFound || !resource) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-[#0a0c0e] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-cream font-display font-bold">Resource Not Found</p>
        <Link href="/resources" className="text-sm text-orange-400 hover:text-orange-300">← Back to Resources</Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0c0e]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/resources" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            ← Back to Resources
          </Link>
        </nav>

        {/* Meta Badges */}
        <div className="flex gap-2 flex-wrap mb-4">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            Class {resource.targetClass}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
            {resource.subject}
          </span>
          {resource.chapter && (
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-semibold">
              {resource.chapter}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream leading-tight mb-3">
          {resource.title}
        </h1>
        <p className="text-sm text-muted-custom mb-6">{resource.metaDescription}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-[11px] text-muted-custom/60 mb-8 pb-6 border-b border-white/10">
          <span>{resource.viewCount} views</span>
          <span>Published {new Date(resource.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-sm max-w-none text-muted-custom
            prose-headings:text-cream prose-headings:font-display
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-muted-custom
            prose-strong:text-cream
            prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-amber-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />

        {/* Keywords */}
        {resource.keywords.length > 0 && (
          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-muted-custom/60 font-semibold mb-3">Related Topics</p>
            <div className="flex flex-wrap gap-2">
              {resource.keywords.map((kw) => (
                <span key={kw} className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-custom">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 text-center space-y-3">
          <p className="text-sm font-semibold text-cream">Want more resources like this?</p>
          <p className="text-xs text-muted-custom">Join SixBytes for complete access to class notes, assignments, and mentorship.</p>
          <a
            href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20enroll."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all"
          >
            Apply for Admission
          </a>
        </div>
      </article>
    </div>
  )
}
