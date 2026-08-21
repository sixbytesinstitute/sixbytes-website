import type { ReactNode } from "react"
import RevealWrapper from "./reveal-wrapper"

interface SectionHeaderProps {
  label: string
  title: string
  highlightedWord?: string
  subtitle?: string | ReactNode
  align?: "center" | "left"
  className?: string
}

export default function SectionHeader({
  label,
  title,
  highlightedWord,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const isCentered = align === "center"

  // Split or append highlightedWord properly
  let titleContent: ReactNode = title
  if (highlightedWord) {
    if (title.includes(highlightedWord)) {
      const parts = title.split(highlightedWord)
      titleContent = (
        <>
          {parts[0]}
          <span className="text-gradient-orange italic">{highlightedWord}</span>
          {parts[1]}
        </>
      )
    } else {
      titleContent = (
        <>
          {title}{" "}
          <span className="text-gradient-orange italic">{highlightedWord}</span>
        </>
      )
    }
  }

  return (
    <div
      className={`mb-8 md:mb-12 ${
        isCentered ? "text-center mx-auto max-w-3xl" : "text-left max-w-2xl"
      } ${className}`}
    >
      <RevealWrapper delay={0}>
        <div
          className={`inline-flex items-center gap-2 mb-2.5 ${
            isCentered ? "justify-center" : "justify-start"
          }`}
        >
          <span className="orange-rule" />
          <span className="section-label">{label}</span>
          {isCentered && <span className="orange-rule scale-x-[-1]" />}
        </div>
      </RevealWrapper>

      <RevealWrapper delay={100}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-cream tracking-tight leading-tight">
          {titleContent}
        </h2>
      </RevealWrapper>

      {subtitle && (
        <RevealWrapper delay={200}>
          <p className="mt-3 text-sm sm:text-base text-muted-custom font-sans leading-relaxed">
            {subtitle}
          </p>
        </RevealWrapper>
      )}
    </div>
  )
}
