"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ParticleField from "../components/ui/particle-field"
import OrbitRings from "../components/ui/orbit-rings"
import TagPill from "../components/ui/tag-pill"
import PremiumIcon from "../components/ui/premium-icon"
import ShimmerLine from "../components/ui/shimmer-line"

export default function StudentLogin() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/dashboard")
      } else {
        setError(data.error || "Login failed. Please verify your credentials.")
      }
    } catch (err) {
      console.error(err)
      setError("Unable to connect to login service. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] overflow-hidden">
      {/* Background Animated Atmosphere */}
      <ParticleField particleCount={35} />
      <OrbitRings className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />

      {/* Main Login Box */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="rounded-2xl bg-navy-mid/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-1.5 group-hover:border-orange-500/40 transition-colors">
                <img src="/logo.png" alt="SixBytes Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-lg text-cream tracking-tight block leading-none">
                  SixBytes
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-orange-400">
                  Student Portal
                </span>
              </div>
            </Link>

            <div className="inline-block">
              <TagPill variant="orange">Classroom Access</TagPill>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-custom font-sans">
              Sign in with your registered SixBytes student credentials to access class notes, question banks, and formulas.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
              <svg className="w-4 h-4 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-cream/90 flex items-center gap-1.5">
                <span>Student Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/40 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">
                  Password
                </label>
                <a
                  href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20forgot%20my%20Student%20Portal%20password."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/40 transition-all font-sans pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-custom hover:text-cream text-xs transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <p className="text-xs text-muted-custom">
              Not yet enrolled in SixBytes classroom batches?
            </p>
            <a
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20am%20a%20new%20student%20and%20want%20to%20enroll."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <PremiumIcon name="chat" size="xs" variant="orange" className="!w-5 !h-5 border-none bg-transparent" />
              <span>Apply for New Admission via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-custom hover:text-cream transition-colors"
          >
            <span>←</span>
            <span>Return to SixBytes Home</span>
          </Link>
        </div>
      </div>

      {/* Flush Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0">
        <ShimmerLine />
      </div>
    </div>
  )
}
