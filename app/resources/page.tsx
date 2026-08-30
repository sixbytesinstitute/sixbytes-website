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
  IconSun,
  IconMoon,
  IconCheck,
} from "../components/ui/icons"

interface Resource {
  _id: string
  slug: string
  title: string
  metaDescription: string
  subject: string
  targetClass: string
  board?: string
  chapter: string | null
  keywords?: string[]
  viewCount: number
  createdAt: string
}

const BOARDS = [
  { value: "", label: "All Boards (CBSE / ICSE / State)" },
  { value: "CBSE", label: "CBSE Board" },
  { value: "ICSE", label: "ICSE Board" },
]

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterBoard, setFilterBoard] = useState("")
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const saved = localStorage.getItem("sixbytes_resource_theme")
    if (saved === "light" || saved === "dark") {
      setTheme(saved)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("sixbytes_resource_theme", next)
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (filterSubject) params.set("subject", filterSubject)
    if (filterClass) params.set("class", filterClass)
    if (filterBoard) params.set("board", filterBoard)

    const timeout = setTimeout(() => {
      fetch(`/api/resources?${params}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setResources(data.resources)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 250)

    return () => clearTimeout(timeout)
  }, [search, filterSubject, filterClass, filterBoard])

  const isLight = theme === "light"

  const subjectOptions = [
    { value: "", label: "All Subjects" },
    ...SUBJECTS.map((s) => ({ value: s, label: s })),
  ]

  const classOptions = [
    { value: "", label: "All Classes" },
    ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` })),
  ]

  return (
    <div
      className={`relative min-h-[calc(100vh-70px)] transition-colors duration-300 font-sans overflow-hidden ${
        isLight
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream"
      }`}
    >
      {!isLight && <ParticleField particleCount={20} />}

      {/* ─── Top Exam Banner & Theme Toggle ────────────────── */}
      <div
        className={`border-b text-xs transition-colors ${
          isLight
            ? "bg-slate-100/90 border-slate-200 text-slate-600"
            : "bg-[#07090b]/90 border-white/[0.06] text-muted-custom"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="font-semibold text-orange-500 flex items-center gap-1">
              <IconGraduationCap size={14} />
              <span>CBSE &amp; ICSE Free Knowledge Vault</span>
            </span>
            <span className="opacity-40">•</span>
            <span>Classes 9–12 Science, Math &amp; Coding</span>
            <span className="opacity-40">•</span>
            <span>100% Free &amp; Open Access</span>
          </div>

          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shadow-sm ${
              isLight
                ? "bg-white text-slate-700 hover:text-orange-600 border border-slate-300 hover:border-orange-400"
                : "bg-white/[0.08] text-cream/90 hover:text-orange-400 border border-white/10 hover:border-orange-500/40"
            }`}
            title={isLight ? "Switch to Dark Mode (Obsidian View)" : "Switch to Light Mode (BYJU'S / Paper View)"}
          >
            {isLight ? (
              <>
                <IconMoon size={13} className="text-indigo-600" />
                <span className="text-[11px] font-semibold">Dark View</span>
              </>
            ) : (
              <>
                <IconSun size={13} className="text-amber-400" />
                <span className="text-[11px] font-semibold">Light View</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* ─── Hero Section ───────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] uppercase font-bold tracking-[0.18em] border ${
              isLight
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
            }`}
          >
            <IconSparkles size={13} />
            <span>Open Educational Repository • Shaalaa &amp; BYJU&apos;S Pattern</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl font-display font-bold tracking-tight leading-tight ${
              isLight ? "text-slate-900" : "text-cream"
            }`}
          >
            Curated Study{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600">
              Resources &amp; Solutions
            </span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? "text-slate-600" : "text-muted-custom"}`}>
            Chapter-wise NCERT &amp; reference notes, chemical equations with catalysts, formula derivations, solved board exam questions, and FAQs for CBSE &amp; ICSE Class 10.
          </p>
        </div>

        {/* ─── Search & Filter Bar ────────────────────────── */}
        <div
          className={`p-4 rounded-2xl border shadow-xl space-y-3 transition-colors ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-200/60"
              : "bg-navy-mid/60 border-white/[0.08] backdrop-blur-xl shadow-black/40"
          }`}
        >
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div
                className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                  isLight ? "text-slate-400" : "text-muted-custom"
                }`}
              >
                <IconSearch size={16} />
              </div>
              <input
                type="text"
                placeholder="Search topics (e.g., Chemical reactions, Ohm's law, Python, Aldehydes, Light reflection)..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setLoading(true)
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-sans transition-all focus:outline-none focus:ring-1 focus:ring-orange-500/30 ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white"
                    : "bg-black/40 border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 focus:border-orange-500/60"
                }`}
              />
            </div>

            {/* Dropdowns */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <CustomSelect
                options={classOptions}
                value={filterClass}
                onChange={(val) => {
                  setFilterClass(val)
                  setLoading(true)
                }}
                placeholder="Class"
                className="w-36 text-xs"
              />

              <CustomSelect
                options={subjectOptions}
                value={filterSubject}
                onChange={(val) => {
                  setFilterSubject(val)
                  setLoading(true)
                }}
                placeholder="Subject"
                className="w-40 text-xs"
              />

              <CustomSelect
                options={BOARDS}
                value={filterBoard}
                onChange={(val) => {
                  setFilterBoard(val)
                  setLoading(true)
                }}
                placeholder="Board"
                className="w-36 text-xs"
              />
            </div>
          </div>

          {/* Quick Subject Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-white/[0.04]">
            <span className={`text-[10px] font-bold uppercase tracking-wider mr-1 ${isLight ? "text-slate-400" : "text-muted-custom/60"}`}>
              Quick Filter:
            </span>
            {["", "Chemistry", "Physics", "Biology", "Computer"].map((sub) => {
              const active = filterSubject === sub
              return (
                <button
                  key={sub || "all"}
                  onClick={() => {
                    setFilterSubject(sub)
                    setLoading(true)
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : isLight
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
                      : "bg-white/[0.04] text-muted-custom hover:bg-white/[0.08] hover:text-cream border border-white/[0.06]"
                  }`}
                >
                  {sub || "All Subjects"}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── Resources Grid ─────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-48 rounded-2xl border animate-pulse ${
                  isLight ? "bg-slate-100 border-slate-200" : "bg-navy-mid/30 border-white/[0.06]"
                }`}
              />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border space-y-3 ${
              isLight ? "bg-white border-slate-200 text-slate-600" : "bg-navy-mid/30 border-white/[0.06] text-muted-custom"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto text-orange-500">
              <IconBookOpen size={24} />
            </div>
            <h3 className={`text-base font-semibold ${isLight ? "text-slate-900" : "text-cream"}`}>
              No matching resources found
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              Try adjusting your search terms or filters. New board solutions are added regularly.
            </p>
            <button
              onClick={() => {
                setSearch("")
                setFilterSubject("")
                setFilterClass("")
                setFilterBoard("")
              }}
              className="text-xs text-orange-500 font-semibold hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resources.map((item) => {
              const boardLabel = item.board || "CBSE & ICSE"
              return (
                <Link
                  key={item._id}
                  href={`/resources/${item.slug}`}
                  className={`group rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-md ${
                    isLight
                      ? "bg-white border-slate-200 hover:border-orange-400 hover:shadow-lg shadow-slate-200/50"
                      : "bg-[#0f1318]/80 hover:bg-[#141a20] border-white/[0.08] hover:border-orange-500/40 hover:shadow-orange-500/10"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isLight
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        }`}
                      >
                        {boardLabel}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isLight
                            ? "bg-slate-100 text-slate-700 border-slate-200"
                            : "bg-white/[0.06] text-cream border border-white/10"
                        }`}
                      >
                        Class {item.targetClass}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          isLight
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {item.subject}
                      </span>
                      {item.chapter && (
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            isLight
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          }`}
                        >
                          {item.chapter}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      className={`text-base sm:text-lg font-display font-bold line-clamp-2 transition-colors ${
                        isLight
                          ? "text-slate-900 group-hover:text-orange-600"
                          : "text-cream group-hover:text-orange-400"
                      }`}
                    >
                      {item.title}
                    </h2>

                    {/* Meta Description */}
                    <p
                      className={`text-xs line-clamp-2 leading-relaxed ${
                        isLight ? "text-slate-600" : "text-muted-custom"
                      }`}
                    >
                      {item.metaDescription}
                    </p>

                    {/* Keywords Preview */}
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.keywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className={`text-[10px] px-2 py-0.5 rounded-md ${
                              isLight
                                ? "bg-slate-100 text-slate-600"
                                : "bg-white/[0.04] text-muted-custom"
                            }`}
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div
                    className={`pt-4 mt-4 border-t flex items-center justify-between text-[11px] ${
                      isLight ? "border-slate-100 text-slate-500" : "border-white/[0.06] text-muted-custom/70"
                    }`}
                  >
                    <span className="flex items-center gap-1 font-mono">
                      <IconEye size={13} className={isLight ? "text-slate-400" : "text-muted-custom"} />
                      <span>{item.viewCount || 0} reads</span>
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-orange-500 group-hover:translate-x-0.5 transition-transform">
                      <span>Read Study Guide</span>
                      <IconExternalLink size={12} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {!isLight && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ShimmerLine />
        </div>
      )}
    </div>
  )
}
