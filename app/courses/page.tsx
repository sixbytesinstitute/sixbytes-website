import ParticleField from "../components/ui/particle-field"
import RevealWrapper from "../components/ui/reveal-wrapper"
import SectionHeader from "../components/ui/section-header"
import GlassCard from "../components/ui/glass-card"
import CTAButton from "../components/ui/cta-button"
import TagPill from "../components/ui/tag-pill"
import ShimmerLine from "../components/ui/shimmer-line"
import FAQItem from "../components/ui/faq-item"
import PremiumIcon, { type IconName } from "../components/ui/premium-icon"

export const metadata = {
  title: "Courses & Programs | Class 9–12 & Defence Coaching in Dehradun",
  description:
    "Explore courses at SixBytes Institute: Class 9–10 Foundation, Class 11–12 Science (PCM/PCB), and Defence Wing (NDA, RIMC, Sainik School). Located in Shyampur & Premnagar, Dehradun.",
}

const COURSES: Array<{
  id: string
  num: string
  iconName: IconName
  tag: string
  title: string
  subtitle: string
  description: string
  subjects: string[]
  features: string[]
  stat1: { val: string; label: string }
  stat2: { val: string; label: string }
}> = [
  {
    id: "foundation",
    num: "01",
    iconName: "compass",
    tag: "Foundation Wing",
    title: "Class 9 & 10 Foundation",
    subtitle: "CBSE & ICSE Board Excellence in Premnagar & Shyampur",
    description:
      "Our Class 9–10 Foundation Programme builds rock-solid conceptual clarity in Mathematics and Science. Through micro batches, weekly assessments, and personalized doubt sessions, students build an unshakeable base for senior secondary boards.",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    features: [
      "Deep conceptual fundamentals, zero rote memorization",
      "Weekly chapter tests with detailed error analysis",
      "One-on-one doubt clearing sessions before every exam",
      "Regular progress tracking and direct parent communication",
      "Board examination answer-writing drills and mock papers",
    ],
    stat1: { val: "95%+", label: "Avg Board Score" },
    stat2: { val: "15 Max", label: "Students / Batch" },
  },
  {
    id: "senior-science",
    num: "02",
    iconName: "atom",
    tag: "Senior Wing",
    title: "Class 11 & 12 Science",
    subtitle: "Physics, Chemistry, Maths & Biology (PCM / PCB)",
    description:
      "Targeted senior secondary coaching balancing board curriculum requirements with competitive entrance problem-solving. Structured pedagogy covering theory, derivations, numerical mastery, and past 10-year question patterns.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    features: [
      "Comprehensive syllabus completion 3 months prior to board exams",
      "Extensive numerical problem solving and formula sheet drills",
      "Full-length 3-hour pre-board simulations with board-standard checking",
      "Special focus on NCERT exemplar problems and HOTS questions",
      "Dedicated mentoring for school practicals and viva voce",
    ],
    stat1: { val: "94%", label: "Top Science Score" },
    stat2: { val: "100%", label: "First Division Rate" },
  },
  {
    id: "defence-wing",
    num: "03",
    iconName: "shield",
    tag: "Defence Academy",
    title: "NDA & Defence Entrance Wing",
    subtitle: "NDA, RIMC, Rashtriya Military School & Sainik School",
    description:
      "Dehradun’s dedicated coaching program for defence aspirants. Comprehensive coverage of NDA Mathematics, General Ability Test (GAT), English grammar & comprehension, General Science, and current affairs.",
    subjects: ["NDA Maths (11 & 12 level)", "English", "General Science", "General Knowledge & Current Affairs"],
    features: [
      "Speed arithmetic and shortcut techniques for NDA paper 1",
      "Daily vocabulary building and reading comprehension drills",
      "Weekly timed full-length GAT mock tests on OMR sheets",
      "Physical fitness orientation and Officer-Like Qualities (OLQ) talks",
      "RIMC & Sainik School junior entrance preparation batches",
    ],
    stat1: { val: "Multiple", label: "NDA Written Cleared" },
    stat2: { val: "Dedicated", label: "Defence Faculty" },
  },
]

const COMPARISON_ROWS = [
  {
    feature: "Batch Size",
    sixbytes: "Strictly 15 students max",
    standard: "40–60 students crowded",
  },
  {
    feature: "Doubt Resolution",
    sixbytes: "Daily 1-on-1 personalized sessions",
    standard: "Limited or rushed after class",
  },
  {
    feature: "Testing Frequency",
    sixbytes: "Weekly chapter tests + monthly mocks",
    standard: "Only terminal or quarterly tests",
  },
  {
    feature: "Faculty Continuity",
    sixbytes: "Senior mentors taught by Jaspal Sir",
    standard: "High faculty turnover",
  },
  {
    feature: "Parent Reporting",
    sixbytes: "Direct WhatsApp & monthly counseling",
    standard: "Generic automated SMS only",
  },
  {
    feature: "Study Material",
    sixbytes: "Curated chapter notes & formula banks",
    standard: "Standard photocopied sheets",
  },
]

const FAQS = [
  {
    question: "What is the typical batch size at SixBytes Institute?",
    answer:
      "We strictly limit all our batches to a maximum of 15 students. This ensures that the teacher can observe every student’s learning curve, answer individual questions, and provide personalized attention.",
  },
  {
    question: "How do you prepare students for both Boards and Competitive/Defence exams?",
    answer:
      "Our curriculum is synchronized. We first establish strong theoretical and conceptual clarity aligned with CBSE/ICSE board textbooks, and then layer on competitive shortcut techniques, previous years’ entrance questions (PYQs), and timed speed tests.",
  },
  {
    question: "Can we attend a trial or demo class before enrolling?",
    answer:
      "Yes! We offer a complimentary Free Demo Class for any course. This gives the student and parents an opportunity to experience our classroom methodology and interact with the faculty.",
  },
  {
    question: "What are the institute timings and batch schedules?",
    answer:
      "Classes operate Monday through Saturday between 3:00 PM and 8:00 PM. Separate morning and evening slots are available for defence wing aspirants and school board students.",
  },
  {
    question: "Where is SixBytes located in Dehradun?",
    answer:
      "Our campus is located Opp. Lane No. 3, Sai Vihar, Shyampur, Premnagar, Dehradun (PIN 248007). It is easily accessible from Premnagar Chowk, Manduwala, and Sudhowala.",
  },
]

