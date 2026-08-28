"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

const GA_ID = "G-4GEZB4TEHZ"

/**
 * Google Analytics 4 component.
 * Only loads GA4 if the user has accepted cookies.
 */
export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((c) => c.startsWith("sb_cookie_consent="))
    if (consent?.includes("accepted")) {
      setHasConsent(true)
    }
  }, [])

  if (!hasConsent) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
