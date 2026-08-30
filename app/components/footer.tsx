import Link from "next/link"
import PremiumIcon from "./ui/premium-icon"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="SixBytes Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-cream tracking-tight group-hover:text-orange-400 transition-colors leading-none">
                  SixBytes
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-orange-400 mt-0.5">
                  Educational Institute
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-custom font-sans leading-relaxed">
              Dehradun’s premier coaching institute dedicated to transforming academic potential
              into stellar board results and prestigious defence academy admissions.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20have%20an%20enquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-center text-muted-custom hover:text-emerald-400 transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/sixbytes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 flex items-center justify-center text-muted-custom hover:text-orange-400 transition-colors"
                aria-label="Follow on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <span className="text-xs text-dim-custom">@sixbytes</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4 font-sans">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted-custom hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-custom hover:text-orange-400 transition-colors">
                  About the Institute
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-muted-custom hover:text-orange-400 transition-colors">
                  Our Courses & Batches
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-muted-custom hover:text-orange-400 transition-colors">
                  Toppers & Board Results
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-custom hover:text-orange-400 transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-custom hover:text-orange-400 transition-colors">
                  Portal Login (Students & Staff)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4 font-sans">
              Our Programs
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-custom">
              <li>
                <span className="text-cream font-medium block">CBSE & ICSE Class 9–10</span>
                <span className="text-xs text-dim-custom">Comprehensive Maths & Science foundation</span>
              </li>
              <li>
                <span className="text-cream font-medium block">Class 11–12 Science</span>
                <span className="text-xs text-dim-custom">Physics, Chemistry, Maths & Biology</span>
              </li>
              <li>
                <span className="text-cream font-medium block">NDA & Defence Wing</span>
                <span className="text-xs text-dim-custom">Written exam + physical mentorship</span>
              </li>
              <li>
                <span className="text-cream font-medium block">RIMC / RMS / Sainik School</span>
                <span className="text-xs text-dim-custom">Early defence entrance coaching</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Local SEO Info — Premium Vector Icons */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4 font-sans">
              Campus Location
            </h3>
            <div className="space-y-3.5 text-sm text-muted-custom">
              <div className="flex items-start gap-3">
                <PremiumIcon name="map-pin" size="xs" variant="orange" className="mt-0.5 shrink-0" />
                <span>
                  Opp. Lane No. 3, Sai Vihar, <br />
                  <strong className="text-cream font-medium">Shyampur, Premnagar</strong>, <br />
                  Dehradun, Uttarakhand 248007
                </span>
              </div>

              <div className="flex items-center gap-3">
                <PremiumIcon name="phone" size="xs" variant="orange" className="shrink-0" />
                <a
                  href="tel:+917536839760"
                  className="text-cream font-medium hover:text-orange-400 transition-colors"
                >
                  +91 75368 39760
                </a>
              </div>

              <div className="flex items-center gap-3">
                <PremiumIcon name="chat" size="xs" variant="orange" className="shrink-0" />
                <a
                  href="https://wa.me/917536839760?text=Hello%20SixBytes!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream font-medium hover:text-orange-400 transition-colors"
                >
                  WhatsApp Helpline
                </a>
              </div>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 text-[11px] font-bold rounded-full bg-white/[0.04] text-orange-400 border border-white/10">
                  Daily Batches: 3:00 PM – 8:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-custom">
          <p>
            © {currentYear} SixBytes Educational Institute. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Founded & Mentored by <strong className="text-cream">Jaspal Singh Chauhan</strong> • Shyampur & Premnagar, Dehradun
          </p>
        </div>
      </div>
    </footer>
  )
}
