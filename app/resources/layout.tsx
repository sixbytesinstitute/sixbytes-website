import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Free Study Resources | SixBytes Institute" },
  description:
    "Free NCERT notes, formula sheets and solved CBSE and ICSE papers for Classes 10–12 from SixBytes Institute, Dehradun.",
  alternates: {
    canonical: "https://sixbytes.in/resources",
  },
  openGraph: {
    title: "Free Study Resources | SixBytes Institute",
    description:
      "Free NCERT notes, formula sheets and solved CBSE and ICSE papers for Classes 10–12 from SixBytes Institute, Dehradun.",
    url: "https://sixbytes.in/resources",
    siteName: "SixBytes Educational Institute",
    type: "website",
    images: [{ url: "https://sixbytes.in/logo.png", width: 800, height: 800, alt: "SixBytes Educational Institute" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
