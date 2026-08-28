import "./globals.css"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from "next/font/google"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import ClientProviders from "./components/client-providers"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800", "900"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const viewport: Viewport = {
  themeColor: "#0a0c0e",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://sixbytes.in"),
  title: {
    default: "SixBytes Educational Institute | Premier Coaching in Premnagar & Shyampur, Dehradun",
    template: "%s | SixBytes Educational Institute",
  },
  description:
    "Dehradun's premier coaching institute for CBSE & ICSE Class 9–12 (Science & Maths), NDA, RIMC, RMS, and Sainik School preparation. Located in Shyampur, Premnagar, Dehradun. Founded by Jaspal Singh Chauhan.",
  keywords: [
    "best coaching in premnagar",
    "best institute in shyampur",
    "coaching institute dehradun",
    "NDA coaching dehradun",
    "class 10 coaching premnagar",
    "class 12 science tuition shyampur",
    "RIMC coaching uttarakhand",
    "Sainik school coaching dehradun",
    "sixbytes institute",
    "Jaspal Singh Chauhan",
  ],
  authors: [{ name: "Jaspal Singh Chauhan", url: "https://sixbytes.in" }],
  creator: "SixBytes Educational Institute",
  publisher: "SixBytes Educational Institute",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sixbytes.in",
    siteName: "SixBytes Educational Institute",
    title: "SixBytes Educational Institute | Best Coaching in Premnagar & Shyampur",
    description:
      "Transforming student potential with rigorous academics, small batches, and expert mentorship for Boards & Defence entrance exams in Premnagar and Shyampur, Dehradun.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "SixBytes Educational Institute Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SixBytes Educational Institute | Premnagar & Shyampur",
    description:
      "Premier coaching for Class 9–12, NDA, RIMC, and Sainik School in Dehradun. Founded by Jaspal Singh Chauhan.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sixbytes.in",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "SixBytes Educational Institute",
  alternateName: "SixBytes Institute",
  url: "https://sixbytes.in",
  logo: "https://sixbytes.in/logo.png",
  founder: {
    "@type": "Person",
    name: "Jaspal Singh Chauhan",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Opp. Lane No. 3, Sai Vihar, Shyampur",
    addressLocality: "Premnagar, Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "248007",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "30.3340",
    longitude: "77.9620",
  },
  telephone: "+91-7536839760",
  priceRange: "₹₹",
  sameAs: [
    "https://www.instagram.com/sixbytes",
  ],
  description:
    "Leading coaching institute in Shyampur, Premnagar, Dehradun for CBSE/ICSE Class 9-12 and Defence Exams (NDA, RIMC, Sainik School).",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-obsidian text-cream font-sans antialiased min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <ClientProviders />
      </body>
    </html>
  )
}