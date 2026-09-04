import ParticleField from "../components/ui/particle-field"
import Counter from "../components/ui/counter"
import RevealWrapper from "../components/ui/reveal-wrapper"
import SectionHeader from "../components/ui/section-header"
import GlassCard from "../components/ui/glass-card"
import CTAButton from "../components/ui/cta-button"
import TagPill from "../components/ui/tag-pill"
import ShimmerLine from "../components/ui/shimmer-line"
import OrbitRings from "../components/ui/orbit-rings"
import PremiumIcon, { type IconName } from "../components/ui/premium-icon"

export const metadata = {
  title: "About SixBytes Institute | Top Coaching in Premnagar & Shyampur, Dehradun",
  description:
    "Learn about SixBytes Educational Institute, founded by Jaspal Singh Chauhan. Our mission, 6 academic pillars, and track record of board & defence exam success in Shyampur, Premnagar, Dehradun.",
  alternates: {
    canonical: "https://sixbytes.in/about",
  },
  openGraph: {
    title: "About SixBytes Institute | Top Coaching in Premnagar & Shyampur, Dehradun",
    description:
      "Learn about SixBytes Educational Institute, founded by Jaspal Singh Chauhan. Our mission, 6 academic pillars, and track record of board & defence exam success.",
    url: "https://sixbytes.in/about",
  },
}

const PILLARS: Array<{
  num: string
  title: string
  desc: string
  iconName: IconName
}> = [
  {
    num: "01",
    title: "Conceptual Rigor",
    desc: "We deconstruct complex Mathematics and Science principles into intuitive mental models, ensuring students understand the fundamental 'why' before memorizing.",
    iconName: "brain",
  },
  {
    num: "02",
    title: "Micro Batches",
    desc: "Strictly capped at 15 students per batch. This ensures the faculty maintains a direct pulse on every individual student's learning pace and doubts.",
    iconName: "users",
  },
  {
    num: "03",
    title: "Diagnostic Testing",
    desc: "Weekly chapter tests designed on exact CBSE/ICSE board patterns identify weak areas well before pre-board and final examinations.",
    iconName: "chart",
  },
  {
    num: "04",
    title: "Doubt Resolution",
    desc: "No question goes unanswered. We conduct dedicated 1-on-1 doubt clearing hours before and after regular lecture timings.",
    iconName: "target",
  },
  {
    num: "05",
    title: "Defence Mentorship",
    desc: "Our Defence Wing prepares young aspirants for NDA, RIMC, RMS, and Sainik School with structured General Ability and Mathematics modules.",
    iconName: "shield",
  },
  {
    num: "06",
    title: "Parent Connect",
    desc: "Parents receive regular progress reports, attendance updates, and scheduled counseling sessions to stay fully aligned on academic growth.",
    iconName: "handshake",
  },
]

const TIMELINE = [
  {
    year: "2018",
    title: "Foundation in Dehradun",
    desc: "SixBytes was founded by Jaspal Singh Chauhan with a vision to bring premium, small-batch science and maths coaching to Premnagar.",
  },
  {
    year: "2020",
    title: "Defence Wing Expansion",
    desc: "Launched dedicated NDA, RIMC, and Sainik School entrance preparatory batches with specialized faculty and test series.",
  },
  {
    year: "2023",
    title: "Smart Learning & Material Portal",
    desc: "Integrated digital student dashboard and centralized study materials, helping over 1,000+ students access curated notes seamlessly.",
  },
  {
    year: "2026",
    title: "Shyampur & Premnagar Benchmark",
    desc: "Celebrated consistent 94%+ board results and multiple selections in defence examinations, establishing SixBytes as the leading local institute.",
  },
]

