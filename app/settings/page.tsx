"use client"

import React, { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ShimmerLine from "../components/ui/shimmer-line"
import {
  IconShield,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconUsers,
  IconSettings,
} from "../components/ui/icons"

/* ─── Types ─────────────────────────────────────────────── */
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  class?: string
  stream?: string
  subjects?: string[]
  assignedClasses?: string[]
  mustChangePassword: boolean
  createdAt?: string
}

type ActiveTab = "profile" | "security"

/* ─── Shared Input Component ────────────────────────────── */
function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  required,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-2.5 rounded-xl bg-[#141a1f]/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/50 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-sans disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
        {children}
      </div>
    </div>
  )
}

/* ─── Notification Banners ──────────────────────────────── */
function Banner({ type, message }: { type: "error" | "success"; message: string }) {
  const isError = type === "error"
  return (
    <div
      className={`p-3 rounded-xl flex items-center gap-2.5 text-xs ${
        isError
          ? "bg-red-500/10 border border-red-500/30 text-red-300"
          : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
      }`}
    >
      {isError ? (
        <IconAlertCircle size={15} className="text-red-400 shrink-0" />
      ) : (
        <IconCheck size={15} className="text-emerald-400 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}

/* ─── Password Field ────────────────────────────────────── */
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  minLength,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  show: boolean
  onToggle: () => void
  minLength?: number
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          minLength={minLength}
          className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#141a1f]/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/50 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-sans transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-custom hover:text-cream cursor-pointer"
        >
          {show ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Main Settings Page ────────────────────────────────── */
export default function SettingsPage() {
  const router = useRouter()

  /* Auth & User State */
  const [user, setUser] = useState<UserProfile | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile")

  /* Profile Form State */
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [profilePhone, setProfilePhone] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileSuccess, setProfileSuccess] = useState("")

  /* Password Form State */
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  /* ─── Fetch User on Mount ─────────────────────────────── */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user)
          setProfileName(data.user.name)
          setProfileEmail(data.user.email)
          setProfilePhone(data.user.phone || "")
          // If must change password, force security tab
          if (data.user.mustChangePassword) {
            setActiveTab("security")
          }
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setPageLoading(false))
  }, [router])

  /* ─── Dashboard href ──────────────────────────────────── */
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

  /* ─── Profile Update Handler ──────────────────────────── */
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileSuccess("")

    if (!profileName.trim()) {
      setProfileError("Name is required")
      return
    }
    if (!profilePhone.trim()) {
      setProfileError("Phone number is required")
      return
    }
    if (!profileEmail.trim()) {
      setProfileError("Email is required")
      return
    }

    setProfileLoading(true)
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim(),
          email: profileEmail.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setProfileSuccess("Profile updated successfully")
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
              }
            : null
        )
        setTimeout(() => setProfileSuccess(""), 3000)
      } else {
        setProfileError(data.error || "Failed to update profile")
      }
    } catch {
      setProfileError("Unable to connect. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  /* ─── Password Change Handler ─────────────────────────── */
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setPasswordLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setPasswordSuccess("Password updated successfully! Redirecting...")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => router.push(getDashboardHref()), 1200)
      } else {
        setPasswordError(data.error || "Failed to change password")
      }
    } catch {
      setPasswordError("Unable to connect. Please try again.")
    } finally {
      setPasswordLoading(false)
    }
  }

  /* ─── Loading State ───────────────────────────────────── */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading account settings...</p>
      </div>
    )
  }

  if (!user) return null

  const roleBadge: Record<string, { label: string; color: string }> = {
    admin: { label: "Administrator", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
    faculty: { label: "Faculty", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    student: { label: "Student", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  }

  const badge = roleBadge[user.role] || roleBadge.student

  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Personal Info", icon: <IconUsers size={16} /> },
    { key: "security", label: "Password", icon: <IconShield size={16} /> },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e] text-cream font-sans overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center text-xl font-bold text-orange-400 shrink-0 shadow-lg shadow-orange-500/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-cream">
                Account Settings
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
                {user.class && user.class !== "" && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-muted-custom border border-white/10">
                    Class {user.class}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!user.mustChangePassword && (
            <Link
              href={getDashboardHref()}
              className="text-xs text-muted-custom hover:text-cream transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>←</span>
              <span>Back to Workspace</span>
            </Link>
          )}
        </div>

        {/* Must Change Password Warning */}
        {user.mustChangePassword && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
            <IconAlertCircle size={16} className="text-amber-400 shrink-0" />
            <span>You must set a personal password before accessing your dashboard. Please update it in the Password tab below.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1.5 bg-[#0f1318]/80 rounded-xl p-1 border border-white/[0.06]">
          {tabs.map((t) => {
            const isActive = activeTab === t.key
            const isDisabled = user.mustChangePassword && t.key === "profile"
            return (
              <button
                key={t.key}
                onClick={() => !isDisabled && setActiveTab(t.key)}
                disabled={isDisabled}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? "bg-[#141a1f] text-cream border border-white/10 shadow-sm"
                    : "text-muted-custom hover:text-cream hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <span className={isActive ? "text-orange-400" : ""}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PROFILE TAB                                        */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="rounded-2xl bg-[#0f1318]/90 border border-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <IconUsers size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-cream">Personal Information</h2>
                <p className="text-[11px] text-muted-custom">Update your name, email address, and phone number</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
              {profileError && <Banner type="error" message={profileError} />}
              {profileSuccess && <Banner type="success" message={profileSuccess} />}

              <FieldInput
                label="Full Name"
                value={profileName}
                onChange={setProfileName}
                placeholder="Enter your full name"
                required
              />

              <FieldInput
                label="Email Address"
                value={profileEmail}
                onChange={setProfileEmail}
                type="email"
                placeholder="you@example.com"
                required
              />

              <FieldInput
                label="Phone Number"
                value={profilePhone}
                onChange={setProfilePhone}
                type="tel"
                placeholder="10-digit mobile number"
                required
              />

              {/* Read-Only Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                    Role
                  </label>
                  <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-muted-custom capitalize">
                    {user.role}
                  </div>
                </div>

                {user.role === "student" && user.class && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                      Class & Stream
                    </label>
                    <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-muted-custom">
                      Class {user.class} {user.stream && user.stream !== "N/A" ? `· ${user.stream}` : ""}
                    </div>
                  </div>
                )}

                {user.role === "faculty" && user.subjects && user.subjects.length > 0 && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                      Assigned Subjects
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {user.subjects.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.role === "faculty" && user.assignedClasses && user.assignedClasses.length > 0 && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                      Assigned Classes
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {user.assignedClasses.map((c) => (
                        <span
                          key={c}
                          className="px-2.5 py-1 rounded-full bg-white/[0.06] text-cream border border-white/10 text-[10px] font-semibold"
                        >
                          Class {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user.createdAt && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/60">
                      Account Created
                    </label>
                    <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-muted-custom">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {profileLoading ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* SECURITY TAB                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "security" && (
          <div className="rounded-2xl bg-[#0f1318]/90 border border-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <IconShield size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-cream">
                  {user.mustChangePassword ? "Set Your Personal Password" : "Change Password"}
                </h2>
                <p className="text-[11px] text-muted-custom">
                  {user.mustChangePassword
                    ? "Replace your default password with a private one"
                    : "Update your account password for security"
                  }
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              {passwordError && <Banner type="error" message={passwordError} />}
              {passwordSuccess && <Banner type="success" message={passwordSuccess} />}

              <PasswordField
                label={user.mustChangePassword ? "Default Password (given by admin)" : "Current Password"}
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter current password"
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
              />

              <PasswordField
                label="New Password (min 6 characters)"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Choose a strong password"
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
                minLength={6}
              />

              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter new password"
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
              />

              {/* Password Strength Hints */}
              {newPassword.length > 0 && (
                <div className="space-y-1.5 text-[11px]">
                  <p className="font-semibold text-cream/70 uppercase tracking-wider">Password Checklist</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { label: "6+ characters", ok: newPassword.length >= 6 },
                      { label: "Has uppercase", ok: /[A-Z]/.test(newPassword) },
                      { label: "Has number", ok: /\d/.test(newPassword) },
                      { label: "Passwords match", ok: newPassword === confirmPassword && confirmPassword.length > 0 },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${
                          rule.ok
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/[0.04] text-muted-custom border border-white/10"
                        }`}>
                          {rule.ok ? "✓" : ""}
                        </span>
                        <span className={rule.ok ? "text-emerald-400" : "text-muted-custom"}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {passwordLoading ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ */}
        {/* ACCOUNT INFO CARD (always visible)                 */}
        {/* ═══════════════════════════════════════════════════ */}
        <div className="rounded-2xl bg-[#0f1318]/60 border border-white/[0.06] p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-muted-custom">
            <IconSettings size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-custom">
              Need to change your role, class, or batch? Contact the SixBytes admin team on{" "}
              <a
                href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20need%20help%20with%20my%20account%20settings."
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Bottom shimmer */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <ShimmerLine />
      </div>
    </div>
  )
}
