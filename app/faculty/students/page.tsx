"use client"

import { useEffect, useState } from "react"

interface Student { _id: string; name: string; email: string; phone: string; class: string; stream: string; createdAt: string }

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState("")
  const [assignedClasses, setAssignedClasses] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch("/api/auth/me").then((r) => r.json())
        if (meRes.success) setAssignedClasses(meRes.user.assignedClasses)

        const params = filterClass ? `?class=${filterClass}` : ""
        const studRes = await fetch(`/api/faculty/students${params}`).then((r) => r.json())
        if (studRes.success) setStudents(studRes.students)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [filterClass])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-display font-bold text-cream">My Students</h1><p className="text-sm text-muted-custom mt-1">{students.length} students in your classes</p></div>
        <select value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setLoading(true) }} className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-orange-500/60">
          <option value="">All Classes</option>
          {assignedClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {students.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-custom">No students found in your assigned classes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Email</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Phone</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Class</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted-custom font-semibold">Stream</th>
              </tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-cream font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-muted-custom">{s.email}</td>
                    <td className="px-4 py-3 text-muted-custom">{s.phone}</td>
                    <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">Class {s.class}</span></td>
                    <td className="px-4 py-3 text-muted-custom">{s.stream}</td>
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
