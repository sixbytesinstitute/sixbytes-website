import type { ReactNode } from "react"

interface TagPillProps {
  children: ReactNode
  variant?: "orange" | "navy" | "outline"
  className?: string
  icon?: ReactNode
}

export default function TagPill({
  children,
  variant = "orange",
  className = "",
  icon,
}: TagPillProps) {
  const variantClasses = {
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    navy: "bg-white/5 text-gray-300 border-white/10",
    outline: "bg-transparent text-cream border-white/20",
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border tracking-wide uppercase ${variantClasses} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