export default function Courses() {
  return (
    <div className="relative overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════════
          1. COURSES HERO SECTION — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0c0e] via-[#0f1318] to-[#0a0c0e]">
        <ParticleField particleCount={40} />

        <div className="relative z-10 max-w-4xl mx-auto text-center w-full my-auto">
          <RevealWrapper delay={0}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="orange-rule" />
              <span className="section-label">Academic Offerings</span>
              <span className="orange-rule scale-x-[-1]" />
            </div>
          </RevealWrapper>

          <RevealWrapper delay={100}>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-cream tracking-tight leading-tight mb-4">
              Structured for <span className="text-gradient-orange">Rankers</span>, <br />
              Tailored for Every Learner
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <p className="text-base sm:text-xl font-serif italic text-muted-custom max-w-2xl mx-auto leading-relaxed font-light">
              Explore our specialized batches for CBSE/ICSE Class 9–12 and prestigious Defence Academy entrance examinations.
            </p>
          </RevealWrapper>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <ShimmerLine />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. DETAILED COURSE CARDS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-navy relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {COURSES.map((course, idx) => (
            <RevealWrapper key={course.id} delay={idx * 80}>
              <GlassCard padding="lg" className="border-white/[0.08] hover:border-orange-500/30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Title, Tag & Stats */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <PremiumIcon name={course.iconName} size="md" variant="orange" />
                      <TagPill variant="orange">{course.tag}</TagPill>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-cream">
                      {course.title}
                    </h2>
                    <p className="text-xs uppercase tracking-wider font-semibold text-orange-400">
                      {course.subtitle}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                        <span className="text-xl font-serif font-bold text-orange-400 block">
                          {course.stat1.val}
                        </span>
                        <span className="text-[10px] uppercase text-muted-custom font-bold">
                          {course.stat1.label}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                        <span className="text-xl font-serif font-bold text-orange-400 block">
                          {course.stat2.val}
                        </span>
                        <span className="text-[10px] uppercase text-muted-custom font-bold">
                          {course.stat2.label}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <CTAButton
                        href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20am%20interested%20in%20"
                        variant="filled"
                        className="w-full text-xs"
                      >
                        Enroll / Enquire Now
                      </CTAButton>
                    </div>
                  </div>

                  {/* Right Column: Syllabus, Features & Highlights */}
                  <div className="lg:col-span-8 space-y-6">
                    <p className="text-sm sm:text-base text-cream/90 font-sans leading-relaxed">
                      {course.description}
                    </p>

                    {/* Subjects Covered */}
                    <div>
                      <h4 className="text-xs uppercase font-bold tracking-wider text-orange-400 mb-2.5">
                        Key Subjects Covered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {course.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.04] border border-white/10 text-cream"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features List */}
                    <div>
                      <h4 className="text-xs uppercase font-bold tracking-wider text-orange-400 mb-3">
                        Program Highlights
                      </h4>
                      <ul className="space-y-2.5">
                        {course.features.map((feat) => (
                          <li key={feat} className="text-xs sm:text-sm text-muted-custom flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </RevealWrapper>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. COMPARISON TABLE: SIXBYTES VS ORDINARY COACHING — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian">
        <div className="max-w-5xl mx-auto w-full my-auto">
          <SectionHeader
            label="Why SixBytes"
            title="The SixBytes"
            highlightedWord="Advantage"
            subtitle="See how our focused teaching model compares with conventional large-scale coaching centers."
          />

          <GlassCard padding="none" className="overflow-x-auto border-white/[0.08]">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-xs text-cream">
                    Feature
                  </th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-xs text-orange-400 bg-orange-500/[0.04]">
                    SixBytes Institute
                  </th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-xs text-muted-custom">
                    Conventional Coaching
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-cream">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-orange-400 font-semibold bg-orange-500/[0.02]">
                      {row.sixbytes}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-custom">
                      {row.standard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FREQUENTLY ASKED QUESTIONS (FAQ) — Full Viewport Screen
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-navy">
        <div className="max-w-4xl mx-auto w-full my-auto">
          <SectionHeader
            label="Got Questions?"
            title="Frequently Asked"
            highlightedWord="Questions"
            subtitle="Clear answers about our admission process, fee structure, batches, and teaching methodology."
          />

          <div className="space-y-3.5">
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
          5. COURSES CTA — Full Viewport Finish
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-obsidian text-center">
        <div className="max-w-4xl mx-auto space-y-8 my-auto">
          <SectionHeader
            label="Secure Your Seat"
            title="Ready to Boost Your"
            highlightedWord="Board & Entrance Scores?"
            subtitle="Admissions are processed on a first-come, first-served basis due to our strict 15-student batch limits."
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              href="https://wa.me/917536839760?text=Hello%20SixBytes!%20I%20would%20like%20to%20apply%20for%20admission."
              variant="filled"
              className="w-full sm:w-auto text-base !py-3.5 !px-8"
            >
              Apply via WhatsApp
            </CTAButton>
            <CTAButton href="/contact" variant="outline" className="w-full sm:w-auto text-base !py-3.5 !px-8">
              Visit Campus & Consult Faculty
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  )
}