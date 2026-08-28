"use client"

import { useEffect, useState } from "react"

interface Stats {
  totalStudents: number
  totalFaculty: number
  totalAdmins: number
  totalResources: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalFaculty: 0, totalAdmins: 0, totalResources: 0 })
  const [recentUsers, setRecentUsers] = useState<Array<{ _id: string; name: string; email: string; role: string; createdAt: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, resourcesRes] = await Promise.all([
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/admin/resources").then((r) => r.json()),
        ])

        if (usersRes.success) {
          const users = usersRes.users
          setStats({
            totalStudents: users.filter((u: { role: string }) => u.role === "student").length,
            totalFaculty: users.filter((u: { role: string }) => u.role === "faculty").length,
            totalAdmins: users.filter((u: { role: string }) => u.role === "admin").length,
            totalResources: resourcesRes.success ? resourcesRes.count : 0,
          })
          setRecentUsers(users.slice(0, 5))
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    { label: "Students", value: stats.totalStudents, icon: "🎓", color: "from-blue-500/20 to-blue-600/10 border-blue-500/20" },
    { label: "Faculty", value: stats.totalFaculty, icon: "👨‍🏫", color: "from-purple-500/20 to-purple-600/10 border-purple-500/20" },
    { label: "Admins", value: stats.totalAdmins, icon: "🛡️", color: "from-amber-500/20 to-amber-600/10 border-amber-500/20" },
    { label: "Resources", value: stats.totalResources, icon: "📝", color: "from-green-500/20 to-green-600/10 border-green-500/20" },
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream">Admin Dashboard</h1>
        <p className="text-sm text-muted-custom mt-1">Manage your institute from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.color} border p-5 space-y-2`}
          >
            <div className="text-2xl">{card.icon}</div>
            <p className="text-3xl font-display font-bold text-cream">{card.value}</p>
            <p className="text-xs text-muted-custom uppercase tracking-wider font-semibold">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-cream uppercase tracking-wider">Recent Users</h2>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {recentUsers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-custom">
              No users found. Start by onboarding students and faculty.
            </div>
          ) : (
            recentUsers.map((user) => (
              <div key={user._id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cream">{user.name}</p>
                  <p className="text-xs text-muted-custom">{user.email}</p>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                    user.role === "admin"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : user.role === "faculty"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
