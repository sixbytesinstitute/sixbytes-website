import Link from "next/link"
import ParticleField from "./components/ui/particle-field"
import Counter from "./components/ui/counter"
import RevealWrapper from "./components/ui/reveal-wrapper"
import SectionHeader from "./components/ui/section-header"
import GlassCard from "./components/ui/glass-card"
import CTAButton from "./components/ui/cta-button"
import TagPill from "./components/ui/tag-pill"
import ShimmerLine from "./components/ui/shimmer-line"
import OrbitRings from "./components/ui/orbit-rings"
import PremiumIcon, { type IconName } from "./components/ui/premium-icon"

export const metadata = {
  title: "SixBytes Educational Institute | Premier Coaching in Premnagar & Shyampur, Dehradun",
  description:
    "Dehradun's top-ranked coaching institute for Class 9–12 CBSE/ICSE, NDA, RIMC, and Sainik School preparation in Shyampur & Premnagar. Small batches, individual mentorship by Jaspal Singh Chauhan.",
}

const COURSES: Array<{
  tag: string
  title: string
  subtitle: string
  iconName: IconName
  desc: string
  highlights: string[]
  href: string
}> = [
  {
    tag: "Foundation Wing",
    title: "Class 9 & 10",
    subtitle: "CBSE & ICSE Board Excellence",
    iconName: "compass",
    desc: "Rigorous concept clarity in Mathematics and Science with regular test series, doubt clearing, and board pattern practice.",
    highlights: ["Mathematics & Science", "Weekly Assessment Tests", "Small Batch Sizes (15 max)"],
    href: "/courses",
  },
  {
    tag: "Senior Wing",
    title: "Class 11 & 12",
    subtitle: "Science Stream (PCM / PCB)",
    iconName: "atom",
    desc: "Targeted coaching for Physics, Chemistry, Mathematics, and Biology with dual focus on CBSE/ISC board exams and competitive entrance.",
    highlights: ["Physics, Chem, Maths, Bio", "Competitive Foundation", "Past 10-Year Question Drill"],
    href: "/courses",
  },
  {
    tag: "Defence Academy",
    title: "NDA & RIMC / RMS",
    subtitle: "Officer Cadre Entrance Prep",
    iconName: "shield",
    desc: "Specialized defence wing coaching covering Mathematics, General Ability Test (GAT), English, and physical/SSB mentorship.",
    highlights: ["NDA Written & GAT", "Sainik School & RMS Prep", "Expert Defence Faculty"],
    href: "/courses",
  },
]

