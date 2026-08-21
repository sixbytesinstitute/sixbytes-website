"use client"

import { useEffect, useRef } from "react"

interface ParticleFieldProps {
  particleCount?: number
  color?: string
  connectionDistance?: number
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
}

export default function ParticleField({
  particleCount = 55,
  color = "249, 115, 22", // Default orange RGB
  connectionDistance = 110,
  className = "absolute inset-0 pointer-events-none z-0",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight)

    // Adjust particle count for mobile screens
    const effectiveCount = width < 768 ? Math.floor(particleCount * 0.45) : particleCount

    const particles: Particle[] = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 1.6 + 0.8,
      baseAlpha: Math.random() * 0.4 + 0.2,
    }))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15
            ctx.strokeStyle = `rgba(${color}, ${alpha})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw and update particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.fillStyle = `rgba(${color}, ${p.baseAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, color, connectionDistance])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
