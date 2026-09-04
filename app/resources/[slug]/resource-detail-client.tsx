"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ParticleField from "../../components/ui/particle-field";
import ShimmerLine from "../../components/ui/shimmer-line";
import {
  IconEye,
  IconCalendar,
  IconSparkles,
  IconCheck,
  IconGraduationCap,
  IconExternalLink,
  IconSun,
  IconMoon,
} from "../../components/ui/icons";

export interface ResourceDetail {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
  subject: string;
  targetClass: string;
  board?: string;
  resourceType?: string;
  chapter: string | null;
  content: string;
  keywords: string[];
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export default function ResourceDetailClient({
  initialResource,
}: {
  initialResource: ResourceDetail;
}) {
  const [resource, setResource] = useState<ResourceDetail>(initialResource);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sixbytes_resource_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("sixbytes_resource_theme", next);
  };

  // Track view count once per user session
  useEffect(() => {
    if (!resource?.slug) return;
    const sessionKey = `viewed_res_${resource.slug}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      fetch(`/api/resources/${resource.slug}`, { method: "POST" })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.viewCount) {
            setResource((prev) => ({ ...prev, viewCount: resData.viewCount }));
          }
        })
        .catch(() => {});
    }
  }, [resource?.slug]);

  // Inject copy buttons into all code & reaction blocks
  useEffect(() => {
    if (!resource) return;

    const timer = setTimeout(() => {
      const codeBlocks = document.querySelectorAll(
        ".resource-content-area .program-box, .resource-content-area pre"
      );

      codeBlocks.forEach((block) => {
        if (block.querySelector(".copy-code-btn")) return; // already injected

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        block.parentNode?.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        const btn = document.createElement("button");
        btn.className = "copy-code-btn";
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>`;
        btn.title = "Copy code to clipboard";

        btn.addEventListener("click", () => {
          const codeEl = block.querySelector("code");
          const text = codeEl ? codeEl.textContent : block.textContent;
          navigator.clipboard.writeText(text || "").then(() => {
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Copied!</span>`;
            btn.classList.add("copied");
            setTimeout(() => {
              btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>`;
              btn.classList.remove("copied");
            }, 2000);
          });
        });

