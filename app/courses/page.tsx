"use client"

import { useEffect, useRef, useState } from "react";

// ── Scroll reveal ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Animated number ticker ─────────────────────────────────────────────────────
function Ticker({ value }: { value: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <span ref={ref} style={{
      display: "inline-block",
      transition: "opacity 0.6s, transform 0.6s",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
    }}>{value}</span>
  );
}

// ── Starburst SVG decoration ───────────────────────────────────────────────────
function Starburst({ size = 120, opacity = 0.06 }: { size?: number; opacity?: number }) {
  const lines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    return { x1: size / 2, y1: size / 2, x2: size / 2 + Math.cos(angle) * size * 0.48, y2: size / 2 + Math.sin(angle) * size * 0.48 };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", opacity, pointerEvents: "none" }}>
      {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#F97316" strokeWidth="0.8" />)}
      <circle cx={size / 2} cy={size / 2} r={size * 0.06} fill="#F97316" opacity={0.4} />
    </svg>
  );
}

// ── Hero particle field ────────────────────────────────────────────────────────
function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let id: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.3 + 0.2,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > c.width) p.dx *= -1;
        if (p.y < 0 || p.y > c.height) p.dy *= -1;
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── Course data ────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: "foundation",
    num: "01",
    icon: "📐",
    title: "Class 9–10 Foundation",
    subtitle: "Best Class 9 & 10 Coaching in Premnagar, Dehradun",
    tagline: "Build the base that carries you to the top.",
    description: "Our Class 9–10 Foundation Programme builds rock-solid conceptual clarity in Mathematics and Science. Through small batches, weekly assessments, and personalised doubt sessions, students don't just pass — they excel.",
    subjects: ["Mathematics", "Science", "English", "Social Studies"],
    features: [
      { icon: "🧠", text: "Deep conceptual learning, not rote memorisation" },
      { icon: "📝", text: "Weekly tests with detailed performance analysis" },
      { icon: "🔍", text: "One-on-one doubt clearing before every exam" },
      { icon: "📈", text: "Progress tracking shared with parents" },
      { icon: "🏆", text: "Board exam strategy & full paper practice" },
    ],
    stat1: { val: "95%", label: "Pass Rate" },
    stat2: { val: "50+", label: "Toppers" },
    accentFrom: "#F97316",
    accentTo: "#FB923C",
    glowColor: "rgba(249,115,22,0.12)",
  },
  {
    id: "boards",
    num: "02",
    icon: "⚗️",
    title: "Class 11–12 Boards + Competitive",
    subtitle: "Top Science Coaching for Class 11 & 12 in Dehradun",
    tagline: "Dominate boards. Crack entrances. Own your future.",
    description: "SixBytes offers the best Class 11–12 Science coaching in Dehradun — combining board exam mastery with JEE/NEET foundation. Our expert faculty ensures students score high in boards without sacrificing competitive exam preparation.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
    features: [
      { icon: "⚗️", text: "PCM & PCB by specialist subject teachers" },
      { icon: "🎯", text: "Dual strategy: Board excellence + JEE/NEET base" },
      { icon: "📋", text: "Chapter-wise & full-syllabus mock tests" },
      { icon: "💡", text: "Shortcut techniques with conceptual clarity" },
      { icon: "🗂️", text: "Structured notes and formula revision sheets" },
    ],
    stat1: { val: "92%", label: "Board Avg" },
    stat2: { val: "120+", label: "Students" },
    accentFrom: "#FB923C",
    accentTo: "#FBBF24",
    glowColor: "rgba(251,146,60,0.12)",
  },
  {
    id: "defence",
    num: "03",
    icon: "🎖️",
    title: "NDA / RMS / RIMC / Sainik School",
    subtitle: "Best NDA & Sainik School Coaching in Uttarakhand",
    tagline: "Train the mind. Forge the officer.",
    description: "SixBytes is Dehradun's trusted name for NDA, RMS, RIMC and Sainik School entrance preparation. Our programme covers the complete written syllabus, SSB interview guidance, and personality development — a full-spectrum edge.",
    subjects: ["Mathematics", "General Ability Test", "English", "GK & Current Affairs"],
    features: [
      { icon: "🪖", text: "Complete NDA written exam syllabus coverage" },
      { icon: "🎖️", text: "SSB interview technique & personality grooming" },
      { icon: "🗺️", text: "GK, current affairs & geography deep-dives" },
      { icon: "💪", text: "Physical fitness guidance & discipline training" },
      { icon: "🧩", text: "RMS, RIMC & Sainik School pattern practice" },
    ],
    stat1: { val: "30+", label: "Selections" },
    stat2: { val: "5★", label: "Rated" },
    accentFrom: "#EF4444",
    accentTo: "#F97316",
    glowColor: "rgba(239,68,68,0.1)",
  },
];

