"use client"

import { useEffect, useState, type FormEvent } from "react"
import { SUBJECTS, CLASSES } from "@/lib/constants"

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

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "student",
    class: "9", stream: "General", subjects: [] as string[], assignedClasses: [] as string[],
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

  useEffect(() => { fetchUsers() }, [filterRole, searchTerm])

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
        setSuccessMsg(`${form.role} account created! Default password: ${data.defaultPassword}`)
        setForm({ name: "", email: "", phone: "", role: "student", class: "9", stream: "General", subjects: [], assignedClasses: [] })
        fetchUsers()
      } else {
        setError(data.error || "Failed to create user")
      }
    } catch {
      setError("Connection error. Please try again.")
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-cream">User Management</h1>
          <p className="text-sm text-muted-custom mt-1">Onboard and manage students & faculty</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setGeneratedPassword(""); setError(""); setSuccessMsg("") }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all"
        >
          + Onboard User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admins</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-custom">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Name</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Email</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Role</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Class</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Status</th>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-cream font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-custom">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        u.role === "admin" ? "bg-amber-500/10 text-amber-400" :
                        u.role === "faculty" ? "bg-purple-500/10 text-purple-400" :
                        "bg-blue-500/10 text-blue-400"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-custom">{u.class || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase font-bold ${u.isActive ? "text-green-400" : "text-red-400"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
                            u.isActive
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-green-400 hover:bg-green-500/10"
                          }`}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d0f12] border border-white/10 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-cream">Onboard New User</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-custom hover:text-cream text-xl">✕</button>
            </div>

            {/* Success message with generated password */}
            {successMsg && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-300 space-y-2">
                <p className="font-semibold">{successMsg}</p>
                {generatedPassword && (
                  <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
                    <code className="text-green-400 font-mono text-sm flex-1">{generatedPassword}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedPassword)}
                      className="text-[10px] text-cream/60 hover:text-cream px-2 py-1 rounded bg-white/10"
                    >
                      Copy
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-green-400/60">Share this password with the user. They must change it on first login.</p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Full Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Phone Number</label>
                <input
                  type="tel" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit phone number"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream placeholder:text-muted-custom/60 text-sm focus:outline-none focus:border-orange-500/60"
                />
                <p className="text-[10px] text-muted-custom">Default password: SixBytes@ + last 4 digits of phone</p>
              </div>

              {/* Student: Class & Stream */}
              {form.role === "student" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Class</label>
                    <select
                      value={form.class}
                      onChange={(e) => setForm({ ...form, class: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
                    >
                      {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Stream</label>
                    <select
                      value={form.stream}
                      onChange={(e) => setForm({ ...form, stream: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60"
                    >
                      <option value="General">General</option>
                      <option value="PCM">PCM</option>
                      <option value="PCB">PCB</option>
                      <option value="Defence">Defence</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Faculty: Subjects & Assigned Classes */}
              {form.role === "faculty" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((sub) => (
                        <button
                          key={sub} type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            form.subjects.includes(sub)
                              ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                              : "border-white/10 text-muted-custom hover:border-white/20"
                          }`}
                        >{sub}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/90">Assigned Classes</label>
                    <div className="flex flex-wrap gap-2">
                      {CLASSES.map((cls) => (
                        <button
                          key={cls} type="button"
                          onClick={() => toggleAssignedClass(cls)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            form.assignedClasses.includes(cls)
                              ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                              : "border-white/10 text-muted-custom hover:border-white/20"
                          }`}
                        >Class {cls}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg disabled:opacity-50 transition-all"
              >
                {submitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
