"use client"

import React from "react"
import { usePathname } from "next/navigation"
import Navbar from "./navbar"
import Footer from "./footer"
import ClientProviders from "./client-providers"

interface SiteLayoutProps {
  children: React.ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname()

  // Routes where the public marketing Navbar and Footer should NOT be rendered
  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/faculty") ||
    pathname === "/dashboard"

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={`flex-1 w-full ${!isDashboard ? "" : "min-h-screen bg-obsidian"}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
      <ClientProviders />
    </>
  )
}
