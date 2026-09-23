"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { SUBJECTS, CLASSES } from "@/lib/constants"
import CustomSelect from "@/app/components/ui/custom-select"
import SerpPreview from "@/app/components/resources/serp-preview"
import {
  type ContentBlock,
  type HeadingBlock,
  type ParagraphBlock,
  type QuestionBlock,
  type CodeBlock,
  type FormulaBlock,
  type ConceptBlock,
  type TableBlock,
  type BlockType,
  BLOCK_PALETTE,
  createBlock,
  blocksToHtml,
  htmlToBlocks,
  getTemplateBlocks,
} from "@/lib/resource-blocks"
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconSparkles,
} from "@/app/components/ui/icons"

// ─── Types ──────────────────────────────────────────────

export interface ResourceFormData {
  title: string
  slug: string
  metaDescription: string
  subject: string
  targetClass: string
  board: string
  resourceType: string
  chapter: string
  keywords: string
  content: string
  published: boolean
}

interface ResourceStudioProps {
  initialData?: Partial<ResourceFormData>
  editingId?: string | null
  onSubmit: (data: ResourceFormData) => Promise<void>
  onClose: () => void
  submitting: boolean
  error: string
}

// ─── Preview Viewports ──────────────────────────────────

type ViewportMode = "desktop" | "tablet" | "mobile"
const VIEWPORT_WIDTHS: Record<ViewportMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
}

// ─── Editor Modes ───────────────────────────────────────

type EditorMode = "blocks" | "code"

// ─── Slug generator ────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ─── Preview HTML Sanitizer (prevents DOM XSS during live preview) ───

function sanitizePreviewHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<\/?(iframe|object|embed|base|meta|link)\b[^>]*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    .replace(/(?:href|src)\s*=\s*['"]?\s*(?:javascript|vbscript):/gi, 'data-blocked="')
}

// ─── Resource type options ─────────────────────────────

const RESOURCE_TYPES = [
  { value: "topic_guide", label: "📝 Topic Guide" },
  { value: "question_bank", label: "❓ Question Bank" },
  { value: "formula_sheet", label: "📐 Formula Sheet" },
  { value: "program_tutorial", label: "💻 Program Tutorial" },
]

// ─── Subject & Class options ───────────────────────────

const subjectOptions = SUBJECTS.map((s) => ({ value: s, label: s }))
const classOptions = [
  ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` })),
  { value: "All", label: "All Classes" },
]

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function ResourceStudio({
  initialData,
  editingId,
  onSubmit,
  onClose,
  submitting,
  error,
}: ResourceStudioProps) {
  // ─── Form State ──────────────────────────────────────

  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "")
  const [subject, setSubject] = useState(initialData?.subject || "Mathematics")
  const [targetClass, setTargetClass] = useState(initialData?.targetClass || "10")
  const [board] = useState(initialData?.board || "CBSE & ICSE")
  const [resourceType, setResourceType] = useState(initialData?.resourceType || "topic_guide")
  const [chapter, setChapter] = useState(initialData?.chapter || "")
  const [keywords, setKeywords] = useState(initialData?.keywords || "")
  const [published, setPublished] = useState(initialData?.published ?? true)

  // ─── Editor State ────────────────────────────────────

  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (initialData?.content) {
      return htmlToBlocks(initialData.content)
    }
    return getTemplateBlocks(initialData?.resourceType || "topic_guide")
  })
  const [editorMode, setEditorMode] = useState<EditorMode>("blocks")
  const [rawCode, setRawCode] = useState("")
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark")

  // ─── Drag & Drop State ────────────────────────────────
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null)
  const [isDraggingPalette, setIsDraggingPalette] = useState(false)

  // ─── Sync blocks ↔ raw code on mode switch ──────────

  useEffect(() => {
    if (editorMode === "code") {
      setRawCode(blocksToHtml(blocks))
    }
  }, [editorMode])

  // ─── Auto-slug from title ────────────────────────────

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value)
      if (!editingId) {
        setSlug(generateSlug(value))
      }
    },
    [editingId]
  )

  // ─── Template load on resource type change ───────────

  const handleResourceTypeChange = useCallback(
    (newType: string) => {
      setResourceType(newType)
      if (!editingId && blocks.length <= 1) {
        setBlocks(getTemplateBlocks(newType))
      }
    },
    [editingId, blocks.length]
  )

  // ─── Block Operations ────────────────────────────────

  const addBlock = useCallback((type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)])
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const targetIdx = direction === "up" ? idx - 1 : idx + 1
      if (targetIdx < 0 || targetIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[targetIdx]] = [next[targetIdx], next[idx]]
      return next
    })
  }, [])

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const original = prev[idx]
      const clone = { ...JSON.parse(JSON.stringify(original)), id: `blk_${Date.now()}_dup` }
      const next = [...prev]
      next.splice(idx + 1, 0, clone)
      return next
    })
  }, [])

  const updateBlock = useCallback((id: string, updates: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...updates } as ContentBlock) : b))
    )
  }, [])

  // ─── Drag & Drop Handlers ─────────────────────────────

  const handleBlockDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("application/x-block-index", String(index))
    e.dataTransfer.effectAllowed = "move"
    setDraggedBlockIndex(index)
  }, [])

  const handlePaletteDragStart = useCallback((e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData("application/x-block-type", type)
    e.dataTransfer.effectAllowed = "copy"
    setIsDraggingPalette(true)
  }, [])

  const handleBlockDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = isDraggingPalette ? "copy" : "move"
      setDragOverIndex(index)
    },
    [isDraggingPalette]
  )

  const handleBlockDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    setDraggedBlockIndex(null)
    setIsDraggingPalette(false)

    const blockType = e.dataTransfer.getData("application/x-block-type") as BlockType
    if (blockType) {
      setBlocks((prev) => {
        const next = [...prev]
        next.splice(targetIndex, 0, createBlock(blockType))
        return next
      })
      return
    }

    const sourceStr = e.dataTransfer.getData("application/x-block-index")
    if (sourceStr) {
      const sourceIndex = parseInt(sourceStr, 10)
      if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
        setBlocks((prev) => {
          const next = [...prev]
          const [moved] = next.splice(sourceIndex, 1)
          const insertIdx = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
          next.splice(insertIdx, 0, moved)
          return next
        })
      }
    }
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragOverIndex(null)
    setDraggedBlockIndex(null)
    setIsDraggingPalette(false)
  }, [])

  // ─── Compiled HTML for preview ───────────────────────

  const compiledHtml = editorMode === "code" ? rawCode : blocksToHtml(blocks)

  // ─── Submit Handler ──────────────────────────────────

  const handleSubmit = async () => {
    const finalContent = editorMode === "code" ? rawCode : blocksToHtml(blocks)
    await onSubmit({
      title,
      slug,
      metaDescription,
      subject,
      targetClass,
      board,
      resourceType,
      chapter,
      keywords,
      content: finalContent,
      published,
    })
  }

  // ─── Preview container ref ───────────────────────────

  const previewRef = useRef<HTMLDivElement>(null)

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07090b]">
      {/* ─── Top Control Bar ────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#0a0c0e]">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-orange-400">
            <IconSparkles size={14} />
            {editingId ? "Edit Resource" : "New Resource"}
          </div>

          {/* Editor Mode Toggle */}
          <div className="flex rounded-lg border border-white/10 overflow-hidden text-[10px]">
            <button
              onClick={() => setEditorMode("blocks")}
              className={`px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                editorMode === "blocks"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-muted-custom hover:text-cream"
              }`}
            >
              Visual Blocks
            </button>
            <button
              onClick={() => setEditorMode("code")}
              className={`px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                editorMode === "code"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-muted-custom hover:text-cream"
              }`}
            >
              Raw HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Switcher */}
          <div className="flex rounded-lg border border-white/10 overflow-hidden text-[10px]">
            {(["desktop", "tablet", "mobile"] as ViewportMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`px-2.5 py-1.5 font-semibold capitalize transition-colors cursor-pointer ${
                  viewport === v
                    ? "bg-white/10 text-cream"
                    : "text-muted-custom hover:text-cream"
                }`}
              >
                {v === "desktop" ? "💻" : v === "tablet" ? "📱" : "📲"} {v}
              </button>
            ))}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={() => setPreviewTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-semibold text-muted-custom hover:text-cream transition-colors cursor-pointer"
          >
            {previewTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* Publish Toggle */}
          <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-custom cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-orange-500"
            />
            Publish
          </label>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !title || !metaDescription}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <IconCheck size={14} />
            {submitting ? "Saving..." : editingId ? "Update" : "Publish"}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <IconX size={18} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <IconAlertCircle size={14} className="text-red-400 shrink-0" />
          {error}
        </div>
      )}

      {/* ─── Split Pane Container ───────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ════════════════════════════════════════════
            LEFT PANE: Meta + Editor
            ════════════════════════════════════════════ */}
        <div className="w-1/2 flex flex-col border-r border-white/[0.08] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {/* ─── SEO Meta Fields ────────────────────── */}
          <div className="p-4 space-y-3 border-b border-white/[0.06] bg-[#0a0c0e]/60">
            {/* Title */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-cream/80">
                  Search Headline
                </label>
                <span className={`text-[10px] ${title.length > 60 ? "text-amber-400" : "text-muted-custom/50"}`}>
                  {title.length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                placeholder="CBSE Class 10 Science Chapter 10 Light Reflection Notes"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/50 text-xs focus:outline-none focus:border-orange-500/60"
              />
            </div>

            {/* Slug */}
            <div className="flex items-center rounded-lg bg-navy-mid/70 border border-white/10 px-3 py-1">
              <span className="text-[10px] text-muted-custom/50 font-mono">/resources/</span>
              <input
                type="text"
                placeholder="auto-generated-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 py-1 px-1 bg-transparent text-cream placeholder:text-muted-custom/50 text-[11px] focus:outline-none font-mono"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-cream/80">
                  Meta Description
                </label>
                <span
                  className={`text-[10px] ${metaDescription.length > 160 ? "text-amber-400" : "text-muted-custom/50"}`}
                >
                  {metaDescription.length}/160
                </span>
              </div>
              <textarea
                maxLength={160}
                rows={2}
                placeholder="Free study notes with solved questions and formulas for CBSE Class 10 Science Light chapter."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/50 text-xs focus:outline-none focus:border-orange-500/60 resize-none"
              />
            </div>

            {/* Class, Subject, Type, Chapter */}
            <div className="grid grid-cols-4 gap-2">
              <CustomSelect
                label="Class"
                options={classOptions}
                value={targetClass}
                onChange={setTargetClass}
              />
              <CustomSelect
                label="Subject"
                options={subjectOptions}
                value={subject}
                onChange={setSubject}
              />
              <CustomSelect
                label="Type"
                options={RESOURCE_TYPES}
                value={resourceType}
                onChange={handleResourceTypeChange}
              />
              <div className="space-y-1">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-cream/80 mb-1">
                  Chapter
                </label>
                <input
                  type="text"
                  placeholder="Ch. 10"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream placeholder:text-muted-custom/50 text-[11px] focus:outline-none focus:border-orange-500/60"
                />
              </div>
            </div>

            {/* Keywords */}
            <input
              type="text"
              placeholder="Keywords: cbse class 10 science notes, light chapter, physics formulas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream placeholder:text-muted-custom/50 text-xs focus:outline-none focus:border-orange-500/60"
            />
          </div>

          {/* ─── Block Mode Editor ─────────────────── */}
          {editorMode === "blocks" ? (
            <div className="flex-1 p-4 space-y-3">
              {/* Component Palette */}
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                {BLOCK_PALETTE.map((item) => (
                  <button
                    key={item.type}
                    draggable
                    onDragStart={(e) => handlePaletteDragStart(e, item.type)}
                    onDragEnd={handleDragEnd}
                    onClick={() => addBlock(item.type)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-semibold text-muted-custom hover:text-cream hover:bg-white/[0.06] hover:border-orange-500/30 active:scale-95 transition-all cursor-grab active:cursor-grabbing"
                    title={`${item.description} (Click to add or drag into layout)`}
                  >
                    <span className="text-orange-400 font-mono text-[11px]">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Block Canvas */}
              {blocks.length === 0 ? (
                <div
                  onDragOver={(e) => handleBlockDragOver(e, 0)}
                  onDrop={(e) => handleBlockDrop(e, 0)}
                  className={`flex items-center justify-center h-32 rounded-xl border border-dashed text-xs transition-colors ${
                    dragOverIndex === 0
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-white/10 text-muted-custom"
                  }`}
                >
                  Click a component above or drag one here to start building
                </div>
              ) : (
                <div className="space-y-2">
                  {blocks.map((block, idx) => (
                    <BlockEditor
                      key={block.id}
                      block={block}
                      index={idx}
                      total={blocks.length}
                      isDragOver={dragOverIndex === idx}
                      isDragging={draggedBlockIndex === idx}
                      onUpdate={updateBlock}
                      onRemove={removeBlock}
                      onMove={moveBlock}
                      onDuplicate={duplicateBlock}
                      onDragStart={handleBlockDragStart}
                      onDragOver={handleBlockDragOver}
                      onDrop={handleBlockDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}

                  {/* Append / Drop Target */}
                  <div
                    onDragOver={(e) => handleBlockDragOver(e, blocks.length)}
                    onDrop={(e) => handleBlockDrop(e, blocks.length)}
                    className={`p-2.5 rounded-xl border border-dashed text-center text-[11px] font-medium transition-colors ${
                      dragOverIndex === blocks.length
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-white/10 text-muted-custom/40 hover:border-white/20"
                    }`}
                  >
                    + Drop component here or click palette to add at end
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─── Raw Code Mode ──────────────────── */
            <div className="flex-1 p-4">
              <textarea
                value={rawCode}
                onChange={(e) => setRawCode(e.target.value)}
                className="w-full h-full min-h-[400px] px-4 py-3 rounded-xl bg-[#07090b] border border-white/10 text-[#38bdf8] text-xs font-mono leading-relaxed focus:outline-none focus:border-orange-500/40 resize-none scrollbar-thin scrollbar-thumb-white/10"
                placeholder="<!-- Paste or write raw HTML here -->"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════
            RIGHT PANE: Live Preview
            ════════════════════════════════════════════ */}
        <div className="w-1/2 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 bg-[#0f1318]">
          {/* SERP Preview */}
          <div className="p-4 border-b border-white/[0.06]">
            <SerpPreview title={title} slug={slug} metaDescription={metaDescription} />
          </div>

          {/* Live Article Preview */}
          <div className="flex-1 p-4 flex justify-center">
            <div
              ref={previewRef}
              style={{
                width: VIEWPORT_WIDTHS[viewport],
                maxWidth: "100%",
                transition: "width 0.3s ease",
              }}
              className={`rounded-xl border overflow-hidden ${
                previewTheme === "light"
                  ? "bg-[#f8fafc] text-slate-900 border-slate-200"
                  : "bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-[#f5f0e8] border-white/10"
              }`}
            >
              {/* Article Header Preview */}
              <div
                className={`px-6 py-5 border-b ${
                  previewTheme === "light" ? "border-slate-100" : "border-white/[0.06]"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-[0.12em] text-orange-500 mb-2">
                  {board} • Class {targetClass} {subject}
                </div>
                <h1
                  className={`text-lg font-bold leading-snug ${
                    previewTheme === "light" ? "text-slate-900" : "text-[#f5f0e8]"
                  }`}
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  {title || "Your Resource Title"}
                </h1>
                {chapter && (
                  <p className={`text-xs mt-1 ${previewTheme === "light" ? "text-slate-500" : "text-[#8b8b8b]"}`}>
                    {chapter}
                  </p>
                )}
              </div>

              {/* Article Content */}
              <div
                className={`resource-content-area px-6 py-5 text-sm leading-relaxed ${
                  previewTheme === "light" ? "text-slate-700" : "text-[#c8c8c8]"
                }`}
                dangerouslySetInnerHTML={{ __html: sanitizePreviewHtml(compiledHtml) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Preview theme styles ──────────────────── */}
      <PreviewStyles theme={previewTheme} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// BLOCK EDITOR COMPONENT
// ═══════════════════════════════════════════════════════

interface BlockEditorProps {
  block: ContentBlock
  index: number
  total: number
  isDragOver?: boolean
  isDragging?: boolean
  onUpdate: (id: string, updates: any) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onDuplicate: (id: string) => void
  onDragStart?: (e: React.DragEvent, index: number) => void
  onDragOver?: (e: React.DragEvent, index: number) => void
  onDrop?: (e: React.DragEvent, index: number) => void
  onDragEnd?: () => void
}

function BlockEditor({
  block,
  index,
  total,
  isDragOver,
  isDragging,
  onUpdate,
  onRemove,
  onMove,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: BlockEditorProps) {
  const palette = BLOCK_PALETTE.find((p) => p.type === block.type)

  return (
    <div
      onDragOver={(e) => onDragOver?.(e, index)}
      onDrop={(e) => onDrop?.(e, index)}
      className={`rounded-xl border transition-all duration-150 overflow-hidden group ${
        isDragOver
          ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10 scale-[1.01]"
          : isDragging
          ? "opacity-30 border-dashed border-white/20"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {/* Visual Drag Handle */}
          <div
            draggable
            onDragStart={(e) => onDragStart?.(e, index)}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing text-muted-custom/40 hover:text-orange-400 select-none p-0.5 rounded transition-colors"
            title="Drag to reorder block"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="2" />
              <circle cx="9" cy="12" r="2" />
              <circle cx="9" cy="18" r="2" />
              <circle cx="15" cy="6" r="2" />
              <circle cx="15" cy="12" r="2" />
              <circle cx="15" cy="18" r="2" />
            </svg>
          </div>
          <span className="text-orange-400 font-mono text-[11px] font-bold">{palette?.icon}</span>
          <span className="text-[10px] font-semibold text-cream/70 uppercase tracking-wider">
            {palette?.label}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMove(block.id, "up")}
            disabled={index === 0}
            className="p-1 text-muted-custom hover:text-cream disabled:opacity-20 cursor-pointer text-[10px]"
            title="Move up"
          >
            ▲
          </button>
          <button
            onClick={() => onMove(block.id, "down")}
            disabled={index === total - 1}
            className="p-1 text-muted-custom hover:text-cream disabled:opacity-20 cursor-pointer text-[10px]"
            title="Move down"
          >
            ▼
          </button>
          <button
            onClick={() => onDuplicate(block.id)}
            className="p-1 text-muted-custom hover:text-cream cursor-pointer text-[10px]"
            title="Duplicate"
          >
            ⧉
          </button>
          <button
            onClick={() => onRemove(block.id)}
            className="p-1 text-red-400/70 hover:text-red-400 cursor-pointer text-[10px]"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Block Body */}
      <div className="p-3 space-y-2">
        {block.type === "heading" && (
          <HeadingEditor block={block as HeadingBlock} onUpdate={onUpdate} />
        )}
        {block.type === "paragraph" && (
          <ParagraphEditor block={block as ParagraphBlock} onUpdate={onUpdate} />
        )}
        {block.type === "question_card" && (
          <QuestionEditor block={block as QuestionBlock} onUpdate={onUpdate} />
        )}
        {block.type === "code_box" && (
          <CodeEditor block={block as CodeBlock} onUpdate={onUpdate} />
        )}
        {block.type === "formula_callout" && (
          <FormulaEditor block={block as FormulaBlock} onUpdate={onUpdate} />
        )}
        {block.type === "concept_callout" && (
          <ConceptEditor block={block as ConceptBlock} onUpdate={onUpdate} />
        )}
        {block.type === "table" && (
          <TableEditor block={block as TableBlock} onUpdate={onUpdate} />
        )}
        {block.type === "toc" && (
          <div className="text-[10px] text-muted-custom italic">
            📑 Auto-generated from heading blocks. No configuration needed.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Individual Block Editors ─────────────────────────

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream placeholder:text-muted-custom/50 text-xs focus:outline-none focus:border-orange-500/60"
const textareaClass =
  "w-full px-3 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream placeholder:text-muted-custom/50 text-xs focus:outline-none focus:border-orange-500/60 resize-none"
const monoTextareaClass =
  "w-full px-3 py-2 rounded-lg bg-[#07090b] border border-white/10 text-[#38bdf8] text-xs font-mono leading-relaxed focus:outline-none focus:border-orange-500/60 resize-none"

function HeadingEditor({ block, onUpdate }: { block: HeadingBlock; onUpdate: (id: string, u: Partial<HeadingBlock>) => void }) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={block.level}
        onChange={(e) => onUpdate(block.id, { level: Number(e.target.value) as 2 | 3 | 4 })}
        className="px-2 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream text-xs focus:outline-none cursor-pointer"
      >
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
      </select>
      <input
        type="text"
        placeholder="Section heading..."
        value={block.text}
        onChange={(e) => onUpdate(block.id, { text: e.target.value })}
        className={`flex-1 ${inputClass}`}
      />
    </div>
  )
}

function ParagraphEditor({ block, onUpdate }: { block: ParagraphBlock; onUpdate: (id: string, u: Partial<ParagraphBlock>) => void }) {
  return (
    <textarea
      rows={4}
      placeholder="Write content here... Supports HTML: <strong>, <em>, <code>, <ul>, <ol>, <li>, <a href>, <p>"
      value={block.html}
      onChange={(e) => onUpdate(block.id, { html: e.target.value })}
      className={`${monoTextareaClass} min-h-[100px]`}
    />
  )
}

function QuestionEditor({ block, onUpdate }: { block: QuestionBlock; onUpdate: (id: string, u: Partial<QuestionBlock>) => void }) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Badge: CBSE 2025 • 3 Marks"
        value={block.badge}
        onChange={(e) => onUpdate(block.id, { badge: e.target.value })}
        className={inputClass}
      />
      <textarea
        rows={2}
        placeholder="Question text..."
        value={block.question}
        onChange={(e) => onUpdate(block.id, { question: e.target.value })}
        className={textareaClass}
      />
      <div>
        <label className="text-[10px] font-semibold text-green-400/80 uppercase tracking-wider mb-1 block">
          ✓ Solution (HTML)
        </label>
        <textarea
          rows={5}
          placeholder="<p><strong>Step 1:</strong> ...</p>&#10;<p><strong>Step 2:</strong> ...</p>"
          value={block.solution}
          onChange={(e) => onUpdate(block.id, { solution: e.target.value })}
          className={`${monoTextareaClass} min-h-[120px]`}
        />
      </div>
    </div>
  )
}

function CodeEditor({ block, onUpdate }: { block: CodeBlock; onUpdate: (id: string, u: Partial<CodeBlock>) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={block.language}
          onChange={(e) => onUpdate(block.id, { language: e.target.value })}
          className="px-2 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream text-xs focus:outline-none cursor-pointer"
        >
          {["Python", "Java", "C++", "C", "JavaScript", "HTML", "CSS", "SQL", "Pseudocode"].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Caption (optional): e.g. Python Implementation"
          value={block.caption}
          onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
          className={`flex-1 ${inputClass}`}
        />
      </div>
      <textarea
        rows={8}
        placeholder="Paste or type your code here..."
        value={block.code}
        onChange={(e) => onUpdate(block.id, { code: e.target.value })}
        className={`${monoTextareaClass} min-h-[160px]`}
        spellCheck={false}
      />
    </div>
  )
}

function FormulaEditor({ block, onUpdate }: { block: FormulaBlock; onUpdate: (id: string, u: Partial<FormulaBlock>) => void }) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Title: Key Formula"
        value={block.title}
        onChange={(e) => onUpdate(block.id, { title: e.target.value })}
        className={inputClass}
      />
      <textarea
        rows={3}
        placeholder="<p><code>F = ma</code></p>&#10;<p>Where F = Force, m = mass, a = acceleration</p>"
        value={block.content}
        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
        className={`${monoTextareaClass} min-h-[80px]`}
      />
    </div>
  )
}

function ConceptEditor({ block, onUpdate }: { block: ConceptBlock; onUpdate: (id: string, u: Partial<ConceptBlock>) => void }) {
  return (
    <div className="space-y-2">
      <select
        value={block.title}
        onChange={(e) => onUpdate(block.id, { title: e.target.value })}
        className="px-2 py-2 rounded-lg bg-navy-mid/70 border border-white/10 text-cream text-xs focus:outline-none cursor-pointer"
      >
        {["Exam Pro-Tip", "Board Important", "Common Mistake", "Remember This", "Caution"].map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <textarea
        rows={3}
        placeholder="<p>This concept frequently appears in CBSE boards...</p>"
        value={block.content}
        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
        className={`${monoTextareaClass} min-h-[80px]`}
      />
    </div>
  )
}

function TableEditor({ block, onUpdate }: { block: TableBlock; onUpdate: (id: string, u: Partial<TableBlock>) => void }) {
  const addColumn = () => {
    onUpdate(block.id, {
      headers: [...block.headers, `Column ${block.headers.length + 1}`],
      rows: block.rows.map((r) => [...r, ""]),
    })
  }

  const addRow = () => {
    onUpdate(block.id, {
      rows: [...block.rows, new Array(block.headers.length).fill("")],
    })
  }

  const updateHeader = (idx: number, val: string) => {
    const next = [...block.headers]
    next[idx] = val
    onUpdate(block.id, { headers: next })
  }

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const next = block.rows.map((r) => [...r])
    next[rowIdx][colIdx] = val
    onUpdate(block.id, { rows: next })
  }

  const removeRow = (rowIdx: number) => {
    onUpdate(block.id, { rows: block.rows.filter((_, i) => i !== rowIdx) })
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Table caption (optional)"
        value={block.caption}
        onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
        className={inputClass}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} className="p-1">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-navy-mid/70 border border-white/10 text-cream text-[11px] font-semibold focus:outline-none focus:border-orange-500/60"
                  />
                </th>
              ))}
              <th className="p-1 w-8" />
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-navy-mid/70 border border-white/10 text-cream text-[11px] focus:outline-none focus:border-orange-500/60"
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    onClick={() => removeRow(ri)}
                    className="text-red-400/60 hover:text-red-400 text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button
          onClick={addRow}
          className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
        >
          + Add Row
        </button>
        <button
          onClick={addColumn}
          className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
        >
          + Add Column
        </button>
      </div>
    </div>
  )
}

// ─── Preview Styles (injected into the preview pane) ──

function PreviewStyles({ theme }: { theme: "dark" | "light" }) {
  const isLight = theme === "light"
  return (
    <style jsx global>{`
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
        border-bottom: 1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.1)"};
      }
      .resource-content-area td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid ${isLight ? "#f1f5f9" : "rgba(255,255,255,0.04)"};
      }
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
      }
      .toc-link:hover {
        color: #f97316;
        text-decoration: underline;
      }
      .qa-card {
        border-radius: 1rem;
        margin: 1.75rem 0;
        overflow: hidden;
        border: 1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.08)"};
        box-shadow: ${isLight ? "0 4px 6px -1px rgba(0,0,0,0.05)" : "0 10px 15px -3px rgba(0,0,0,0.3)"};
      }
      .qa-question {
        background-color: ${isLight ? "#f8fafc" : "rgba(255,255,255,0.03)"};
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid ${isLight ? "#e2e8f0" : "rgba(255,255,255,0.06)"};
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
        background-color: ${isLight ? "#dcfce7" : "rgba(16,185,129,0.15)"};
        color: ${isLight ? "#166534" : "#34d399"};
        border: 1px solid ${isLight ? "#bbf7d0" : "rgba(16,185,129,0.3)"};
        margin-bottom: 0.75rem;
      }
      .resource-content-area pre,
      .program-box {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
        line-height: 1.7;
        border-radius: 0.875rem;
        padding: 1.25rem 1.5rem;
        margin: 1.25rem 0;
        overflow-x: auto;
        white-space: pre-wrap !important;
        word-break: break-word;
        background-color: ${isLight ? "#0f172a" : "#07090b"};
        color: ${isLight ? "#38bdf8" : "#38bdf8"};
        border: 1px solid ${isLight ? "#1e293b" : "rgba(255,255,255,0.14)"};
      }
      .reaction-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #f97316;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .resource-content-area code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        background-color: ${isLight ? "#f1f5f9" : "rgba(255,255,255,0.08)"};
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
      .formula-callout {
        background: ${isLight ? "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)" : "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.08) 100%)"};
        border: 1px solid ${isLight ? "#bfdbfe" : "rgba(59,130,246,0.3)"};
        border-left: 4px solid #3b82f6;
        border-radius: 0.75rem;
        padding: 1rem 1.25rem;
        margin: 1.25rem 0;
      }
      .concept-callout {
        background: ${isLight ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)" : "rgba(245,158,11,0.08)"};
        border: 1px solid ${isLight ? "#fde68a" : "rgba(245,158,11,0.25)"};
        border-left: 4px solid #f59e0b;
        border-radius: 0.75rem;
        padding: 1rem 1.25rem;
        margin: 1.25rem 0;
      }
    `}</style>
  )
}
