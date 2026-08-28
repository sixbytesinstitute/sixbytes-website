"use client"

import { useEffect, useState } from "react"

export default function FacultyDashboard() {
  const [user, setUser] = useState<{ name: string; assignedClasses: string[]; subjects: string[] } | null>(null)
  const [stats, setStats] = useState({ assignments: 0, materials: 0, notices: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, assignRes, matRes, noticeRes, studRes] = await Promise.all([
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/faculty/assignments").then((r) => r.json()),
          fetch("/api/faculty/materials").then((r) => r.json()),
          fetch("/api/faculty/notices").then((r) => r.json()),
          fetch("/api/faculty/students").then((r) => r.json()),
        ])

        if (meRes.success) setUser(meRes.user)
        setStats({
          assignments: assignRes.success ? assignRes.count : 0,
          materials: matRes.success ? matRes.count : 0,
          notices: noticeRes.success ? noticeRes.count : 0,
          students: studRes.success ? studRes.count : 0,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const cards = [
    { label: "Assignments", value: stats.assignments, icon: "📋", color: "from-blue-500/20 to-blue-600/10 border-blue-500/20" },
    { label: "Materials", value: stats.materials, icon: "📁", color: "from-purple-500/20 to-purple-600/10 border-purple-500/20" },
    { label: "Notices", value: stats.notices, icon: "📢", color: "from-amber-500/20 to-amber-600/10 border-amber-500/20" },
    { label: "Students", value: stats.students, icon: "🎓", color: "from-green-500/20 to-green-600/10 border-green-500/20" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">
          Welcome, {user?.name?.split(" ")[0] || "Faculty"}
        </h1>
        <p className="text-sm text-muted-custom mt-1">
          Classes: {user?.assignedClasses?.join(", ") || "None assigned"} · Subjects: {user?.subjects?.join(", ") || "None"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl bg-gradient-to-br ${card.color} border p-5 space-y-2`}>
            <div className="text-2xl">{card.icon}</div>
            <p className="text-3xl font-display font-bold text-cream">{card.value}</p>
            <p className="text-xs text-muted-custom uppercase tracking-wider font-semibold">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
