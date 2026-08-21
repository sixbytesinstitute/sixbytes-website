import ParticleField from "../components/ui/particle-field"
import RevealWrapper from "../components/ui/reveal-wrapper"
import SectionHeader from "../components/ui/section-header"
import GlassCard from "../components/ui/glass-card"
import CTAButton from "../components/ui/cta-button"
import TagPill from "../components/ui/tag-pill"
import ShimmerLine from "../components/ui/shimmer-line"
import Counter from "../components/ui/counter"
import PremiumIcon from "../components/ui/premium-icon"

export const metadata = {
  title: "Results & Board Toppers | SixBytes Institute Premnagar & Shyampur",
  description:
    "Explore the top board examination scores and rankers from SixBytes Educational Institute in Shyampur & Premnagar, Dehradun. Consistent 94%+ toppers in Class 10 & 12 Science.",
}

const TOPPERS = [
  {
    name: "Ishant Bisht",
    class: "Class 10 CBSE Board",
    score: "94%",
    image: "/topper1.jpg",
    badge: "Subject Topper",
    subjects: "Science & Mathematics 95+",
    quote: "The personalized doubt clearing and chapter-wise mock papers gave me complete exam confidence.",
  },
  {
    name: "Anshika Baluni",
    class: "Class 12 Science (PCM)",
    score: "94%",
    image: "/topper2.jpg",
    badge: "District Ranker",
    subjects: "Physics, Chemistry & Maths Distinction",
    quote: "SixBytes simplified complex Physics numericals and organic chemistry reactions effortlessly.",
  },
  {
    name: "Shubham Bisht",
    class: "Class 12 Science (PCM)",
    score: "94%",
    image: "/student2.jpg",
    badge: "School Topper",
    subjects: "Science Stream Aggregate",
    quote: "Small batch size ensured Jaspal Sir monitored my errors in every single test paper.",
  },
  {
    name: "Shray Sundly",
    class: "Class 12 Science (PCB)",
    score: "87%",
    image: "/student1.jpg",
    badge: "Merit Achiever",
    subjects: "Biology & Chemistry Excellence",
    quote: "The test series and detailed feedback helped me consistently improve my writing speed.",
  },
]

const KEY_METRICS = [
  { val: 94, suffix: "%", label: "Top Board Score", sub: "CBSE & ICSE Boards" },
  { val: 100, suffix: "%", label: "Pass Percentage", sub: "Consecutive 5 Years" },
  { val: 85, suffix: "%+", label: "Batch Average", sub: "Class 10 & 12 Science" },
  { val: 50, suffix: "+", label: "Merit Holders", sub: "Above 90% Aggregate" },
]

