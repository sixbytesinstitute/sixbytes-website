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
import FAQItem from "./components/ui/faq-item"

export const metadata = {
  title: "SixBytes Educational Institute | Premier Coaching in Premnagar & Shyampur, Dehradun",
  description:
    "Dehradun's top-ranked coaching institute for Class 9–12 CBSE/ICSE board exams, NDA, RIMC, and Sainik School. Small batches, personalized learning, expert faculty, and proven 94% board results.",
  keywords: [
    "coaching institute in Premnagar",
    "coaching institute in Shyampur",
    "coaching center in Dehradun",
    "best tuition in Premnagar Dehradun",
    "CBSE Class 10 coaching Dehradun",
    "Class 12 science tuition Dehradun",
    "NDA coaching in Dehradun",
    "educational institute Dehradun",
    "board exams preparation Dehradun",
    "personalized learning coaching",
  ],
  alternates: {
    canonical: "https://sixbytes.in",
  },
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
    desc: "Rigorous concept clarity in Mathematics and Science with regular test series, doubt clearing, and board pattern practice for secondary school academic courses.",
    highlights: ["Mathematics & Science", "Weekly Assessment Tests", "Small Batch Sizes (15 max)", "NCERT Exemplar Solutions"],
    href: "/courses",
  },
  {
    tag: "Senior Wing",
    title: "Class 11 & 12",
    subtitle: "Science Stream (PCM / PCB)",
    iconName: "atom",
    desc: "Targeted classroom programs for Physics, Chemistry, Mathematics, and Biology with dual focus on CBSE/ISC board exams and competitive entrance foundations.",
    highlights: ["Physics, Chem, Maths, Bio", "Competitive Foundation", "Past 10-Year Question Drill", "Formula Derivation Mastery"],
    href: "/courses",
  },
  {
    tag: "Defence Academy",
    title: "NDA & RIMC / RMS",
    subtitle: "Officer Cadre Entrance Prep",
    iconName: "shield",
    desc: "Specialized defence wing coaching covering Mathematics, General Ability Test (GAT), English language classes, character building, and SSB physical mentorship.",
    highlights: ["NDA Written & GAT", "Sainik School & RMS Prep", "Expert Defence Faculty", "SSB Interview & Personality Prep"],
    href: "/courses",
  },
]

const INSTITUTE_BENEFITS: Array<{
  title: string
  desc: string
  icon: IconName
  tag: string
}> = [
  {
    title: "Personalized Learning & Tailored Pace",
    desc: "A strict limit of 15 students per batch ensures smart guidance calibrated to every student's tailored learning pace, unlocking deep subject knowledge without cognitive stress.",
    icon: "users",
    tag: "Individual Focus",
  },
  {
    title: "Academic Excellence in Board Exams",
    desc: "Laser-focused CBSE & ICSE board exams curriculum with rigorous formula derivations, chemical equation balancing, and past 10-year question drills that produce consistent 90%+ aggregates.",
    icon: "trophy",
    tag: "94% Top Scores",
  },
  {
    title: "Intensive Courses & One-Day Seminars",
    desc: "Targeted intensive course crash batches, formula masterclasses, and one-day seminars on high-weightage selected topics to maximize revision velocity before finals.",
    icon: "sparkles",
    tag: "High-Yield Prep",
  },
  {
    title: "Competitive Exams & Defence Preparation",
    desc: "Specialized classroom programs for NDA, RIMC, Rashtriya Military School (RMS), and Sainik School combining advanced mathematics with General Ability Test (GAT) drills.",
    icon: "shield",
    tag: "Officer Cadre",
  },
  {
    title: "Character Building & Communication Skills",
    desc: "Holistic skills development encompassing English communication skills, structured group discussions, and mental discipline essential for NDA SSB interviews and life success.",
    icon: "target",
    tag: "Holistic Mentorship",
  },
  {
    title: "Transparent Feedback Sessions & Progress",
    desc: "Continuous diagnostic assessment with weekly test analytics and structured parent feedback sessions to track measurable student progress and eliminate exam anxiety.",
    icon: "chart",
    tag: "Continuous Growth",
  },
]