const TOPPERS = [
  {
    name: "Ishant Bisht",
    exam: "Class 10 CBSE Board",
    score: "94%",
    image: "/topper1.jpg",
    badge: "Subject Topper",
  },
  {
    name: "Anshika Baluni",
    exam: "Class 12 Science Board",
    score: "94%",
    image: "/topper2.jpg",
    badge: "District Ranker",
  },
  {
    name: "Shubham Bisht",
    exam: "Class 12 Science Board",
    score: "94%",
    image: "/student2.jpg",
    badge: "School Topper",
  },
  {
    name: "Shray Sundly",
    exam: "Class 12 Science Board",
    score: "87%",
    image: "/student1.jpg",
    badge: "Merit Achiever",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "The individual attention and rigorous test series at SixBytes completely transformed my board preparation. The teachers explain tough concepts with crystal clarity.",
    name: "Ishant Bisht",
    role: "Scored 94% in Class 10 Boards",
    rating: 5,
  },
  {
    quote:
      "SixBytes provided the exact environment I needed for Class 12 Science. The structured study material and doubt clearing sessions made all the difference.",
    name: "Anshika Baluni",
    role: "Scored 94% in Class 12 Science",
    rating: 5,
  },
  {
    quote:
      "Best coaching institute in the Premnagar and Shyampur area. Sir personally tracks every student’s weaknesses and turns them into strengths.",
    name: "Rajeev Sundly",
    role: "Parent of Class 12 Student",
    rating: 5,
  },
]

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — Flush Window Height
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
        {/* Animated Particles Canvas */}
        <ParticleField particleCount={45} />

        {/* Subtle Orbit Rings Decoration */}
        <OrbitRings className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full my-auto">
          {/* Badge Pill */}
          <RevealWrapper delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400">
                #1 Coaching Institute in Premnagar & Shyampur
              </span>
            </div>
          </RevealWrapper>

          {/* Hero Headings */}
          <RevealWrapper delay={100}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-cream tracking-tight leading-[1.1] mb-2">
              Where Academic Potential
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={200}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-gradient-orange tracking-tight leading-[1.1] mb-5">
              Becomes Proven Legacy
            </h1>
          </RevealWrapper>

          {/* Subtitle */}
          <RevealWrapper delay={300}>
            <p className="text-base sm:text-xl font-serif italic text-muted-custom max-w-3xl mx-auto mb-6 leading-relaxed font-light">
              Specialized coaching for CBSE/ICSE Classes 9–12 (Science & Maths), NDA, RIMC, RMS & Sainik School in Dehradun.
            </p>
          </RevealWrapper>

          {/* Stats Bar */}
          <RevealWrapper delay={400}>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6 py-4 px-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-orange-400">
                  <Counter end={1200} />+
                </div>
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-custom mt-1 font-bold">
                  Students Guided
                </div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-orange-400">
                  <Counter end={94} suffix="%" />
                </div>
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-custom mt-1 font-bold">
                  Top Board Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-orange-400">
                  <Counter end={10} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-custom mt-1 font-bold">
                  Years of Excellence
                </div>
              </div>
            </div>
          </RevealWrapper>

          {/* Hero CTAs */}
          <RevealWrapper delay={500}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton
                href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20book%20a%20Free%20Demo%20Class."
                variant="filled"
                className="w-full sm:w-auto text-base !py-3 !px-8"
              >
                Book a Free Demo Class
              </CTAButton>
              <CTAButton href="/courses" variant="outline" className="w-full sm:w-auto text-base !py-3 !px-8">
                Explore Programs
              </CTAButton>
            </div>
          </RevealWrapper>
        </div>

        {/* Flush Border Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <ShimmerLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. PROGRAMS & COURSES SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Academic Wings"
            title="Crafted for Academic"
            highlightedWord="Champions"
            subtitle="Precision-crafted curricula engineered to build unshakable conceptual mastery, rigorous problem-solving skills, and top board results."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.map((course, index) => (
              <RevealWrapper key={course.title} delay={index * 80}>
                <GlassCard className="h-full flex flex-col justify-between group border-white/[0.08] hover:border-orange-500/30 transition-colors p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <PremiumIcon name={course.iconName} size="md" variant="orange" />
                      <TagPill variant="orange">{course.tag}</TagPill>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-cream mb-1 group-hover:text-orange-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-semibold text-orange-400/90 mb-3">
                      {course.subtitle}
                    </p>

                    <p className="text-sm text-muted-custom leading-relaxed mb-5">
                      {course.desc}
                    </p>

                    <ul className="space-y-2 mb-6 border-t border-white/10 pt-4">
                      {course.highlights.map((h) => (
                        <li key={h} className="text-xs font-medium text-cream flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={course.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors pt-3 border-t border-white/5 group-hover:translate-x-1 duration-200"
                  >
                    <span>View Curriculum & Schedule</span>
                    <span>→</span>
                  </Link>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TOPPERS & RESULTS SHOWCASE — Prominent, Big & Highly Readable Cards
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Hall of Fame"
            title="Consistent Results,"
            highlightedWord="Extraordinary"
            subtitle="Numbers speak louder than promises. Celebrate the brilliant milestones achieved by SixBytes students in CBSE & ICSE Boards."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOPPERS.map((topper, idx) => (
              <RevealWrapper key={topper.name} delay={idx * 60}>
                <GlassCard className="text-center group border-white/[0.08] hover:border-orange-500/30 p-6 sm:p-7">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4">
                    <img
                      src={topper.image}
                      alt={topper.name}
                      className="relative w-full h-full rounded-2xl object-cover border-2 border-white/20 p-0.5 group-hover:scale-105 transition-transform duration-300 shadow-xl"
                    />
                    <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold rounded-full bg-navy-mid text-orange-400 uppercase tracking-wider border border-orange-500/30 whitespace-nowrap">
                      {topper.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-cream group-hover:text-orange-400 transition-colors mt-3">
                    {topper.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-custom font-semibold mt-1">
                    {topper.exam}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-orange-400 block">
                      {topper.score}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-dim-custom font-bold mt-1 block">
                      Board Aggregate
                    </span>
                  </div>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>

          <div className="text-center mt-10">
            <CTAButton href="/results" variant="outline" className="!py-3 !px-8 text-sm">
              View All Student Achievements & Results
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FOUNDER & PEDAGOGY SPOTLIGHT — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy overflow-hidden">
        <div className="max-w-6xl mx-auto w-full my-auto">
          <GlassCard padding="lg" className="border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Founder Image Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-80 sm:w-76 sm:h-[390px] rounded-2xl overflow-hidden border border-white/15 bg-navy-mid shadow-2xl">
                  <img
                    src="/founder.png"
                    alt="Jaspal Singh Chauhan - Founder of SixBytes"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-orange-400 font-extrabold block">
                      FOUNDER & CHIEF MENTOR
                    </span>
                    <span className="font-display text-xl font-bold text-cream">
                      Jaspal Singh Chauhan
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Bio & Philosophy */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2">
                  <span className="orange-rule" />
                  <span className="section-label">Mentorship Philosophy</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cream leading-tight">
                  &ldquo;True education does not merely teach formulas—it cultivates an{" "}
                  <span className="text-gradient-orange">unyielding mindset</span>{" "}for victory.&rdquo;
                </h2>

                <p className="text-xs sm:text-sm text-muted-custom font-sans leading-relaxed">
                  Under the leadership of <strong className="text-cream">Jaspal Singh Chauhan</strong>, SixBytes Educational Institute was established with a singular mission: to provide the youth of Premnagar and Shyampur with uncompromising academic rigor and genuine mentorship.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PremiumIcon name="users" size="sm" variant="orange" />
                      <span className="text-orange-400 text-xs sm:text-sm font-bold">Small Batches</span>
                    </div>
                    <p className="text-[11px] text-muted-custom leading-relaxed">
                      Strict limit of 15 students per batch ensures direct interaction and prompt doubt resolution.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PremiumIcon name="chart" size="sm" variant="orange" />
                      <span className="text-orange-400 text-xs sm:text-sm font-bold">Test Analytics</span>
                    </div>
                    <p className="text-[11px] text-muted-custom leading-relaxed">
                      Weekly exams with in-depth feedback pinpointing conceptual gaps early.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <CTAButton href="/about" variant="filled" className="!py-2.5 !px-6 text-xs">
                    Read Our Complete Story
                  </CTAButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TESTIMONIALS SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Student & Parent Voices"
            title="Trusted by Families in"
            highlightedWord="Premnagar & Shyampur"
            subtitle="Read how our dedicated faculty and personalized approach help students achieve their dream scores."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <RevealWrapper key={t.name} delay={idx * 60}>
                <GlassCard className="h-full flex flex-col justify-between border-white/[0.08] hover:border-orange-500/30 p-6">
                  <div>
                    <div className="flex gap-1 text-amber-400 text-sm mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-cream/90 font-serif italic leading-relaxed mb-4 font-light">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <h4 className="font-display font-bold text-cream text-base">
                      {t.name}
                    </h4>
                    <p className="text-xs text-orange-400/90 font-medium mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          6. LOCAL SEO & FINAL CTA — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy-mid/70 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-6 w-full my-auto">
          <div className="space-y-3">
            <TagPill variant="orange">Local Academic Landmark</TagPill>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream">
              Why SixBytes is the #1 Choice in Shyampur & Premnagar, Dehradun
            </h2>
            <p className="text-xs sm:text-sm text-muted-custom font-sans leading-relaxed max-w-3xl mx-auto">
              Conveniently situated opposite Lane No. 3 in Sai Vihar, Shyampur, SixBytes is the trusted coaching center for students from schools across Premnagar, Manduwala, Sudhowala, and the wider Dehradun valley. Whether preparing for Class 10/12 Board Exams or the prestigious National Defence Academy (NDA), our faculty brings proven results to your neighborhood.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.04] text-gray-300 border border-white/10 flex items-center gap-1.5">
                <PremiumIcon name="map-pin" size="sm" variant="subtle" className="!w-4 !h-4 border-none bg-transparent" />
                <span>Opp. Lane 3, Sai Vihar, Shyampur</span>
              </span>
              <span className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.04] text-gray-300 border border-white/10 flex items-center gap-1.5">
                <PremiumIcon name="phone" size="sm" variant="subtle" className="!w-4 !h-4 border-none bg-transparent" />
                <span>+91 75368 39760</span>
              </span>
              <span className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.04] text-gray-300 border border-white/10 flex items-center gap-1.5">
                <PremiumIcon name="clock" size="sm" variant="subtle" className="!w-4 !h-4 border-none bg-transparent" />
                <span>Daily: 3:00 PM – 8:00 PM</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-cream">
              Admissions Open for New Session
            </h3>
            <p className="text-xs sm:text-sm text-muted-custom max-w-xl mx-auto">
              Seats in our core batches are strictly limited to ensure personalized attention for every student.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <CTAButton
                href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20enroll%20for%20a%20demo."
                variant="filled"
                className="w-full sm:w-auto text-sm !py-3 !px-7"
              >
                Book Free Demo on WhatsApp
              </CTAButton>
              <CTAButton href="/contact" variant="outline" className="w-full sm:w-auto text-sm !py-3 !px-7">
                Visit Campus & Contact Us
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}