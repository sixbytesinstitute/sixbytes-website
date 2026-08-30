"use client"

import React, { useEffect, useState } from "react"
import CustomSelect from "@/app/components/ui/custom-select"
import {
  IconGraduationCap,
  IconSearch,
  IconUsers,
  IconTeacher,
} from "@/app/components/ui/icons"

interface Student {
  _id: string
  name: string
  email: string
  phone: string
  class: string
  stream: string
  createdAt: string
}

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState("")
  const [assignedClasses, setAssignedClasses] = useState<string[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch("/api/auth/me").then((r) => r.json())
        if (meRes.success) setAssignedClasses(meRes.user.assignedClasses || [])

        const params = filterClass ? `?class=${filterClass}` : ""
        const studRes = await fetch(`/api/faculty/students${params}`).then((r) => r.json())
        if (studRes.success) setStudents(studRes.students)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [filterClass])

  const classFilterOptions = [
    { value: "", label: "All Assigned Classes" },
    ...assignedClasses.map((c) => ({ value: c, label: `Class ${c}` })),
  ]

  const filteredStudents = students.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone?.includes(q)
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
        <p className="text-xs text-muted-custom font-sans">Loading student rosters...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] uppercase font-bold tracking-[0.16em] text-orange-400 mb-2">
            Classroom Rosters
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
            My Enrolled Students
          </h1>
          <p className="text-xs sm:text-sm text-muted-custom mt-1">
            {students.length} active students across your assigned teaching batches.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-custom">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            placeholder="Search students by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-mid/70 border border-white/10 hover:border-white/20 text-cream placeholder:text-muted-custom/60 text-xs sm:text-sm focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all font-sans"
          />
        </div>

        <div>
          <CustomSelect
            options={classFilterOptions}
            value={filterClass}
            onChange={setFilterClass}
            placeholder="Filter by class"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-navy-mid/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-muted-custom">
              <IconGraduationCap size={24} />
            </div>
            <p className="text-sm font-semibold text-cream">No students found</p>
            <p className="text-xs text-muted-custom max-w-sm mx-auto">
              No students enrolled in the selected class batch or matching your search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Student</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Class & Stream</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Phone Number</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase font-bold tracking-[0.14em] text-muted-custom">Enrolled Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-xs shrink-0">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-cream">{s.name}</p>
                          <p className="text-[11px] text-muted-custom">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-cream border border-white/10">
                          Class {s.class}
                        </span>
                        {s.stream && s.stream !== "N/A" && (
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            {s.stream}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-muted-custom font-mono text-[11px]">
                      {s.phone || "—"}
                    </td>

                    <td className="px-5 py-3.5 text-muted-custom text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
