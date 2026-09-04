import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Free NCERT Study Resources, Notes & Solved Board Papers | SixBytes Institute",
  description:
    "Free chapter revision notes, formula sheets, NCERT solutions, and solved CBSE & ICSE board exam papers for Class 10 Science, Maths, and Computer Science. Prepared by expert faculty at SixBytes Institute, Dehradun.",
  alternates: {
    canonical: "https://sixbytes.in/resources",
  },
  openGraph: {
    title: "Free NCERT Study Resources & Solved Board Papers | SixBytes Institute",
    description:
      "Access free chapter notes, formula sheets, and board questions for Class 10 CBSE & ICSE Science, Mathematics & Computer Science.",
    url: "https://sixbytes.in/resources",
    siteName: "SixBytes Educational Institute",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
