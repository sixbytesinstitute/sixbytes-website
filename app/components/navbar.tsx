"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {

  const [menuOpen,setMenuOpen] = useState(false)
  const pathname = usePathname()

  const linkStyle = (path:string) =>
    pathname === path
    ? "text-orange-400 font-semibold"
    : "hover:text-orange-400"

  return (

    <>
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-[#0f172a] text-white shadow">

        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-8"/>
          <h1 className="font-bold text-lg">SixBytes Institute</h1>
        </div>

        <div className="hidden md:flex gap-6">

          <a href="/" className={linkStyle("/")}>Home</a>
          <a href="/about" className={linkStyle("/about")}>About Us</a>
          <a href="/login" className={linkStyle("/login")}>Student Login</a>
<a href="/courses" className= {linkStyle("/courses")}>Courses</a>
<a href="/results" className= {linkStyle("/results")}>Results</a>
<a href="/contact" className= {linkStyle("/contact")}>Contact Us</a>
        </div>

        <button
        className="md:hidden text-2xl"
        onClick={()=>setMenuOpen(!menuOpen)}
        >
        ☰
        </button>

      </nav>

      {menuOpen && (

        <div className="md:hidden bg-[#0f172a] text-white flex flex-col gap-4 px-8 py-6">

          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/login">Student Login</a>
          <a href="/courses">Courses</a>
           <a href="/results">results</a>
            <a href="/contact">contact</a>

        </div>

      )}

    </>
  )
}