import Link from "next/link"
import type { ReactNode } from "react"

interface CTAButtonProps {
  href?: string
  onClick?: () => void
  children: ReactNode
  variant?: "filled" | "outline"
  icon?: ReactNode
  iconPosition?: "left" | "right"
  target?: string
  rel?: string
  className?: string
  type?: "button" | "submit" | "reset"
  ariaLabel?: string
}

export default function CTAButton({
  href,
  onClick,
  children,
  variant = "filled",
  icon,
  iconPosition = "right",
  target,
  rel,
  className = "",
  type = "button",
  ariaLabel,
}: CTAButtonProps) {
  const baseClasses = variant === "filled" ? "btn-orange" : "btn-outline"

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  )

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("https://wa.me")
    if (isExternal) {
      return (
        <a
          href={href}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
          className={`${baseClasses} ${className}`}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      )
    }

    return (
      <Link href={href} className={`${baseClasses} ${className}`} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}
