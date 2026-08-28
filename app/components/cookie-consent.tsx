"use client"

import { useState, useEffect } from "react"

const CONSENT_COOKIE = "sb_cookie_consent"

/**
 * GDPR-compliant Cookie Consent Banner
 *
 * Shows a bottom banner asking for cookie consent.
 * GA4 script should only load after consent is given.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if consent was already given
    const consent = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    if (!consent) {
      // Small delay so banner doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    // Set consent cookie for 1 year
    document.cookie = `${CONSENT_COOKIE}=accepted; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    setVisible(false)
    // Reload to trigger GA4 script loading
    window.location.reload()
  }

  const handleDecline = () => {
    document.cookie = `${CONSENT_COOKIE}=declined; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-[#0f1115]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Text */}
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-white/70">
                We use cookies to analyze site traffic and improve your experience.
                By clicking <strong className="text-white/90">&quot;Accept&quot;</strong>, you
                consent to our use of analytics cookies.{" "}
                <a
                  href="/about"
                  className="text-amber-400 underline decoration-amber-400/30 underline-offset-2 transition-colors hover:text-amber-300"
                >
                  Learn more
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex shrink-0 gap-3">
              <button
                onClick={handleDecline}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm font-medium text-white/60 transition-all hover:border-white/20 hover:text-white/80"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-amber-500/25"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

/**
 * Helper: Check if cookie consent was accepted.
 * Use this in layout.tsx to conditionally load GA4.
 */
export function hasConsentCookie(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie.includes(`${CONSENT_COOKIE}=accepted`)
}
