"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBity,
  IconSparkles,
  IconX,
  IconSend,
  IconBookOpen,
  IconAlertCircle,
  IconGraduationCap,
} from "@/app/components/ui/icons"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface TutorWidgetProps {
  resourceSlug?: string
  resourceTitle?: string
}

interface Position {
  x: number
  y: number
}

function renderMessageContent(text: string) {
  if (!text) return null
  const lines = text.split("\n")

  return lines.map((line, lineIdx) => {
    const isBullet = /^[\*\-]\s+/.test(line)
    const cleanedLine = isBullet ? line.replace(/^[\*\-]\s+/, "") : line

    const parts: React.ReactNode[] = []
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
    let lastIdx = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(cleanedLine)) !== null) {
      if (match.index > lastIdx) {
        parts.push(cleanedLine.substring(lastIdx, match.index))
      }
      const token = match[0]
      if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={`${lineIdx}-${match.index}`} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        )
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={`${lineIdx}-${match.index}`} className="italic text-cream/90">
            {token.slice(1, -1)}
          </em>
        )
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={`${lineIdx}-${match.index}`}
            className="px-1.5 py-0.5 rounded bg-white/10 text-orange-300 font-mono text-[11px]"
          >
            {token.slice(1, -1)}
          </code>
        )
      }
      lastIdx = regex.lastIndex
    }

    if (lastIdx < cleanedLine.length) {
      parts.push(cleanedLine.substring(lastIdx))
    }

    return (
      <span key={lineIdx} className={isBullet ? "block pl-3 relative" : "block min-h-[1.1em]"}>
        {isBullet && <span className="absolute left-0 text-orange-400 font-bold">•</span>}
        {parts.length > 0 ? parts : null}
      </span>
    )
  })
}

