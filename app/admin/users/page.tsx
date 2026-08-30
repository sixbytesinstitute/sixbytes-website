"use client"

import React, { useEffect, useState, type FormEvent } from "react"
import { SUBJECTS, CLASSES, STREAMS } from "@/lib/constants"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconUsers,
  IconPlus,
  IconSearch,
  IconCheck,
  IconCopy,
  IconX,
  IconAlertCircle,
  IconGraduationCap,
  IconTeacher,
} from "@/app/components/ui/icons"

interface UserRecord {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  class: string
  stream: string
  subjects: string[]
  assignedClasses: string[]
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterRole, setFilterRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    class: "9",
    stream: "General",
    subjects: [] as string[],
    assignedClasses: [] as string[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (filterRole) params.set("role", filterRole)
      if (searchTerm) params.set("search", searchTerm)
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (data.success) setUsers(data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filterRole, searchTerm])

  const openModal = () => {
    setShowModal(true)
    setGeneratedPassword("")
    setError("")
    setSuccessMsg("")
    setCopied(false)
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "student",
      class: "9",
      stream: "General",
      subjects: [],
      assignedClasses: [],
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setGeneratedPassword(data.defaultPassword)
        setSuccessMsg(`${form.role.charAt(0).toUpperCase() + form.role.slice(1)} account created successfully!`)
        fetchUsers()
      } else {
        setError(data.error || "Failed to create user")
      }
    } catch {
      setError("Network connection error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const method = isActive ? "DELETE" : "PUT"
    const body = isActive ? undefined : JSON.stringify({ isActive: true })
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body,
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleSubject = (sub: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter((s) => s !== sub)
        : [...prev.subjects, sub],
    }))
  }

  const toggleAssignedClass = (cls: string) => {
    setForm((prev) => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(cls)
        ? prev.assignedClasses.filter((c) => c !== cls)
        : [...prev.assignedClasses, cls],
    }))
  }

  const copyPassword = () => {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const roleFilterOptions = [
    { value: "", label: "All Account Roles" },
    { value: "student", label: "Students" },
    { value: "faculty", label: "Faculty Members" },
    { value: "admin", label: "Super Admins" },
  ]

  const classOptions = CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))
  const streamOptions = STREAMS.filter((s) => s !== "N/A").map((s) => ({ value: s, label: s }))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            User Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            Institute Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            Onboard new students and faculty with default credentials and manage active accounts.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <IconPlus size={16} />
          <span>Onboard New User</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-custom">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by full name, phone, or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all font-sans"
          />
        </div>

        <div>
          <CustomSelect
            options={roleFilterOptions}
            value={filterRole}
            onChange={setFilterRole}
            placeholder="Filter by role"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
            <p className="text-xs text-muted-custom font-sans">Loading directory records...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconUsers size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No users found</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              No records match your search criteria. Try modifying your filter or onboard a new student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">User</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Role</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Assignment</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Contact</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Status</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map((u) => {
                  const roleStyle = {
                    admin: "bg-amber-500/10 text-amber-300 border-amber-500/30",
                    faculty: "bg-orange-500/10 text-orange-400 border-orange-500/30",
                    student: "bg-white/[0.06] text-cream border-white/15",
                  }[u.role as "admin" | "faculty" | "student"] || "bg-white/5 text-cream border-white/10"

                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-center font-bold text-cream text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-cream">{u.name}</p>
                            <p className="text-[11px] text-muted-custom">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleStyle}`}>
                          {u.role === "student" && <IconGraduationCap size={12} />}
                          {u.role === "faculty" && <IconTeacher size={12} />}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Assignment / Class */}
                      <td className="px-5 py-3.5">
                        {u.role === "student" ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-medium text-cream/90">Class {u.class || "—"}</span>
                            {u.stream && u.stream !== "N/A" && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-muted-custom">
                                {u.stream}
                              </span>
                            )}
                          </div>
                        ) : u.role === "faculty" ? (
                          <div className="space-y-0.5 max-w-xs">
                            <p className="text-[11px] text-cream/90 truncate">
                              Classes: {u.assignedClasses?.length ? u.assignedClasses.join(", ") : "None"}
                            </p>
                            <p className="text-[10px] text-muted-custom/70 truncate">
                              {u.subjects?.join(", ") || "No subjects"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-custom">System Admin</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 text-muted-custom">
                        {u.phone ? <span className="font-mono text-[11px]">{u.phone}</span> : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          u.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                          <span>{u.isActive ? "Active" : "Inactive"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => handleToggleActive(u._id, u.isActive)}
                            className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                              u.isActive
                                ? "border-red-500/20 text-red-400/90 hover:bg-red-500/10 hover:border-red-500/30"
                                : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                            }`}
                          >
                            {u.isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-custom/50 uppercase tracking-widest font-mono">Protected</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setShowModal(false)}
          />

          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0f1318] border border-white/10 p-6 sm:p-7 space-y-6 shadow-2xl shadow-black/90 backdrop-blur-2xl animate-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-white/10">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-orange-400 mb-1">
                  Onboarding Portal
                </div>
                <h2 className="text-xl font-display font-bold text-cream">Create New Account</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors"
                aria-label="Close dialog"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Success Feedback Card with Password */}
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/30 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <IconCheck size={16} />
                  <span>{successMsg}</span>
                </div>
                {generatedPassword && (
                  <div className="flex items-center justify-between gap-3 bg-black/40 border border-emerald-500/20 rounded-lg px-3.5 py-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-custom/70">Default Password</p>
                      <code className="text-sm font-mono font-bold text-emerald-300 select-all">{generatedPassword}</code>
                    </div>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-emerald-400/70">
                  Share this password with the user. They will be prompted to create their personal password on first login.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <IconAlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              {/* Role Toggle Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-2">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-black/40 border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "student" })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      form.role === "student"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                        : "text-muted-custom hover:text-cream"
                    }`}
                  >
                    <IconGraduationCap size={16} />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "faculty" })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      form.role === "faculty"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                        : "text-muted-custom hover:text-cream"
                    }`}
                  >
                    <IconTeacher size={16} />
                    <span>Faculty</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80">Phone Number (10 digits)</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 font-mono"
                  />
                </div>
              </div>

              {/* Student Fields */}
              {form.role === "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <CustomSelect
                      label="Enrolled Class"
                      options={classOptions}
                      value={form.class}
                      onChange={(val) => setForm({ ...form, class: val })}
                    />
                  </div>
                  <div>
                    <CustomSelect
                      label="Academic Stream"
                      options={streamOptions}
                      value={form.stream}
                      onChange={(val) => setForm({ ...form, stream: val })}
                    />
                  </div>
                </div>
              )}

              {/* Faculty Fields */}
              {form.role === "faculty" && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-1.5">
                      Assigned Classes (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CLASSES.map((cls) => {
                        const isSelected = form.assignedClasses.includes(cls)
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => toggleAssignedClass(cls)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/[0.02] border-white/10 text-muted-custom hover:border-white/20 hover:text-cream"
                            }`}
                          >
                            {isSelected && <IconCheck size={12} />}
                            <span>Class {cls}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-1.5">
                      Subjects Taught (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((sub) => {
                        const isSelected = form.subjects.includes(sub)
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSubject(sub)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/[0.02] border-white/10 text-muted-custom hover:border-white/20 hover:text-cream"
                            }`}
                          >
                            {isSelected && <IconCheck size={12} />}
                            <span>{sub}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  {submitting ? "Provisioning Account..." : "Create Account & Generate Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
