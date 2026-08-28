"use client"

import GoogleAnalytics from "./google-analytics"
import CookieConsent from "./cookie-consent"

/**
 * Client-side providers and components that need to be in every page.
 * Added as a child of the server-rendered root layout.
 */
export default function ClientProviders() {
  return (
    <>
      <GoogleAnalytics />
      <CookieConsent />
    </>
  )
}
