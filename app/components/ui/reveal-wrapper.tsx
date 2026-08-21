"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealWrapperProps {
  children: ReactNode
  className?: string
  delay?: number // in ms
  threshold?: number
  as?: keyof HTMLElementTagNameMap
}

export default function RevealWrapper({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
  as: Component = "div",
}: RevealWrapperProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Immediately reveal if prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsRevealed(true), delay)
          } else {
            setIsRevealed(true)
          }
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [delay, threshold])

  const ComponentTag = Component as any

  return (
    <ComponentTag
      ref={elementRef}
      className={`reveal-on-scroll ${isRevealed ? "revealed" : ""} ${className}`}
    >
      {children}
    </ComponentTag>
  )
}
