import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
  padding?: "none" | "sm" | "md" | "lg"
  as?: keyof HTMLElementTagNameMap
}

export default function GlassCard({
  children,
  className = "",
  hoverEffect = true,
  padding = "md",
  as: Component = "div",
}: GlassCardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4 md:p-5",
    md: "p-6 md:p-8",
    lg: "p-8 md:p-10",
  }[padding]

  const ComponentTag = Component as any

  return (
    <ComponentTag
      className={`glass-card ${hoverEffect ? "glass-card-hover" : ""} ${paddingClasses} ${className}`}
    >
      {children}
    </ComponentTag>
  )
}
