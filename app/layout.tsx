import "./globals.css"
import type { ReactNode } from "react"
import Navbar from "./components/navbar"

export const metadata = {
  title: "SixBytes Educational Institute",
  description: "Coaching for Classes 9–12, NDA, RIMC, RMS, Sainik School",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">

        <Navbar />

        {children}

      </body>
    </html>
  )
}