export default function About() {
  return (
    <div className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════════
          1. ABOUT HERO SECTION — Stretched to single window
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
        <ParticleField particleCount={40} />
        <OrbitRings className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full my-auto">
          <RevealWrapper delay={0}>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="orange-rule" />
              <span className="section-label">Our Story & Mission</span>
              <span className="orange-rule scale-x-[-1]" />
            </div>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-cream tracking-tight leading-tight mb-3">
              Empowering Minds, <br />
              <span className="text-gradient-orange">Forging Achievers</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <p className="text-base sm:text-lg font-serif italic text-muted-custom max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Founded on the belief that personalized mentorship and rigorous concept clarity can unlock exceptional potential in every student.
            </p>
          </RevealWrapper>

          <RevealWrapper delay={300}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08] max-w-3xl mx-auto">
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-orange-400">
                  <Counter end={1200} />+
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-custom mt-1 font-semibold">
                  Alumni Network
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-orange-400">
                  <Counter end={100} suffix="%" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-custom mt-1 font-semibold">
                  Pass Record
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-orange-400">
                  <Counter end={15} />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-custom mt-1 font-semibold">
                  Max Batch Size
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-orange-400">
                  <Counter end={8} suffix="+" />
                </div>
                <div className="text-[11px] uppercase tracking-wider text-muted-custom mt-1 font-semibold">
                  Years Established
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <ShimmerLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. WHO WE ARE / FOUNDER PROFILE — Stretched to single window
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-6xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Image Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 h-88 sm:h-[380px] rounded-2xl overflow-hidden border border-white/15 bg-navy-mid shadow-2xl">
                <img
                  src="/founder.png"
                  alt="Jaspal Singh Chauhan"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <TagPill variant="orange" className="mb-1.5">Founder & Mentor</TagPill>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-cream">
                    Jaspal Singh Chauhan
                  </h3>
                  <p className="text-[11px] text-muted-custom font-medium">
                    SixBytes Educational Institute
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-4">
              <SectionHeader
                label="Leadership & Vision"
                title="A Message from the"
                highlightedWord="Founder"
                align="left"
                className="!mb-3"
              />

              <p className="text-sm sm:text-base text-cream/90 font-sans leading-relaxed">
                When I established <strong className="text-orange-400 font-semibold">SixBytes Educational Institute</strong> in Shyampur, Premnagar, I observed that many students were getting lost in overcrowded classrooms where individual doubts were routinely ignored.
              </p>

              <p className="text-sm sm:text-base text-muted-custom font-sans leading-relaxed">
                Our core philosophy has always been simple: <strong className="text-cream">mastery starts with curiosity and disciplined guidance</strong>. Whether a student aims for a 95%+ in their Class 10/12 Board examinations or dreams of wearing the uniform through the National Defence Academy (NDA), our teaching methodology breaks down intimidation into achievable daily triumphs.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                <span className="font-serif italic text-sm sm:text-base text-cream/90 block">
                  &ldquo;We don’t just prepare students for exams. We build their confidence, sharpen their logic, and ignite an enduring commitment to excellence.&rdquo;
                </span>
                <span className="text-[11px] uppercase tracking-widest text-orange-400 font-bold block pt-0.5">
                  — Jaspal Singh Chauhan
                </span>
              </div>

              <div className="pt-1">
                <CTAButton
                  href="https://wa.me/917536839760?text=Hello%20Sir,%20I%20would%20like%20to%20discuss%20admissions."
                  variant="filled"
                  className="!py-2.5 !px-6 text-sm"
                >
                  Connect Directly on WhatsApp
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. 6 PILLARS OF EXCELLENCE — Compact 3x2 Grid that fits 100vh
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-6xl mx-auto w-full my-auto">
          <SectionHeader
            label="Our Core Pedagogy"
            title="The Six Pillars of"
            highlightedWord="SixBytes"
            subtitle="The fundamental principles that guide our classroom teaching, student tracking, and exam success."
            className="!mb-6 sm:!mb-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((pillar, idx) => (
              <RevealWrapper key={pillar.title} delay={idx * 50}>
                <GlassCard className="h-full p-4 sm:p-5 group border-white/[0.08] hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <PremiumIcon name={pillar.iconName} size="sm" variant="orange" />
                    <span className="font-serif text-xl font-bold text-white/20 group-hover:text-orange-400/60 transition-colors">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-cream mb-1.5 group-hover:text-orange-400 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-muted-custom font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. INSTITUTE TIMELINE & JOURNEY — Stretched to single window
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-5xl mx-auto w-full my-auto">
          <SectionHeader
            label="Our Growth"
            title="A Journey of Uncompromising"
            highlightedWord="Standards"
            subtitle="How SixBytes evolved from a focused science academy into Dehradun’s premier boards & defence coaching destination."
            className="!mb-8"
          />

          <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 space-y-6 pl-6 sm:pl-10">
            {TIMELINE.map((item, idx) => (
              <RevealWrapper key={item.year} delay={idx * 60}>
                <div className="relative group">
                  {/* Timeline bullet dot */}
                  <span className="absolute -left-[31px] sm:-left-[47px] top-2 w-3.5 h-3.5 rounded-full bg-obsidian border-2 border-orange-400 group-hover:bg-orange-500 transition-colors" />

                  <GlassCard className="p-4 sm:p-5 border-white/[0.08] hover:border-orange-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-0.5 block">
                      {item.year}
                    </span>
                    <h3 className="text-base sm:text-lg font-display font-bold text-cream mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-custom font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </GlassCard>
                </div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. ABOUT CTA — Full Viewport Finish
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[65vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-obsidian text-center">
        <div className="max-w-4xl mx-auto space-y-6 my-auto">
          <SectionHeader
            label="Experience the Difference"
            title="Attend a Trial Class at Our"
            highlightedWord="Shyampur Campus"
            subtitle="Meet the faculty, experience our classroom environment, and review your child’s academic roadmap with our mentors."
            className="!mb-6"
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20schedule%20a%20campus%20visit."
              variant="filled"
              className="w-full sm:w-auto text-base !py-3.5 !px-8"
            >
              Schedule Campus Visit
            </CTAButton>
            <CTAButton href="/courses" variant="outline" className="w-full sm:w-auto text-base !py-3.5 !px-8">
              Explore Our Batches
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}