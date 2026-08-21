"use client"

import { useState } from "react"
import GlassCard from "./glass-card"

interface FAQItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <GlassCard
      padding="none"
      hoverEffect={false}
      className={`border transition-colors ${
        isOpen ? "border-orange-500/40 bg-navy-mid" : "border-white/10 hover:border-white/20"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-sans font-semibold text-base md:text-lg text-cream">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isOpen
              ? "bg-orange-500 text-white border-orange-400 rotate-180"
              : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
          }`}
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 md:px-6 md:pb-6 text-muted-custom font-sans text-sm md:text-base leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </GlassCard>
  )
}
