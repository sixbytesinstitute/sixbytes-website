"use client"

import React from "react"

interface SerpPreviewProps {
  title: string
  slug: string
  metaDescription: string
}

/**
 * Google Search Engine Results Page (SERP) snippet preview.
 * Shows exactly how the resource will appear in Google Search results.
 */
export default function SerpPreview({ title, slug, metaDescription }: SerpPreviewProps) {
  const displayTitle = title || "Page Title — SixBytes Educational Institute"
  const displayUrl = `sixbytes.in › resources › ${slug || "your-page-slug"}`
  const displayDesc =
    metaDescription || "Add a meta description to see how your page will appear in Google Search results..."

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-1.5">
      {/* Google-style header */}
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.15em] text-muted-custom/60 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Google Search Preview
      </div>

      {/* URL breadcrumb */}
      <div className="text-[13px] text-[#70757a] font-sans truncate">
        {displayUrl}
      </div>

      {/* Title link */}
      <h3 className="text-[18px] leading-snug font-sans text-[#8ab4f8] hover:underline cursor-pointer truncate">
        {displayTitle.length > 60 ? displayTitle.slice(0, 57) + "..." : displayTitle}
      </h3>

      {/* Meta description */}
      <p className="text-[13px] leading-relaxed text-[#bdc1c6] font-sans line-clamp-2">
        {displayDesc.length > 160 ? displayDesc.slice(0, 157) + "..." : displayDesc}
      </p>

      {/* Character counters */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06]">
        <span className={`text-[10px] font-mono ${title.length > 60 ? "text-amber-400" : "text-muted-custom/50"}`}>
          Title: {title.length}/60
        </span>
        <span
          className={`text-[10px] font-mono ${metaDescription.length > 160 ? "text-amber-400" : "text-muted-custom/50"}`}
        >
          Description: {metaDescription.length}/160
        </span>
      </div>
    </div>
  )
}
