import type { ReactNode } from "react"

export type IconName =
  | "compass"
  | "atom"
  | "shield"
  | "medal"
  | "brain"
  | "users"
  | "chart"
  | "target"
  | "handshake"
  | "trophy"
  | "crown"
  | "clock"
  | "map-pin"
  | "phone"
  | "chat"
  | "whatsapp"
  | "sparkles"
  | "book"
  | "check"
  | "arrow-right"
  | "star"

interface PremiumIconProps {
  name: IconName
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "orange" | "gold" | "silver" | "subtle"
  className?: string
}

export default function PremiumIcon({
  name,
  size = "md",
  variant = "orange",
  className = "",
}: PremiumIconProps) {
  const sizeMap = {
    xs: { container: "w-6 h-6 rounded-md", icon: "w-3.5 h-3.5" },
    sm: { container: "w-8 h-8 rounded-lg", icon: "w-4 h-4" },
    md: { container: "w-11 h-11 rounded-xl", icon: "w-5 h-5" },
    lg: { container: "w-14 h-14 rounded-2xl", icon: "w-7 h-7" },
    xl: { container: "w-16 h-16 rounded-2xl", icon: "w-8 h-8" },
  }[size]

  // Clean, premium, subtle styles — no heavy neon glows
  const variantStyles = {
    orange: {
      bg: "bg-orange-500/[0.08]",
      border: "border-orange-500/20",
      text: "text-orange-400",
    },
    gold: {
      bg: "bg-amber-500/[0.08]",
      border: "border-amber-500/20",
      text: "text-amber-300",
    },
    silver: {
      bg: "bg-white/[0.04]",
      border: "border-white/10",
      text: "text-cream",
    },
    subtle: {
      bg: "bg-white/[0.03]",
      border: "border-white/[0.08]",
      text: "text-muted-custom",
    },
  }[variant]

  const renderSvg = (): ReactNode => {
    switch (name) {
      case "compass":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity={0.25} stroke="currentColor" />
          </svg>
        )
      case "atom":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        )
      case "shield":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case "medal":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="15" r="5" fill="currentColor" fillOpacity={0.15} stroke="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.21 13.89L7 21l5-3 5 3-1.21-7.11M8.21 13.89A4.978 4.978 0 017 10a5 5 0 1110 0c0 1.48-.64 2.81-1.66 3.73M8.21 13.89l3.79-3.79" />
          </svg>
        )
      case "brain":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case "users":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case "chart":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case "target":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        )
      case "handshake":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "trophy":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2 0h4m5-18v2m0 16v2m-2-2h4m5-18v4m-2-2h4M6 7h12a2 2 0 012 2v2a6 6 0 01-6 6h-4a6 6 0 01-6-6V9a2 2 0 012-2z" />
          </svg>
        )
      case "crown":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18v-2H3v2zm1.5-4l3-7 4.5 4.5L16.5 7l3 7h-15z" />
          </svg>
        )
      case "clock":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )
      case "map-pin":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        )
      case "phone":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
      case "chat":
      case "whatsapp":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      case "sparkles":
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2 0h4m5-18v2m0 16v2m-2-2h4m5-18v4m-2-2h4M12 6l2.5 5.5L20 14l-5.5 2.5L12 22l-2.5-5.5L4 14l5.5-2.5L12 6z" />
          </svg>
        )
      default:
        return (
          <svg className={sizeMap.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="8" />
          </svg>
        )
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center border ${sizeMap.container} ${variantStyles.bg} ${variantStyles.border} ${variantStyles.text} transition-all duration-200 group-hover:border-orange-500/40 ${className}`}
    >
      {renderSvg()}
    </div>
  )
}