export default function Results() {
  return (
    <div className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════════
          1. RESULTS HERO SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
        <ParticleField particleCount={40} />

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full my-auto">
          <RevealWrapper delay={0}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="orange-rule" />
              <span className="section-label">Academic Hall of Fame</span>
              <span className="orange-rule scale-x-[-1]" />
            </div>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-cream tracking-tight leading-tight mb-4">
              Proven Results, <br />
              <span className="text-gradient-orange">Unmatched Consistency</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <p className="text-base sm:text-xl font-serif italic text-muted-custom max-w-2xl mx-auto leading-relaxed font-light">
              Every year, students at SixBytes set new benchmarks in CBSE and ICSE Board examinations through relentless discipline and mentor guidance.
            </p>
          </RevealWrapper>

          {/* Metric Highlights */}
          <RevealWrapper delay={300}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/[0.08] max-w-4xl mx-auto">
              {KEY_METRICS.map((m) => (
                <div key={m.label} className="p-3">
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-orange-400">
                    <Counter end={m.val} suffix={m.suffix} />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-cream font-bold mt-1">
                    {m.label}
                  </div>
                  <div className="text-[10px] text-muted-custom font-medium mt-0.5">
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          </RevealWrapper>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <ShimmerLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. TOPPERS GALLERY GRID — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Board Rankers"
            title="Meet Our Star"
            highlightedWord="Performers"
            subtitle="Real students, real scores. These achievers trusted SixBytes’ micro-batch mentorship to conquer their board exams."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {TOPPERS.map((topper, idx) => (
              <RevealWrapper key={topper.name} delay={idx * 80}>
                <GlassCard padding="lg" className="h-full border-white/[0.08] hover:border-orange-500/30 group flex flex-col justify-between">
                  <div>
                    {/* Header with Photo & Badge */}
                    <div className="flex items-center gap-5 mb-5">
                      <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-obsidian">
                        <img
                          src={topper.image}
                          alt={topper.name}
                          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <TagPill variant="orange">{topper.badge}</TagPill>
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-cream group-hover:text-orange-400 transition-colors">
                          {topper.name}
                        </h3>
                        <p className="text-xs uppercase font-semibold tracking-wider text-orange-400/90">
                          {topper.class}
                        </p>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between mb-3.5">
                      <span className="text-xs font-semibold text-muted-custom uppercase tracking-wider">
                        {topper.subjects}
                      </span>
                      <span className="text-3xl font-serif font-bold text-orange-400">
                        {topper.score}
                      </span>
                    </div>

                    {/* Student Quote */}
                    <p className="text-sm font-serif italic text-cream/80 leading-relaxed font-light">
                      &ldquo;{topper.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] mt-4 text-xs text-dim-custom">
                    Verified SixBytes Classroom Student
                  </div>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. HOW WE PRODUCE RESULTS (METHODOLOGY) — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-6xl mx-auto w-full my-auto">
          <SectionHeader
            label="The Success Formula"
            title="How SixBytes Produces"
            highlightedWord="Top Rankers"
            subtitle="Top results are not an accident—they are the outcome of a structured, battle-tested preparation system."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealWrapper delay={0}>
              <GlassCard className="h-full space-y-4 border-white/[0.08] hover:border-orange-500/30">
                <PremiumIcon name="target" size="md" variant="orange" />
                <h3 className="text-lg font-display font-bold text-cream">
                  1. Diagnostic Testing
                </h3>
                <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
                  Every week, students sit for board-pattern test papers. We grade each script with precise line-by-line commentary to identify root misunderstandings.
                </p>
              </GlassCard>
            </RevealWrapper>

            <RevealWrapper delay={100}>
              <GlassCard className="h-full space-y-4 border-white/[0.08] hover:border-orange-500/30">
                <PremiumIcon name="chart" size="md" variant="orange" />
                <h3 className="text-lg font-display font-bold text-cream">
                  2. Answer Writing Drills
                </h3>
                <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
                  Knowing the concept is only half the battle. We train students on step-marking schemes, presentation standards, and time management strategies.
                </p>
              </GlassCard>
            </RevealWrapper>

            <RevealWrapper delay={200}>
              <GlassCard className="h-full space-y-4 border-white/[0.08] hover:border-orange-500/30">
                <PremiumIcon name="crown" size="md" variant="orange" />
                <h3 className="text-lg font-display font-bold text-cream">
                  3. Mentorship by Jaspal Sir
                </h3>
                <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
                  Direct personal mentorship maintains high morale, removes exam anxiety, and builds the competitive stamina required for 90%+ aggregates.
                </p>
              </GlassCard>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. RESULTS CTA — Full Screen Finish
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy text-center">
        <div className="max-w-4xl mx-auto space-y-8 my-auto">
          <SectionHeader
            label="Be the Next Topper"
            title="Your Name Belongs in the"
            highlightedWord="Hall of Fame"
            subtitle="Join our upcoming batch in Shyampur, Premnagar and begin your disciplined transformation today."
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20enroll%20in%20the%20toppers%20batch."
              variant="filled"
              className="w-full sm:w-auto text-base !py-3.5 !px-8"
            >
              Enroll for Demo Class
            </CTAButton>
            <CTAButton href="/courses" variant="outline" className="w-full sm:w-auto text-base !py-3.5 !px-8">
              Explore Available Batches
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}