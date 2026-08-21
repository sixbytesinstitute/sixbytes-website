interface ShimmerLineProps {
  className?: string
}

export default function ShimmerLine({ className = "" }: ShimmerLineProps) {
  return (
    <div
      className={`w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent ${className}`}
      aria-hidden="true"
    />
  )
}
