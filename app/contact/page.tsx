import ParticleField from "../components/ui/particle-field"
import RevealWrapper from "../components/ui/reveal-wrapper"
import GlassCard from "../components/ui/glass-card"
import CTAButton from "../components/ui/cta-button"
import TagPill from "../components/ui/tag-pill"
import ShimmerLine from "../components/ui/shimmer-line"
import JsonLd from "../components/seo/json-ld"
import PremiumIcon from "../components/ui/premium-icon"

export const metadata = {
  title: "Contact & Location | SixBytes Institute Shyampur & Premnagar, Dehradun",
  description:
    "Visit SixBytes Educational Institute Opp. Lane No. 3, Sai Vihar, Shyampur, Premnagar, Dehradun. Call +91 75368 39760 or chat on WhatsApp for demo class bookings.",
}

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SixBytes Educational Institute",
  image: "https://sixbytes.in/logo.png",
  telephone: "+91-7536839760",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Opp. Lane No. 3, Sai Vihar, Shyampur",
    addressLocality: "Premnagar, Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "248007",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "15:00",
      closes: "20:00",
    },
  ],
  url: "https://sixbytes.in/contact",
}

const BATCH_TIMINGS = [
  { batch: "Morning Senior Batch", time: "7:00 AM – 9:00 AM", focus: "Class 12 & Defence" },
  { batch: "Afternoon Foundation Batch", time: "3:00 PM – 5:00 PM", focus: "Class 9 & 10 Boards" },
  { batch: "Evening Intensive Batch", time: "5:30 PM – 7:30 PM", focus: "Class 11 Science & NDA" },
  { batch: "Doubt & Mentorship Slot", time: "7:30 PM – 8:30 PM", focus: "1-on-1 Personalized" },
]

export default function Contact() {
  return (
    <div className="relative overflow-hidden">
      <JsonLd data={contactJsonLd} />

      {/* ══════════════════════════════════════════════════════════════════════
          1. CONTACT HERO SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex flex-col justify-center items-center pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
        <ParticleField particleCount={35} />

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full my-auto">
          <RevealWrapper delay={0}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="orange-rule" />
              <span className="section-label">Connect With Us</span>
              <span className="orange-rule scale-x-[-1]" />
            </div>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-cream tracking-tight leading-tight mb-4">
              Visit Our Campus, <br />
              <span className="text-gradient-orange">Start the Conversation</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <p className="text-base sm:text-xl font-serif italic text-muted-custom max-w-2xl mx-auto leading-relaxed font-light">
              We welcome parents and students for personalized academic counseling and complimentary trial classes.
            </p>
          </RevealWrapper>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <ShimmerLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. MAIN CONTACT & MAP SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Direct Contact Details & Timings */}
            <div className="lg:col-span-5 space-y-5">
              {/* Main Contact Card */}
              <RevealWrapper delay={0}>
                <GlassCard padding="lg" className="space-y-5 border-white/[0.08] hover:border-orange-500/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Direct Helplines
                    </span>
                  </div>

                  {/* Address Block */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <PremiumIcon name="map-pin" size="sm" variant="orange" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cream">
                        Campus Address
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-custom leading-relaxed pl-10">
                      SixBytes Educational Institute <br />
                      Opp. Lane No. 3, Sai Vihar, <br />
                      <strong className="text-cream font-semibold">Shyampur, Premnagar</strong>, <br />
                      Dehradun, Uttarakhand 248007
                    </p>
                  </div>

                  {/* Phone Block */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <PremiumIcon name="phone" size="sm" variant="orange" />
                      <span className="text-xs font-bold uppercase tracking-wider text-cream">
                        Phone Consultation
                      </span>
                    </div>
                    <div className="pl-10">
                      <a
                        href="tel:+917536839760"
                        className="text-2xl font-serif font-bold text-cream hover:text-orange-400 transition-colors block"
                      >
                        +91 75368 39760
                      </a>
                      <span className="text-xs text-dim-custom block mt-0.5">
                        Available Mon–Sat: 8:00 AM – 8:00 PM
                      </span>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                    <CTAButton
                      href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20enquire%20about%20admissions."
                      variant="filled"
                      className="w-full text-xs !py-3"
                    >
                      Instant WhatsApp Chat
                    </CTAButton>

                    <a
                      href="https://www.instagram.com/sixbytes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-full border border-white/15 hover:border-orange-400 text-cream hover:text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Follow @sixbytes on Instagram</span>
                    </a>
                  </div>
                </GlassCard>
              </RevealWrapper>

              {/* Batch Timings Card */}
              <RevealWrapper delay={150}>
                <GlassCard padding="md" className="space-y-3.5 border-white/[0.08] hover:border-orange-500/30">
                  <div className="flex items-center gap-2">
                    <PremiumIcon name="clock" size="sm" variant="orange" />
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      Daily Batch Timings
                    </span>
                  </div>
                  <div className="space-y-2">
                    {BATCH_TIMINGS.map((b) => (
                      <div
                        key={b.batch}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                      >
                        <div>
                          <span className="text-xs font-bold text-cream block">{b.batch}</span>
                          <span className="text-[10px] text-muted-custom">{b.focus}</span>
                        </div>
                        <span className="text-xs font-semibold text-orange-400">{b.time}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </RevealWrapper>
            </div>

            {/* Right Column: Google Maps Interactive Embed */}
            <div className="lg:col-span-7 space-y-4">
              <RevealWrapper delay={100}>
                <GlassCard padding="none" className="overflow-hidden border-white/[0.08] shadow-2xl">
                  {/* Map Header Bar */}
                  <div className="p-3.5 bg-navy-mid border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-xs font-bold text-cream uppercase tracking-wider">
                        SixBytes Campus Location
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-custom">
                      Shyampur, Premnagar, Dehradun
                    </span>
                  </div>

                  {/* Embed Iframe */}
                  <div className="relative w-full h-[400px] sm:h-[450px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8540051474743!2d77.9320947754021!3d30.326670274782657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092b56ccad2f27%3A0x2b0ae3d4359a4853!2sSixBytes%20Educational%20Institute!5e0!3m2!1sen!2sin!4v1774718605519!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="SixBytes Educational Institute Location Map"
                    />
                  </div>

                  {/* Map Footer Link */}
                  <div className="p-3.5 bg-navy-mid/90 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-muted-custom">
                      Need live navigation directions?
                    </span>
                    <a
                      href="https://maps.google.com/?q=SixBytes+Educational+Institute+Premnagar+Dehradun"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <span>Open in Google Maps</span>
                      <span>↗</span>
                    </a>
                  </div>
                </GlassCard>
              </RevealWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. CONTACT CTA / TRIAL CLASS BOOKING — Full Viewport Finish
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian text-center">
        <div className="max-w-4xl mx-auto space-y-6 my-auto">
          <TagPill variant="orange">Complimentary Academic Evaluation</TagPill>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-cream">
            Schedule a Free Diagnostic Session with Jaspal Sir
          </h2>
          <p className="text-base text-muted-custom font-sans max-w-2xl mx-auto">
            Bring your recent examination marksheet or syllabus doubts. Our faculty will assess your current conceptual standing and chart an individualized score improvement roadmap.
          </p>
          <div className="pt-4">
            <CTAButton
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20book%20a%20Diagnostic%20Session."
              variant="filled"
              className="text-base !py-3.5 !px-8"
            >
              Book Diagnostic Session on WhatsApp
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}