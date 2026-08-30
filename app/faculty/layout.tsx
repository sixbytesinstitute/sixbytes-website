"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardSidebar from "../components/dashboard-sidebar"

interface User {
  name: string
  email: string
  role: string
}

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user.role === "faculty") {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0c0e]">
      <DashboardSidebar role="faculty" userName={user.name} userEmail={user.email} />
      <main className="lg:ml-64 min-h-screen p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