// ── Course Card ────────────────────────────────────────────────────────────────
function CourseCard({ course, index }: { course: typeof COURSES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`reveal reveal-d${index + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(145deg, #141008 0%, #0e0c0a 100%)",
        border: `1px solid ${hovered ? `${course.accentFrom}45` : "rgba(249,115,22,0.12)"}`,
        borderRadius: "22px",
        transition: "border-color 0.4s, transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s",
        transform: hovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: hovered ? `0 32px 72px ${course.glowColor}, 0 0 0 1px ${course.accentFrom}20` : "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Animated gradient top border */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${course.accentFrom}, ${course.accentTo}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.4s",
      }} />

      {/* Large faint number watermark */}
      <div style={{
        position: "absolute", right: "-0.5rem", bottom: "-1.5rem",
        fontFamily: "'Playfair Display', serif",
        fontSize: "9rem", fontWeight: 900, lineHeight: 1,
        color: `${course.accentFrom}08`,
        userSelect: "none", pointerEvents: "none",
        transition: "color 0.4s",
      }}>{course.num}</div>

      {/* Starburst top-left */}
      <div style={{ position: "absolute", top: -20, left: -20, opacity: hovered ? 0.09 : 0.04, transition: "opacity 0.4s" }}>
        <Starburst size={110} opacity={1} />
      </div>

      {/* Glow blob */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "80%", height: "40%",
        background: `radial-gradient(ellipse, ${course.glowColor} 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.5s",
        pointerEvents: "none",
      }} />

      {/* ── Card content ── */}
      <div style={{ padding: "2.25rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: "16px", flexShrink: 0,
            background: `linear-gradient(135deg, ${course.accentFrom}20, ${course.accentFrom}08)`,
            border: `1px solid ${course.accentFrom}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem",
            transition: "transform 0.4s cubic-bezier(.22,1,.36,1)",
            transform: hovered ? "rotate(-6deg) scale(1.1)" : "rotate(0deg) scale(1)",
          }}>{course.icon}</div>

          {/* Course number badge */}
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.7rem", letterSpacing: "0.18em",
            color: course.accentFrom, opacity: 0.7,
            padding: "0.3rem 0.75rem",
            border: `1px solid ${course.accentFrom}25`,
            borderRadius: "100px",
            background: `${course.accentFrom}08`,
          }}>Course {course.num}</span>
        </div>

        {/* Title + tagline */}
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
            fontWeight: 800, lineHeight: 1.2,
            color: "#F7F3EC", marginBottom: "0.5rem",
          }}>{course.title}</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "0.95rem", fontStyle: "italic",
            color: course.accentFrom, lineHeight: 1.5,
          }}>{course.tagline}</p>
        </div>

        {/* Description */}
        <p style={{ color: "rgba(247,243,236,0.55)", fontSize: "0.86rem", lineHeight: 1.8 }}>
          {course.description}
        </p>

        {/* Subjects */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
          {course.subjects.map(s => (
            <span key={s} style={{
              padding: "0.28rem 0.75rem",
              background: `${course.accentFrom}0f`,
              border: `1px solid ${course.accentFrom}22`,
              borderRadius: "100px",
              fontSize: "0.72rem", color: "#F7F3EC", opacity: 0.8,
            }}>{s}</span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${course.accentFrom}25, transparent)` }} />

        {/* Features — expandable */}
        <div>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {(expanded ? course.features : course.features.slice(0, 3)).map(({ icon, text }, i) => (
              <li key={i} style={{
                display: "flex", gap: "0.75rem", alignItems: "flex-start",
                animation: expanded && i >= 3 ? "featureSlideIn 0.4s cubic-bezier(.22,1,.36,1) both" : "none",
              }}>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: "8px",
                  background: `${course.accentFrom}15`, border: `1px solid ${course.accentFrom}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem",
                }}>{icon}</span>
                <span style={{ color: "rgba(247,243,236,0.72)", fontSize: "0.83rem", lineHeight: 1.65, paddingTop: "0.3rem" }}>{text}</span>
              </li>
            ))}
          </ul>
          {course.features.length > 3 && (
            <button onClick={() => setExpanded(e => !e)} style={{
              marginTop: "0.75rem",
              background: "none", border: "none", cursor: "pointer",
              color: course.accentFrom, fontSize: "0.75rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", gap: "0.4rem",
              transition: "opacity 0.2s",
            }}>
              <span style={{
                display: "inline-block",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}>▾</span>
              {expanded ? "Show Less" : `+${course.features.length - 3} More Features`}
            </button>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          padding: "1rem",
          background: `${course.accentFrom}06`,
          border: `1px solid ${course.accentFrom}14`,
          borderRadius: "12px",
        }}>
          {[course.stat1, course.stat2].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.9rem", fontWeight: 700, lineHeight: 1,
                color: course.accentFrom,
              }}><Ticker value={val} /></div>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(247,243,236,0.45)", marginTop: "0.25rem" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/917536839760"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
            padding: "0.95rem",
            background: `linear-gradient(135deg, ${course.accentFrom}, ${course.accentTo})`,
            borderRadius: "10px",
            color: "#fff", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em",
            textDecoration: "none",
            boxShadow: `0 8px 24px ${course.glowColor}`,
            transition: "transform 0.3s, box-shadow 0.3s",
            position: "relative", zIndex: 1,
          }}
          onMouseEnter={e => {
            const a = e.currentTarget as HTMLAnchorElement;
            a.style.transform = "translateY(-2px)";
            a.style.boxShadow = `0 16px 36px ${course.glowColor}`;
          }}
          onMouseLeave={e => {
            const a = e.currentTarget as HTMLAnchorElement;
            a.style.transform = "translateY(0)";
            a.style.boxShadow = `0 8px 24px ${course.glowColor}`;
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Book Free Demo on WhatsApp
          <span style={{ marginLeft: "auto", opacity: 0.75 }}>→</span>
        </a>

      </div>
    </article>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --orange: #F97316;
          --orange-light: #FB923C;
          --obsidian: #0a0c0e;
          --surface: #0e0c0a;
          --surface-2: #111416;
          --cream: #F7F3EC;
          --muted: rgba(247,243,236,0.5);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--obsidian); color: var(--cream); overflow-x: hidden; }

        .display { font-family: 'Playfair Display', serif; }
        .serif   { font-family: 'Cormorant Garamond', serif; }

        .orange-text {
          background: linear-gradient(135deg, var(--orange-light) 0%, var(--orange) 60%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.25s; }
        .reveal-d3 { transition-delay: 0.4s; }
        .reveal-d4 { transition-delay: 0.55s; }

        .s-label { font-size: 0.67rem; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: var(--orange); display: block; margin-bottom: 0.7rem; }
        .o-rule  { display: block; width: 50px; height: 2px; background: linear-gradient(90deg, var(--orange), transparent); margin: 0 auto 1.5rem; }

        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .shimmer-line { background: linear-gradient(90deg, transparent 0%, var(--orange) 50%, transparent 100%); background-size: 200% auto; animation: shimmer 3.5s linear infinite; height: 1px; width: 100%; }

        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .hl1 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.15s both; }
        .hl2 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.35s both; }
        .hl3 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .hl4 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.75s both; }

        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .float { animation: floatY 4s ease-in-out infinite; }

        @keyframes glowPulse { 0%,100%{opacity:0.45} 50%{opacity:0.95} }
        @keyframes spin { to{transform:rotate(360deg)} }

        @keyframes featureSlideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

        /* Comparison table */
        .comp-row:hover td { background: rgba(249,115,22,0.05) !important; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--obsidian); }
        ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }

        /* Marquee */
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-inner { animation: marquee 22s linear infinite; display: flex; gap: 3rem; white-space: nowrap; }
        .marquee-inner:hover { animation-play-state: paused; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", minHeight: "56vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #130e0a 0%, #1a1008 55%, #0a0c0e 100%)",
        overflow: "hidden",
      }}>
        <HeroParticles />

        {/* Orbit rings */}
        {[260, 400, 540].map((sz, i) => (
          <div key={sz} style={{
            position: "absolute", width: sz, height: sz, borderRadius: "50%",
            border: `1px solid rgba(249,115,22,${0.09 - i * 0.022})`,
            animation: `spin ${15 + i * 10}s linear infinite ${i % 2 ? "reverse" : ""}`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "55vw", height: "55vw", maxWidth: 580, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 68%)",
          animation: "glowPulse 4s ease-in-out infinite", pointerEvents: "none",
        }} />

        {/* Grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03, pointerEvents: "none" }}>
          <defs><pattern id="crgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#F97316" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#crgrid)" />
        </svg>

        {/* Starburst corners */}
        <div style={{ position: "absolute", top: 20, left: 20, opacity: 0.07 }}><Starburst size={140} opacity={1} /></div>
        <div style={{ position: "absolute", bottom: 20, right: 20, opacity: 0.07 }}><Starburst size={100} opacity={1} /></div>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "4rem 1.5rem 3rem", maxWidth: 820 }}>
          {/* Badge */}
          <div className="hl1 float" style={{ marginBottom: "2rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(249,115,22,0.09)", border: "1px solid rgba(249,115,22,0.28)",
              borderRadius: "100px", padding: "0.42rem 1.15rem",
              fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--orange)",
            }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--orange)", opacity: 0.6, animation: "glowPulse 1.8s ease-in-out infinite" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", display: "block" }} />
              </span>
              Premnagar, Dehradun
            </span>
          </div>

          <h1 className="display hl2" style={{ fontSize: "clamp(2.6rem,7.5vw,6rem)", fontWeight: 800, lineHeight: 1.05, color: "var(--cream)", marginBottom: "0.3rem" }}>
            Our
          </h1>
          <h1 className="display hl2 orange-text" style={{ fontSize: "clamp(2.6rem,7.5vw,6rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.5rem" }}>
            Courses
          </h1>
          <p className="serif hl3" style={{ fontSize: "clamp(1rem,2vw,1.35rem)", fontWeight: 300, color: "var(--muted)", letterSpacing: "0.04em", lineHeight: 1.85 }}>
            Expert coaching for Class 9–12, NDA, RMS, RIMC and Sainik School<br />at SixBytes Educational Institute, Premnagar, Dehradun
          </p>

          {/* Quick stats */}
          <div className="hl4" style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem,5vw,4rem)", marginTop: "2.5rem" }}>
            {[
              { val: "3", label: "Programmes" },
              { val: "1200+", label: "Students" },
              { val: "5★", label: "Rated" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, lineHeight: 1,
                  color: "#F97316",
                }}>{val}</div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginTop: "0.3rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <div className="shimmer-line" />
        </div>
      </section>

      {/* ══ MARQUEE TICKER ════════════════════════════════════════════════════ */}
      <div style={{
        background: "linear-gradient(90deg, rgba(249,115,22,0.12), rgba(249,115,22,0.06), rgba(249,115,22,0.12))",
        borderTop: "1px solid rgba(249,115,22,0.18)", borderBottom: "1px solid rgba(249,115,22,0.18)",
        padding: "0.75rem 0", overflow: "hidden",
      }}>
        <div className="marquee-inner">
          {Array.from({ length: 2 }, (_, r) =>
            ["Class 9–10 Foundation", "Class 11–12 Boards", "NDA Coaching", "RMS Preparation", "RIMC Coaching", "Sainik School", "Weekly Mock Tests", "Small Batch Size", "Expert Faculty", "Premnagar Dehradun"].map((item, i) => (
              <span key={`${r}-${i}`} style={{
                fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--orange)", display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0,
              }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--orange)", flexShrink: 0 }} />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ COURSE CARDS ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: "7rem 1.5rem 5rem",
        background: "var(--surface)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Faint COURSES watermark */}
        <div className="display" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          fontSize: "clamp(7rem,16vw,16rem)", fontWeight: 900,
          color: "rgba(249,115,22,0.022)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
        }}>COURSES</div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <span className="s-label reveal">Expert Coaching Programmes</span>
            <span className="o-rule reveal reveal-d1" />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(1.9rem,3.5vw,3rem)", fontWeight: 700, color: "var(--cream)" }}>
              Choose Your <span className="orange-text">Path to Excellence</span>
            </h2>
            <p className="reveal reveal-d2" style={{ color: "var(--muted)", maxWidth: 540, margin: "1.25rem auto 0", lineHeight: 1.8, fontSize: "0.94rem" }}>
              Every course at SixBytes is engineered around conceptual clarity, regular testing, and personalised attention — the three pillars of our 5-year legacy.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "1.75rem" }}>
            {COURSES.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ══ COMPARISON TABLE ══════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: "linear-gradient(160deg, #0a0c0e 0%, #130e0a 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="s-label reveal">At a Glance</span>
            <span className="o-rule reveal reveal-d1" />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, color: "var(--cream)" }}>
              Course <span className="orange-text">Comparison</span>
            </h2>
          </div>

          <div className="reveal reveal-d2" style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid rgba(249,115,22,0.15)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "rgba(249,115,22,0.1)", borderBottom: "1px solid rgba(249,115,22,0.2)" }}>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", color: "var(--muted)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.7rem" }}>Feature</th>
                  {COURSES.map(c => (
                    <th key={c.id} style={{ padding: "1rem 1.25rem", textAlign: "center", color: c.accentFrom, fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.04em" }}>{c.title.split(" ").slice(0, 3).join(" ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Batch Size", vals: ["Small (≤15)", "Small (≤12)", "Small (≤10)"] },
                  { feature: "Weekly Tests", vals: ["✦", "✦", "✦"] },
                  { feature: "Doubt Sessions", vals: ["✦", "✦", "✦"] },
                  { feature: "Parent Updates", vals: ["✦", "✦", "✦"] },
                  { feature: "Mock Test Series", vals: ["Board Pattern", "Board + JEE/NEET", "NDA Pattern"] },
                  { feature: "SSB Guidance", vals: ["—", "—", "✦"] },
                  { feature: "Interview Coaching", vals: ["—", "—", "✦"] },
                ].map(({ feature, vals }, ri) => (
                  <tr key={feature} className="comp-row" style={{ borderBottom: "1px solid rgba(249,115,22,0.07)", transition: "background 0.3s" }}>
                    <td style={{ padding: "0.9rem 1.5rem", color: "var(--muted)", fontSize: "0.82rem" }}>{feature}</td>
                    {vals.map((v, vi) => (
                      <td key={vi} style={{
                        padding: "0.9rem 1.25rem", textAlign: "center",
                        color: v === "✦" ? COURSES[vi].accentFrom : v === "—" ? "rgba(247,243,236,0.2)" : "var(--cream)",
                        fontSize: v === "✦" ? "1rem" : "0.82rem",
                        fontWeight: v === "✦" ? 700 : 400,
                        transition: "background 0.3s",
                      }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem", background: "var(--surface-2)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="s-label reveal">Common Questions</span>
            <span className="o-rule reveal reveal-d1" />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 700, color: "var(--cream)" }}>
              Frequently <span className="orange-text">Asked</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { q: "Which courses does SixBytes offer?", a: "We offer Class 9–10 Foundation, Class 11–12 Boards + Competitive (PCM/PCB), and NDA/RMS/RIMC/Sainik School preparation at our institute in Premnagar, Dehradun." },
              { q: "What is the batch size at SixBytes?", a: "We deliberately keep batch sizes small — maximum 10–15 students per batch — so every student receives genuine individual attention from our faculty." },
              { q: "Do you offer a free demo class?", a: "Yes! We offer a completely free demo class for all our programmes. Simply WhatsApp or call us to book your slot." },
              { q: "Is coaching available for NDA in Dehradun?", a: "Yes. Our dedicated defence wing covers the full NDA written syllabus, SSB interview preparation, and personality development for students in Dehradun and nearby areas." },
            ].map(({ q, a }, i) => (
              <FaqItem key={i} question={q} answer={a} delay={i % 3 + 1} />
            ))}
          </div>

        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "7rem 1.5rem", textAlign: "center",
        background: "linear-gradient(135deg, #120d08 0%, #1a1108 50%, #0a0c0e 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "65vw", height: "65vw", maxWidth: 650, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto" }}>
          <span className="s-label reveal">New Batch Forming Now</span>
          <span className="o-rule reveal reveal-d1" />
          <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2rem,4.5vw,3.6rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1rem" }}>
            Take the First Step<br /><span className="orange-text">Towards Excellence</span>
          </h2>
          <p className="reveal reveal-d2" style={{ color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
            Seats are strictly limited. Book your free demo at SixBytes Educational Institute, Premnagar, Dehradun today.
          </p>
          <div className="reveal reveal-d3" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a href="https://wa.me/917536839760" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", padding: "1rem 2.4rem",
              background: "var(--orange)", color: "#fff",
              fontFamily: "'DM Sans'", fontSize: "0.82rem", fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              borderRadius: "4px", textDecoration: "none",
              boxShadow: "0 8px 28px rgba(249,115,22,0.35)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
              onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = "translateY(-3px)"; a.style.boxShadow = "0 16px 40px rgba(249,115,22,0.45)"; }}
              onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = "translateY(0)"; a.style.boxShadow = "0 8px 28px rgba(249,115,22,0.35)"; }}
            >Book Free Demo</a>
            <a href="/contact" style={{
              display: "inline-block", padding: "1rem 2.4rem",
              background: "transparent", color: "var(--orange)",
              border: "1px solid var(--orange)",
              fontFamily: "'DM Sans'", fontSize: "0.82rem", fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase",
              borderRadius: "4px", textDecoration: "none",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "rgba(249,115,22,0.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
            >Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
}

// ── FAQ accordion item ─────────────────────────────────────────────────────────
function FaqItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`reveal reveal-d${delay}`} style={{
      border: `1px solid ${open ? "rgba(249,115,22,0.35)" : "rgba(249,115,22,0.12)"}`,
      borderRadius: "14px", overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", padding: "1.25rem 1.5rem",
        background: open ? "rgba(249,115,22,0.07)" : "rgba(249,115,22,0.03)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
        transition: "background 0.3s",
        textAlign: "left",
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#F7F3EC", fontWeight: 500, lineHeight: 1.5 }}>{question}</span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
          background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--orange)", fontSize: "1rem", fontWeight: 700,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1)",
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? "300px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(.22,1,.36,1)",
      }}>
        <p style={{ padding: "0 1.5rem 1.25rem", color: "rgba(247,243,236,0.6)", fontSize: "0.86rem", lineHeight: 1.8 }}>{answer}</p>
      </div>
    </div>
  );
}