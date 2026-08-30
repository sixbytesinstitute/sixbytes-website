"use client"

import React, { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ShimmerLine from "../components/ui/shimmer-line"
import ParticleField from "../components/ui/particle-field"
import {
  IconShield,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
} from "../components/ui/icons"

export default function SettingsPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState<{ name: string; email: string; role: string; mustChangePassword: boolean } | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess("Password changed successfully! Redirecting to workspace...")
        setTimeout(() => {
          switch (user?.role) {
            case "admin":
              router.push("/admin/dashboard")
              break
            case "faculty":
              router.push("/faculty/dashboard")
              break
            default:
              router.push("/dashboard")
          }
        }, 1200)
      } else {
        setError(data.error || "Failed to change password")
      }
    } catch {
      setError("Unable to connect. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getDashboardHref = () => {
    switch (user?.role) {
      case "admin":
        return "/admin/dashboard"
      case "faculty":
        return "/faculty/dashboard"
      default:
        return "/dashboard"
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream font-sans overflow-hidden">
      <ParticleField particleCount={18} />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl bg-[#0f1318]/90 border border-white/[0.08] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
              <IconShield size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
              {user?.mustChangePassword ? "Set Personal Password" : "Account Security"}
            </h1>
            {user?.mustChangePassword && (
              <p className="text-xs text-amber-400 font-semibold">
                Please create your private password before accessing your dashboard.
              </p>
            )}
            <p className="text-xs text-muted-custom">
              {user?.name && `Signed in as ${user.name} (${user.email})`}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <IconAlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
              <IconCheck size={16} className="text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                Current Password (or Default Password)
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-custom hover:text-cream cursor-pointer"
                >
                  {showCurrent ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-custom hover:text-cream cursor-pointer"
                >
                  {showNew ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-custom hover:text-cream cursor-pointer"
                >
                  {showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                {loading ? "Updating Security Credentials..." : "Update Password & Continue"}
              </button>
            </div>
          </form>

          {/* Back link */}
          {!user?.mustChangePassword && (
            <div className="text-center pt-2">
              <Link
                href={getDashboardHref()}
                className="text-xs text-muted-custom hover:text-cream transition-colors"
              >
                ← Return to Workspace
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <ShimmerLine />
      </div>
    </div>
  )
}