const STUDY_MODES = [
  {
    title: "Offline Classroom Programs",
    badge: "Primary Campus Mode",
    desc: "Immersive face-to-face daily classroom coaching at our Shyampur campus with experienced faculty mentors, structured blackboard derivations, and lively peer problem-solving.",
    bullets: ["Direct mentor eye contact & daily accountability", "Live interactive doubt elimination", "Exam-simulated weekly test drills"],
  },
  {
    title: "Interactive Doubt & Practice Clinics",
    badge: "Personalized Care",
    desc: "Daily post-class doubt resolution where students master tricky formulas, challenging NCERT problems, and selected topics at their own individual learning pace.",
    bullets: ["Zero backlog accumulation", "1-on-1 mentor guidance on weak topics", "Customized remedial question sets"],
  },
  {
    title: "Digital Study Hub & Resource Library",
    badge: "Online Support",
    desc: "Comprehensive chapter-wise NCERT concept notes, solved question banks, formula sheets, and chemical reaction guides available 24/7 through our student resource library.",
    bullets: ["Self-paced revision at home", "High-yield board exam summaries", "Free access for all enrolled students"],
  },
]

const TOPPERS = [
  {
    name: "Ishant Bisht",
    exam: "Class 10 ICSE Board",
    score: "94%",
    image: "/topper1.jpg",
    badge: "Subject Topper",
  },
  {
    name: "Anshika Baluni",
    exam: "Class 12 ISC Board",
    score: "94%",
    image: "/topper2.jpg",
    badge: "District Ranker",
  },
  {
    name: "Shubham Bisht",
    exam: "Class 12 ISC Board",
    score: "94%",
    image: "/student2.jpg",
    badge: "School Topper",
  },
  {
    name: "Shray Sundly",
    exam: "Class 12 ISC Board",
    score: "87%",
    image: "/student1.jpg",
    badge: "Merit Achiever",
  },
]

const TESTIMONIALS = [
  {
    quote:
      "The individual attention, regular parent-student feedback sessions, and rigorous test series at SixBytes completely transformed my board preparation. My conceptual understanding and academic progress jumped to a 94% aggregate in Class 10 ICSE boards.",
    name: "Ishant Bisht",
    role: "Scored 94% in Class 10 Boards (ICSE)",
    rating: 5,
  },
  {
    quote:
      "SixBytes provided the exact personalized learning environment I needed for Class 12 Science (PCM). The tailored learning pace and deep subject knowledge in Physics and Chemistry made ISC board exams and competitive entrance prep crystal clear.",
    name: "Anshika Baluni",
    role: "Scored 94% in Class 12 Science (ISC Board)",
    rating: 5,
  },
  {
    quote:
      "Best coaching institute in the Premnagar and Shyampur area. Sir personally tracks every student’s academic progress, conducts transparent feedback sessions, and turns weaknesses into solid strengths. You won't find this level of mentorship in generic home tuition.",
    name: "Rajeev Sundly",
    role: "Parent of Class 12 ISC Student",
    rating: 5,
  },
]