        wrapper.appendChild(btn);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [resource]);

  const isLight = theme === "light";
  const boardName = resource.board || "CBSE & ICSE";

  return (
    <div
      className={`relative min-h-[calc(100vh-70px)] transition-colors duration-300 font-sans ${
        isLight
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream"
      }`}
    >
      {!isLight && <ParticleField particleCount={15} />}

      {/* ─── Top Exam Context Banner ──────────── */}
      <div
        className={`border-b text-xs transition-colors ${
          isLight
            ? "bg-slate-100/90 border-slate-200 text-slate-600"
            : "bg-[#07090b]/90 border-white/[0.06] text-muted-custom"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="font-semibold text-orange-500 flex items-center gap-1">
              <IconGraduationCap size={14} />
              <span>{boardName}</span>
            </span>
            <span className="opacity-40">•</span>
            <span>
              Class {resource.targetClass} {resource.subject}
            </span>
            <span className="opacity-40">•</span>
            <span>NCERT Solutions &amp; Concepts</span>
            <span className="opacity-40">•</span>
            <span className="hidden sm:inline">Board Exam 2026 Ready</span>
          </div>

          {/* Light / Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shadow-sm ${
              isLight
                ? "bg-white text-slate-700 hover:text-orange-600 border border-slate-300 hover:border-orange-400"
                : "bg-white/[0.08] text-cream/90 hover:text-orange-400 border border-white/10 hover:border-orange-500/40"
            }`}
            title={
              isLight
                ? "Switch to Dark Mode (Obsidian View)"
                : "Switch to Light Mode (Clean Paper View)"
            }
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

      <article className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* ─── Breadcrumb ─────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-2 text-xs font-medium flex-wrap ${
            isLight ? "text-slate-500" : "text-muted-custom"
          }`}
        >
          <Link
            href="/"
            className={`transition-colors ${
              isLight ? "hover:text-slate-900" : "hover:text-cream"
            }`}
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/resources"
            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
          >
            Free Study Resources
          </Link>
          <span>/</span>
          <span className="font-semibold capitalize text-orange-500">
            {resource.subject}
          </span>
          <span>/</span>
          <span
            className={`truncate max-w-[200px] sm:max-w-sm ${
              isLight ? "text-slate-700" : "text-cream/80"
            }`}
          >
            {resource.title}
          </span>
        </nav>

        {/* ─── Article Header Card ────────────────────────── */}
        <header
          className={`rounded-2xl border p-6 sm:p-8 space-y-4 shadow-xl transition-colors ${
            isLight
              ? "bg-white border-slate-200 shadow-slate-200/60"
              : "bg-navy-mid/60 border-white/[0.08] backdrop-blur-xl shadow-black/40"
          }`}
        >
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                isLight
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}
            >
              {boardName}
            </span>
            <span
              className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                isLight
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : "bg-white/[0.06] text-cream border border-white/10"
              }`}
            >
              Class {resource.targetClass}
            </span>
            <span
              className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                isLight
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}
            >
              {resource.subject}
            </span>
            {resource.chapter && (
              <span
                className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${
                  isLight
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                }`}
              >
                {resource.chapter}
              </span>
            )}
            <span
              className={`text-[10px] font-semibold px-3 py-1 rounded-full border flex items-center gap-1 ${
                isLight
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              <IconCheck size={11} />
              <span>Verified Faculty Notes &amp; Solutions</span>
            </span>
          </div>

          {/* Main Title (H1) */}
          <h1
            className={`text-2xl sm:text-4xl font-display font-bold leading-tight tracking-tight ${
              isLight ? "text-slate-900" : "text-cream"
            }`}
          >
            {resource.title}
          </h1>

          {/* Meta Description */}
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? "text-slate-600" : "text-muted-custom"
            }`}
          >
            {resource.metaDescription}
          </p>

          {/* Stats Bar */}
          <div
            className={`pt-4 border-t flex items-center justify-between gap-4 text-xs ${
              isLight
                ? "border-slate-100 text-slate-500"
                : "border-white/[0.06] text-muted-custom/70"
            }`}
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <IconEye
                size={14}
                className={isLight ? "text-slate-400" : "text-muted-custom"}
              />
              <span>{resource.viewCount} students read</span>
            </span>

            <span className="flex items-center gap-1.5 text-[11px]">
              <IconCalendar
                size={13}
                className={isLight ? "text-slate-400" : "text-muted-custom"}
              />
              <span>
                Updated{" "}
                {new Date(resource.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </header>

        {/* ─── Academic Styled Article Content ────── */}
        <div
          className={`rounded-2xl border p-6 sm:p-10 transition-colors shadow-xl leading-relaxed resource-content-area ${
            isLight
              ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
              : "bg-[#0d1117]/80 border-white/[0.08] backdrop-blur-xl text-cream/90 shadow-black/60"
          }`}
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />

        {/* ─── Keyword Tags for Indexing ─────────────────── */}
        {resource.keywords && resource.keywords.length > 0 && (
          <div className="space-y-2.5">
            <p
              className={`text-[10px] uppercase tracking-wider font-bold ${
                isLight ? "text-slate-500" : "text-muted-custom"
              }`}
            >
              Indexed Topics &amp; Examination Keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {resource.keywords.map((kw) => (
                <span
                  key={kw}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                    isLight
                      ? "bg-white border-slate-200 text-slate-700 hover:border-orange-400"
                      : "bg-navy-mid/80 border-white/[0.08] text-cream/80 hover:border-orange-500/30"
                  }`}
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── SixBytes Classroom & Batch Inquiry Card ────── */}
        <div className="relative rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/[0.12] via-amber-500/[0.06] to-transparent p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-500">
                <IconGraduationCap size={14} />
                <span>
                  SixBytes Academic Coaching • Shyampur &amp; Premnagar
                </span>
              </div>
              <h3
                className={`text-lg sm:text-xl font-display font-bold ${
                  isLight ? "text-slate-900" : "text-cream"
                }`}
              >
                Aiming for 95%+ in CBSE / ICSE Board &amp; Competitive Exams?
              </h3>
              <p
                className={`text-xs max-w-xl ${
                  isLight ? "text-slate-600" : "text-muted-custom"
                }`}
              >
                Join daily batches at SixBytes Institute for personalized
                mentoring, one-on-one doubt solving, and structured mock test
                series for Classes 9–12 &amp; NDA.
              </p>
            </div>

            <a
              href={`https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20was%20reading%20the%20${encodeURIComponent(
                resource.title
              )}%20study%20notes%20and%20want%20to%20inquire%20about%20admissions.`}
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

      {!isLight && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <ShimmerLine />
        </div>
      )}

      {/* ─── Structured CSS for Academic & Program Components ─ */}
      <style jsx global>{`
        /* Light / Dark Mode Typography & Box Rules */
        .resource-content-area h2 {
          font-family: var(--font-display, inherit);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        }
        .resource-content-area h3 {
          font-family: var(--font-display, inherit);
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #f97316;
        }
        .resource-content-area h4 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .resource-content-area p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .resource-content-area ul,
        .resource-content-area ol {
          margin-top: 0.75rem;
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .resource-content-area li {
          margin-bottom: 0.5rem;
          line-height: 1.65;
        }
        .resource-content-area table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .resource-content-area th {
          background-color: ${isLight ? "#f1f5f9" : "rgba(255,255,255,0.06)"};
          color: ${isLight ? "#0f172a" : "#ffffff"};
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid
            ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.1)"};
        }
        .resource-content-area td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid
            ${isLight ? "#f1f5f9" : "rgba(255,255,255,0.04)"};
        }

        /* Table of Contents Block */
        .toc-box {
          background-color: ${isLight ? "#f8fafc" : "rgba(255,255,255,0.03)"};
          border: 1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)"};
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
        }
        .toc-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: ${isLight ? "#0f172a" : "#ffffff"};
        }
        .toc-list {
          list-style-type: disc;
          margin-left: 1.25rem;
          margin-bottom: 0;
        }
        .toc-list li {
          margin-bottom: 0.4rem;
        }
        .toc-link {
          color: ${isLight ? "#7c3aed" : "#a78bfa"};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .toc-link:hover {
          color: #f97316;
          text-decoration: underline;
        }

        /* QUESTION & SOLUTION CARDS */
        .qa-card {
          border-radius: 1rem;
          margin: 1.75rem 0;
          overflow: hidden;
          border: 1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)"};
          box-shadow: ${isLight
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.3)"};
        }
        .qa-question {
          background-color: ${isLight ? "#f8fafc" : "rgba(255,255,255,0.03)"};
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid
            ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.06)"};
        }
        .qa-badge-question {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.65rem;
          border-radius: 0.375rem;
          background-color: ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.1)"};
          color: ${isLight ? "#334155" : "#94a3b8"};
          margin-bottom: 0.75rem;
        }
        .qa-solution {
          background-color: ${isLight ? "#ffffff" : "rgba(255,255,255,0.01)"};
          padding: 1.25rem 1.5rem;
        }
        .qa-badge-solution {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25rem 0.65rem;
          border-radius: 0.375rem;
          background-color: ${isLight
            ? "#dcfce7"
            : "rgba(16, 185, 129, 0.15)"};
          color: ${isLight ? "#166534" : "#34d399"};
          border: 1px solid
            ${isLight ? "#bbf7d0" : "rgba(16, 185, 129, 0.3)"};
          margin-bottom: 0.75rem;
        }

        /* Multi-line Program & Reaction Code Block Formatting */
        .resource-content-area pre,
        .program-box,
        .reaction-box {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          border-radius: 0.875rem;
          padding: 1.25rem 1.5rem;
          margin: 1.25rem 0;
          overflow-x: auto;
          white-space: pre-wrap !important;
          word-break: break-word;
          tab-size: 4;
          position: relative;
        }

        /* Copy Code Button */
        .copy-code-btn {
          position: absolute;
          top: 0.625rem;
          right: 0.625rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3rem 0.65rem;
          border-radius: 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          font-family: var(--font-sans, sans-serif);
          cursor: pointer;
          transition: all 0.15s ease;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
        }
        .copy-code-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }
        .copy-code-btn.copied {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .resource-content-area pre {
          background-color: ${isLight ? "#0f172a" : "#07090b"};
          color: ${isLight ? "#f8fafc" : "#38bdf8"};
          border: 1px solid
            ${isLight ? "#334155" : "rgba(255, 255, 255, 0.12)"};
        }

        .program-box {
          background-color: ${isLight ? "#0f172a" : "#07090b"};
          color: ${isLight ? "#38bdf8" : "#38bdf8"};
          border: 1px solid
            ${isLight ? "#1e293b" : "rgba(255, 255, 255, 0.14)"};
          box-shadow: ${isLight
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.08)"
            : "0 8px 12px -2px rgba(0, 0, 0, 0.4)"};
        }

        .reaction-box {
          background-color: ${isLight ? "#f1f5f9" : "#07090b"};
          border: 1px solid
            ${isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)"};
          color: ${isLight ? "#0f172a" : "#fef08a"};
        }

        .reaction-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #f97316;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-sans, sans-serif);
        }

        .resource-content-area code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          background-color: ${isLight ? "#f1f5f9" : "rgba(255, 255, 255, 0.08)"};
          color: ${isLight ? "#ea580c" : "#f59e0b"};
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-size: 0.85em;
        }

        .resource-content-area pre code,
        .program-box code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }

        /* Formula Box */
        .formula-callout {
          background: ${isLight
            ? "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)"
            : "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.08) 100%)"};
          border: 1px solid
            ${isLight ? "#bfdbfe" : "rgba(59,130,246,0.3)"};
          border-left: 4px solid #3b82f6;
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
        }

        /* Key Concept Callout */
        .concept-callout {
          background: ${isLight
            ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
            : "rgba(245,158,11,0.08)"};
          border: 1px solid
            ${isLight ? "#fde68a" : "rgba(245,158,11,0.25)"};
          border-left: 4px solid #f59e0b;
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
        }
      `}</style>
    </div>
  );
}
