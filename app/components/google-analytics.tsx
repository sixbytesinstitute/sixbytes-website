"use client"

import Script from "next/script"

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-4GEZB4TEHZ"

/**
 * Google Analytics 4 component.
 * Loads GA4 globally for all real visitors with Consent Mode v2 support.
 */
export default function GoogleAnalytics() {
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

          // Default consent settings (privacy-first: no ad storage, analytics granted unless declined)
          var isDeclined = document.cookie.indexOf('sb_cookie_consent=declined') !== -1;
          gtag('consent', 'default', {
            'analytics_storage': isDeclined ? 'denied' : 'granted',
            'ad_storage': 'denied'
          });

          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  )
}