const FAQS = [
  {
    question: "Why choose SixBytes Educational Institute over generic home tuition or online tuition in Premnagar?",
    answer:
      "Unlike isolated home tuition or passive online tuition, SixBytes delivers a structured offline classroom program with small batches capped at 15 students. Learners benefit from direct mentorship by experienced faculty, healthy peer motivation, daily doubt-clearing sessions, and board-pattern test series that cultivate deep subject knowledge and academic excellence.",
  },
  {
    question: "What academic courses and classroom programs are offered at SixBytes?",
    answer:
      "We offer comprehensive offline tuition and classroom courses for secondary and senior secondary students: Class 9 & 10 Foundation (CBSE/ICSE Mathematics & Science) and Class 11 & 12 Senior Wing (Physics, Chemistry, Mathematics, Biology). In addition, we run dedicated defence academy coaching for competitive exams including NDA, RIMC, RMS, and Sainik School.",
  },
  {
    question: "How does the institute ensure personalized learning and a tailored learning pace?",
    answer:
      "Every learner has distinct cognitive strengths. By strictly limiting batch sizes to 15 students, our mentors provide smart guidance adapted to each student's tailored learning pace. We conduct 1-on-1 doubt clinics on selected topics, customized problem sets, and diagnostic revision before major board exams.",
  },
  {
    question: "How are student progress reports and parent feedback sessions organized?",
    answer:
      "We conduct weekly chapter-wise assessment tests and regular parent feedback sessions. Parents receive clear analytics on student progress, attendance, homework completion, and conceptual accuracy, ensuring continuous academic growth without undue pressure or exam anxiety.",
  },
  {
    question: "What preparation is provided for NDA, RIMC, and competitive defence exams?",
    answer:
      "Our Defence Academy classroom program covers advanced Mathematics, General Ability Test (GAT), and English language classes. We also emphasize character building, communication skills, analytical problem-solving, and SSB interview guidance led by experienced mentors.",
  },
  {
    question: "Does the institute conduct intensive courses and one-day seminars for board revision?",
    answer:
      "Yes. Ahead of CBSE and ICSE board exams, SixBytes conducts intensive courses, weekend test drills, and high-impact one-day seminars focusing on high-weightage selected topics, past 10-year question patterns, and board exam scoring techniques.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
                #1 Coaching Institute in Premnagar & Shyampur, Dehradun
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
              Premier educational institute delivering personalized learning, academic excellence in CBSE & ICSE board exams, and dedicated defence coaching for NDA, RIMC, RMS & Sainik School.
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
                Explore Classroom Programs
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
          2. BENEFITS & METHODOLOGY — The SixBytes Institute Advantage
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-navy border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            label="Why Choose Our Institute"
            title="Engineered for"
            highlightedWord="Academic Excellence"
            subtitle="Explore the proven educational pillars that set SixBytes apart from generic home tuition and commercial coaching chains in Dehradun."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSTITUTE_BENEFITS.map((benefit, index) => (
              <RevealWrapper key={benefit.title} delay={index * 70}>
                <GlassCard className="h-full flex flex-col justify-between border-white/[0.08] hover:border-orange-500/30 transition-all p-6 sm:p-7 group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <PremiumIcon name={benefit.icon} size="md" variant="orange" />
                      <TagPill variant="orange">{benefit.tag}</TagPill>
                    </div>

                    <h3 className="text-xl font-display font-bold text-cream mb-2 group-hover:text-orange-400 transition-colors">
                      {benefit.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-custom leading-relaxed font-sans">
                      {benefit.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-orange-400/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Smart Guidance & Board Mentorship</span>
                  </div>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. PROGRAMS & COURSES SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Academic Wings"
            title="Classroom Programs &"
            highlightedWord="Academic Courses"
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
          4. STUDY MODES & OFFLINE TUITION ADVANTAGE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-navy border-y border-white/5">
        <div className="max-w-7xl mx-auto w-full">
          <SectionHeader
            label="Flexible Study Modes"
            title="Offline Tuition with"
            highlightedWord="Comprehensive Digital Support"
            subtitle="How SixBytes blends disciplined classroom learning with personalized doubt-clearing and 24/7 digital resource access."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {STUDY_MODES.map((mode, idx) => (
              <RevealWrapper key={mode.title} delay={idx * 80}>
                <GlassCard className="h-full flex flex-col justify-between border-white/[0.08] hover:border-orange-500/30 p-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                        {mode.badge}
                      </span>
                      <PremiumIcon name="book" size="sm" variant="orange" />
                    </div>

                    <h3 className="text-xl font-display font-bold text-cream mb-2">
                      {mode.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-custom leading-relaxed mb-4">
                      {mode.desc}
                    </p>

                    <ul className="space-y-2 border-t border-white/10 pt-3">
                      {mode.bullets.map((b) => (
                        <li key={b} className="text-xs text-cream/90 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </RevealWrapper>
            ))}
          </div>

          {/* Comparison banner: Why Classroom beats Home/Online */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h4 className="text-lg sm:text-xl font-display font-bold text-cream">
                Why Classroom Coaching Outperforms Generic Home Tuition & Online Courses
              </h4>
              <p className="text-xs sm:text-sm text-muted-custom leading-relaxed">
                Generic home tuition often lacks structured peer benchmarking, while isolated online tuition suffers from high distraction and low accountability. At SixBytes, structured offline batches foster competitive discipline, mentor-guided study routines, and instant concept clarification.
              </p>
            </div>
            <CTAButton
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20want%20to%20schedule%20an%20offline%20demo%20class."
              variant="filled"
              className="shrink-0 text-xs sm:text-sm !py-3 !px-6 whitespace-nowrap"
            >
              Experience a Classroom Demo
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TOPPERS & RESULTS SHOWCASE — Prominent, Big & Highly Readable Cards
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Hall of Fame"
            title="Consistent Results,"
            highlightedWord="Extraordinary"
            subtitle="Numbers speak louder than promises. Celebrate the brilliant milestones achieved by SixBytes students in ICSE & ISC Board Exams."
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
          6. FOUNDER & PEDAGOGY SPOTLIGHT — Full Viewport Screen
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
                      Strict limit of 15 students per batch ensures direct interaction, prompt doubt resolution, and tailored learning pace.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PremiumIcon name="chart" size="sm" variant="orange" />
                      <span className="text-orange-400 text-xs sm:text-sm font-bold">Test Analytics</span>
                    </div>
                    <p className="text-[11px] text-muted-custom leading-relaxed">
                      Weekly assessment exams with in-depth feedback pinpointing conceptual gaps and exam stress early.
                    </p>
                  </div>
                </div>

                {/* Pedagogical Heritage & Meaning of Institute */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-muted-custom space-y-1">
                  <div className="font-semibold text-orange-400/90 uppercase tracking-wider text-[10px]">
                    The True Essence of an Educational Institute
                  </div>
                  <p className="text-[11px] leading-relaxed font-sans text-gray-400">
                    Derived from the classical Latin <em>institutus</em> and <em>instituere</em> (which entered Middle English around the 14th century, 1534 as an established statute of learning and character building), an institute is far more than a tutoring center. SixBytes was instituted to function as an institute for research on student learning psychology, helping students master subject knowledge while eliminating the root causes of mental fatigue and exam stress.
                  </p>
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
          7. TESTIMONIALS SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-7xl mx-auto w-full my-auto">
          <SectionHeader
            label="Student & Parent Voices"
            title="Trusted by Families in"
            highlightedWord="Premnagar & Shyampur"
            subtitle="Read how our dedicated faculty, regular feedback sessions, and personalized approach help students achieve their dream scores."
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
          8. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-navy border-t border-white/5">
        <div className="max-w-4xl mx-auto w-full">
          <SectionHeader
            label="Got Questions?"
            title="Frequently Asked"
            highlightedWord="Questions"
            subtitle="Everything parents and students need to know about our admissions, batch sizes, academic courses, and coaching methodology."
          />

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <RevealWrapper key={faq.question} delay={idx * 60}>
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={idx === 0}
                />
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9. LOCAL SEO & FINAL CTA — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy-mid/70 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-6 w-full my-auto">
          <div className="space-y-3">
            <TagPill variant="orange">Local Academic Landmark</TagPill>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream">
              Why SixBytes is the #1 Choice in Shyampur & Premnagar, Dehradun
            </h2>
            <p className="text-xs sm:text-sm text-muted-custom font-sans leading-relaxed max-w-3xl mx-auto">
              Conveniently situated opposite Lane No. 3 in Sai Vihar, Shyampur, SixBytes is the trusted coaching center for students from schools across Premnagar, Manduwala, Sudhowala, Selaqui, and the wider Dehradun valley. Whether preparing for Class 10/12 Board Exams or the prestigious National Defence Academy (NDA), our faculty brings proven results to your neighborhood.
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
              Seats in our core batches are strictly limited to 15 students to ensure personalized attention and tailored learning pace for every learner.
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