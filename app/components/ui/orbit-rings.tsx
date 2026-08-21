interface OrbitRingsProps {
  className?: string
}

export default function OrbitRings({ className = "" }: OrbitRingsProps) {
  return (
    <div
      className={`absolute pointer-events-none select-none -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Outer spinning ring */}
      <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-orange-500/10 animate-spin-slow flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
        
        {/* Middle counter-rotating ring */}
        <div className="w-[360px] h-[360px] md:w-[500px] md:h-[500px] rounded-full border border-white/5 flex items-center justify-center [animation-direction:reverse] animate-spin-slow">
          <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-orange-300/40" />
          
          {/* Inner ring */}
          <div className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full border border-orange-500/15" />
        </div>
      </div>

      {/* Radial soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_70%)] animate-glow" />
    </div>
  )
}