export function TutorWidget({ resourceSlug, resourceTitle }: TutorWidgetProps) {
  const pathname = usePathname()
  const activeSlug =
    resourceSlug ||
    (pathname?.startsWith("/resources/") && !pathname.endsWith("/resources")
      ? pathname.replace("/resources/", "").split("/")[0]
      : undefined)

  // Determine user-friendly page context for the current opened webpage
  const getPageLabel = () => {
    if (resourceTitle) return resourceTitle
    if (!pathname || pathname === "/") return "SixBytes Institute • Home"
    if (pathname === "/courses") return "Courses & Batches"
    if (pathname === "/about") return "About SixBytes Institute"
    if (pathname === "/results") return "Results & Achievements"
    if (pathname === "/contact") return "Admissions & Inquiries"
    if (pathname === "/resources") return "Academic Library"
    if (pathname === "/dashboard") return "Student Portal • Dashboard"
    if (pathname.startsWith("/admin/users")) return "Admin Portal • User Directory"
    if (pathname.startsWith("/admin/resources")) return "Admin Portal • Resource Studio"
    if (pathname.startsWith("/admin")) return "Admin Portal • Management"
    if (pathname.startsWith("/faculty")) return "Faculty Portal"
    if (pathname.startsWith("/manager")) return "Manager Portal"
    return typeof document !== "undefined" ? document.title.split("|")[0].trim() : pathname
  }
  const activePageLabel = getPageLabel()

  const STORAGE_KEY = "sixbytes_bity_chat_history"

  const defaultWelcome: Message = {
    id: "welcome",
    role: "assistant",
    content: `Greetings! I am **Bity**, your SixBytes AI companion.`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([defaultWelcome])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isStaff, setIsStaff] = useState(false)
  const [limitNotice, setLimitNotice] = useState<string | null>(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Message[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch { }
  }, [])

  // Save chat history to localStorage on every update (skip initial mount)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch { }
  }, [messages])

  const clearChat = () => {
    setMessages([defaultWelcome])
    setLimitNotice(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch { }
  }

  // Floating draggable launcher position
  const [position, setPosition] = useState<Position>({ x: -1, y: -1 })
  const [isDragging, setIsDragging] = useState(false)
  const positionRef = useRef<Position>({ x: -1, y: -1 })
  positionRef.current = position

  const dragInfoRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize position on mount (bottom-right default)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem("sixbytes_bity_pos") || localStorage.getItem("sixbytes_synapse_pos")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          typeof parsed.x === "number" &&
          typeof parsed.y === "number" &&
          parsed.x >= 0 &&
          parsed.y >= 0 &&
          parsed.x <= window.innerWidth - 64 &&
          parsed.y <= window.innerHeight - 64
        ) {
          setPosition(parsed)
          return
        }
      }
    } catch { }

    // Default: bottom-right with 28px margin
    const defaultX = Math.max(16, window.innerWidth - 80)
    const defaultY = Math.max(16, window.innerHeight - 88)
    setPosition({ x: defaultX, y: defaultY })
  }, [])

  // Window resize bounds handler
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (prev.x === -1) return prev
        const btnSize = 56
        const maxX = Math.max(16, window.innerWidth - btnSize - 16)
        const maxY = Math.max(16, window.innerHeight - btnSize - 16)
        return {
          x: Math.min(Math.max(16, prev.x), maxX),
          y: Math.min(Math.max(16, prev.y), maxY),
        }
      })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Drag handlers using window pointer listeners (smooth, never drops events)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button or touch
    if (e.button !== 0 && e.pointerType === "mouse") return

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: positionRef.current.x,
      initialY: positionRef.current.y,
      hasMoved: false,
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragInfoRef.current.startX
      const deltaY = moveEvent.clientY - dragInfoRef.current.startY

      if (!dragInfoRef.current.hasMoved && Math.hypot(deltaX, deltaY) > 5) {
        dragInfoRef.current.hasMoved = true
        setIsDragging(true)
      }

      if (dragInfoRef.current.hasMoved) {
        const btnSize = 56
        const minMargin = 16
        const maxX = window.innerWidth - btnSize - minMargin
        const maxY = window.innerHeight - btnSize - minMargin

        const nextX = Math.min(Math.max(minMargin, dragInfoRef.current.initialX + deltaX), maxX)
        const nextY = Math.min(Math.max(minMargin, dragInfoRef.current.initialY + deltaY), maxY)

        setPosition({ x: nextX, y: nextY })
      }
    }

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)

      setIsDragging(false)

      if (dragInfoRef.current.hasMoved) {
        try {
          localStorage.setItem("sixbytes_bity_pos", JSON.stringify(positionRef.current))
        } catch { }
      } else {
        // Clean click / tap toggle
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput("")
    setIsLoading(true)
    setLimitNotice(null)

    try {
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          resourceSlug: activeSlug,
          pathname: pathname || (typeof window !== "undefined" ? window.location.pathname : ""),
          pageTitle: typeof document !== "undefined" ? document.title : "",
          history: historyPayload,
        }),
      })

      let data: any
      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        data = await res.json()
      } else {
        const textResp = await res.text()
        console.error("[Bity Non-JSON Response]", res.status, textResp.slice(0, 150))
        throw new Error(
          res.status === 404
            ? "Bity is currently reconnecting. Please retry in a few moments."
            : "Connection error with Bity. Please retry."
        )
      }

      if (!res.ok) {
        if (res.status === 429) {
          setLimitNotice(data.error || "Daily limit reached.")
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `**Quota Reached**: ${data.error || "Daily question allocation reached."}\n\nReview what you explored today or explore our courses for extended coaching.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ])
          return
        }
        throw new Error(data.error || "Failed to reach Bity")
      }

      setRemaining(data.remaining)
      setIsEnrolled(data.isEnrolled)
      if (data.isStaff) setIsStaff(true)

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: unknown) {
      const error = err as Error
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `${error.message || "Connection timeout with Bity. Please retry in a moment."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    "How do I add SEO articles?",
    "Tell me about SixBytes",
    "Help me with a concept",
  ]

  // Compute smart position for modal (relative to button)
  const isButtonOnRight = position.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 500)
  const isButtonOnBottom = position.y > (typeof window !== "undefined" ? window.innerHeight / 2 : 400)

  return (
    <>
      {/* Small Circular Draggable Launcher Button */}
      {position.x >= 0 && (
        <div
          data-tutor-launcher="true"
          onPointerDown={handlePointerDown}
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: "none",
            zIndex: 60,
          }}
          className="select-none"
        >
          <button
            type="button"
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 select-none shadow-xl ${isDragging ? "cursor-grabbing scale-105" : "cursor-grab hover:scale-105 active:scale-95"
              } ${isOpen
                ? "bg-orange-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.45)] ring-2 ring-orange-400"
                : "bg-[#141A1F] border border-white/10 text-orange-400 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(249,115,22,0.18)] hover:border-orange-500/50 hover:shadow-[0_14px_35px_rgba(0,0,0,0.8),0_0_28px_rgba(249,115,22,0.3)]"
              }`}
            aria-label="Open Bity Socratic AI"
            title="Drag anywhere or click to chat with Bity"
          >
            {/* Soft Warm Glow Ring */}
            <span className="absolute -inset-1 rounded-full bg-orange-500/10 blur-sm pointer-events-none -z-10" />

            {/* Bot Icon */}
            <div className="relative flex items-center justify-center">
              {isOpen ? (
                <IconX size={20} className="text-white" />
              ) : (
                <IconBity size={24} className="text-orange-400 drop-shadow-[0_2px_8px_rgba(249,115,22,0.4)]" />
              )}
            </div>

            {/* Active ready indicator badge */}
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-[#141A1F]"></span>
            </span>
          </button>
        </div>
      )}

      {/* Bity Chat Panel (Refined Obsidian / Cream Institute Theme) */}
      {isOpen && (
        <div
          className={`fixed z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[86vh] bg-[#0E1318]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(249,115,22,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isButtonOnRight ? "right-4 sm:right-6" : "left-4 sm:left-6"
            } ${isButtonOnBottom ? "bottom-20 sm:bottom-24" : "top-20 sm:top-24"
            }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#141A1F] border-b border-white/[0.08] text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-sm">
                <IconBity size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-cream font-display leading-none">
                    Bity
                  </h3>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/25">
                    SixBytes AI
                  </span>
                </div>
                <p className="text-[11px] text-muted-custom flex items-center gap-1.5 mt-1 leading-tight">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {isStaff
                    ? "Staff Access • Unlimited"
                    : isEnrolled
                      ? remaining !== null
                        ? `Enrolled Tier • ${remaining}/40 questions left today`
                        : "Enrolled Student Access"
                      : remaining !== null
                        ? `Daily Quota: ${remaining} questions left`
                        : "Your SixBytes AI companion"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="text-[10px] px-2 py-1 rounded-md hover:bg-white/10 text-muted-custom hover:text-orange-300 transition-colors cursor-pointer"
                aria-label="Clear chat history"
                title="Clear chat"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-custom hover:text-white transition-colors cursor-pointer"
                aria-label="Close Bity"
              >
                <IconX size={18} />
              </button>
            </div>
          </div>

          {/* Current Webpage / Study Context Pill */}
          <div className="px-4 py-2 bg-[#141A1F]/80 border-b border-white/[0.06] text-[11px] text-orange-300/90 flex items-center gap-2">
            <IconBookOpen size={13} className="text-orange-400 shrink-0" />
            <span className="truncate">
              Context: <strong className="text-cream">{activePageLabel}</strong>
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0A0C0E] to-[#0E1318]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words ${m.role === "user"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-sm shadow font-medium"
                      : "bg-[#141A1F] text-cream border border-white/[0.08] rounded-bl-sm shadow-sm font-normal"
                    }`}
                >
                  {renderMessageContent(m.content)}
                </div>
                <span className="text-[10px] text-dim-custom mt-1 px-1 tracking-tight">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3.5 bg-[#141A1F] border border-orange-500/20 rounded-2xl max-w-[75%] shadow-sm">
                <IconBity size={16} className="text-orange-400 animate-spin" />
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-cream/80 font-medium">
                  Bity is thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 pt-2.5 pb-2 bg-[#0E1318] border-t border-white/[0.06] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                className="whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-orange-500/10 text-cream/80 hover:text-orange-300 border border-white/[0.08] hover:border-orange-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <IconSparkles size={11} className="text-orange-400" />
                {chip}
              </button>
            ))}
          </div>

          {/* Limit Notice / Quota Upgrade Banner — hidden for staff */}
          {limitNotice && !isStaff && (
            <div className="p-3 bg-amber-500/10 border-t border-amber-500/25 text-xs text-amber-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <IconAlertCircle size={15} className="text-amber-400 shrink-0" />
                <span className="truncate">Daily allocation reached.</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href="/login"
                  className="font-semibold text-orange-300 hover:underline text-[11px]"
                >
                  Free Account
                </Link>
                <span className="text-white/20">•</span>
                <Link
                  href="/contact"
                  className="font-semibold text-amber-300 hover:underline text-[11px] flex items-center gap-1"
                >
                  <IconGraduationCap size={12} />
                  Enroll
                </Link>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-[#0B0F13] border-t border-white/[0.08] flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask Bity anything..."
              disabled={isLoading}
              maxLength={600}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-cream placeholder:text-muted-custom focus:outline-none focus:ring-1 focus:ring-orange-500/60 focus:border-orange-500/60 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-3.5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send query"
            >
              <IconSend size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
