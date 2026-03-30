"use client"

import { useEffect, useRef, useState } from "react";

// ── Scroll reveal hook ─────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Counter ────────────────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2200 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const inc = end / (duration / 16);
      const timer = setInterval(() => {
        start += inc;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Animated orbit rings ───────────────────────────────────────────────────────
function OrbitRings() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
      {[320, 480, 640, 800].map((size, i) => (
        <div key={size} style={{
          position: "absolute",
          width: size, height: size,
          borderRadius: "50%",
          border: `1px solid rgba(249,115,22,${0.12 - i * 0.02})`,
          animation: `spin ${18 + i * 8}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
        }} />
      ))}
    </div>
  );
}

// ── Particle canvas ────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── Typewriter ─────────────────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    const speed = deleting ? 55 : 110;
    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIdx((idx + 1) % words.length);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words]);
  return (
    <span style={{ color: "var(--orange)", borderRight: "2px solid var(--orange)", paddingRight: 4 }}>
      {text}
    </span>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  useReveal();

  const pillars = [
    { icon: "🎯", title: "Expert Faculty", desc: "Seasoned educators who have shaped hundreds of toppers across competitive and board exams." },
    { icon: "🔬", title: "Small Batches", desc: "Deliberately limited batch sizes so every student receives genuine individual attention." },
    { icon: "📊", title: "Weekly Tests", desc: "Rigorous weekly assessments with detailed performance analysis to track every student's growth." },
    { icon: "🪖", title: "Defence Coaching", desc: "Specialised NDA, RMS & Sainik School preparation covering written, SSB and personality rounds." },
    { icon: "💡", title: "Concept Clarity", desc: "We teach the 'why' behind every topic — building intuition that survives any exam format." },
    { icon: "🤝", title: "Personalised Mentorship", desc: "Regular one-on-one sessions ensure no student is left behind or goes unnoticed." },
  ];

  const timeline = [
    { year: "2021", title: "Founded", desc: "SixBytes opens its doors in Premnagar, Dehradun with a vision to redefine local coaching." },
    { year: "2022", title: "First Toppers", desc: "Our students dominate board results — top scorers emerge from the very first batch cycle." },
    { year: "2023", title: "Defence Wing Launched", desc: "Dedicated NDA & Sainik School programme introduced with specialised faculty." },
    { year: "2024", title: "1000+ Students", desc: "A milestone crossed — over a thousand families trust SixBytes with their children's future." },
    { year: "2025", title: "350+ Results", desc: "Our students continue to shine across boards, NDA written exams and Sainik School selections." },
  ];

  return (
    <>
      {/* ── GLOBAL STYLES ────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --orange: #F97316;
          --orange-light: #FB923C;
          --orange-dim: rgba(249,115,22,0.12);
          --obsidian: #0a0c0e;
          --surface: #111416;
          --surface-mid: #161a1d;
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

        /* Reveal */
        .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.12s; }
        .reveal-d2 { transition-delay: 0.24s; }
        .reveal-d3 { transition-delay: 0.36s; }
        .reveal-d4 { transition-delay: 0.48s; }
        .reveal-d5 { transition-delay: 0.60s; }

        /* Section label */
        .s-label {
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--orange); display: block; margin-bottom: 0.75rem;
        }

        /* Orange rule */
        .o-rule {
          display: block; width: 52px; height: 2px;
          background: linear-gradient(90deg, var(--orange), transparent);
          margin: 0 auto 1.5rem;
        }

        /* Glass card */
        .g-card {
          background: rgba(22,26,29,0.7);
          border: 1px solid rgba(249,115,22,0.15);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          transition: border-color 0.4s, transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
        }
        .g-card:hover {
          border-color: rgba(249,115,22,0.45);
          transform: translateY(-7px);
          box-shadow: 0 28px 60px rgba(249,115,22,0.09);
        }

        /* CTA button */
        .btn-o {
          display: inline-block; position: relative; overflow: hidden;
          padding: 0.95rem 2.4rem;
          border: 1px solid var(--orange); border-radius: 4px;
          color: var(--orange);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; cursor: pointer; background: transparent;
          transition: color 0.38s;
        }
        .btn-o::before {
          content: ''; position: absolute; inset: 0;
          background: var(--orange); transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(.77,0,.175,1); z-index: -1;
        }
        .btn-o:hover { color: var(--obsidian); }
        .btn-o:hover::before { transform: scaleX(1); }

        /* Stat number */
        .stat-n {
          font-family: 'Cormorant Garamond', serif; font-size: 3.2rem; font-weight: 600; line-height: 1;
          background: linear-gradient(180deg, var(--orange-light), var(--orange));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* Timeline */
        .tl-line {
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 1px; background: linear-gradient(to bottom, transparent, rgba(249,115,22,0.4), transparent);
          transform: translateX(-50%);
        }
        .tl-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--orange); border: 2px solid var(--obsidian);
          box-shadow: 0 0 0 4px rgba(249,115,22,0.2);
          flex-shrink: 0;
        }

        /* Pillar icon */
        .p-icon {
          width: 54px; height: 54px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: var(--orange-dim); border: 1px solid rgba(249,115,22,0.25);
          font-size: 1.4rem; margin-bottom: 1.25rem;
          transition: background 0.3s;
        }
        .g-card:hover .p-icon { background: rgba(249,115,22,0.22); }

        /* Shimmer */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, var(--orange) 50%, transparent 100%);
          background-size: 200% auto;
          animation: shimmer 3.5s linear infinite;
          height: 1px; width: 100%;
        }

        /* Spin */
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Hero text entrance */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hl1 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .hl2 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.42s both; }
        .hl3 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.64s both; }
        .hl4 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.86s both; }

        /* Float */
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float { animation: floatY 4.5s ease-in-out infinite; }

        /* Glow pulse */
        @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--obsidian); }
        ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", minHeight: "92vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #130e0a 0%, #1a1008 50%, #0a0c0e 100%)",
        overflow: "hidden",
      }}>
        <ParticleField />
        <OrbitRings />

        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "60vw", height: "60vw", maxWidth: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 68%)",
          animation: "glowPulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.035, pointerEvents: "none" }}>
          <defs>
            <pattern id="abgrid" width="55" height="55" patternUnits="userSpaceOnUse">
              <path d="M 55 0 L 0 0 0 55" fill="none" stroke="#F97316" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#abgrid)" />
        </svg>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 1.5rem", maxWidth: 860 }}>

          {/* Badge */}
          <div className="hl1 float" style={{ marginBottom: "2.5rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(249,115,22,0.09)", border: "1px solid rgba(249,115,22,0.28)",
              borderRadius: "100px", padding: "0.45rem 1.2rem",
              fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--orange)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", display: "inline-block", animation: "glowPulse 1.8s ease-in-out infinite" }} />
              About SixBytes Educational Institute
            </span>
          </div>

          <h1 className="display hl2" style={{ fontSize: "clamp(2.6rem,7vw,6rem)", fontWeight: 800, lineHeight: 1.08, color: "var(--cream)", marginBottom: "0.4rem" }}>
            Shaping Future
          </h1>
          <h1 className="display hl2 orange-text" style={{ fontSize: "clamp(2.6rem,7vw,6rem)", fontWeight: 800, lineHeight: 1.08, marginBottom: "2rem" }}>
            <Typewriter words={["Leaders", "Engineers", "Officers", "Toppers", "Champions"]} />
          </h1>

          <p className="serif hl3" style={{ fontSize: "clamp(1.05rem,2vw,1.4rem)", color: "var(--muted)", lineHeight: 1.85, fontWeight: 300, maxWidth: 600, margin: "0 auto 3rem" }}>
            Five years of relentless pursuit of excellence in Premnagar, Dehradun — building not just toppers, but complete individuals.
          </p>

          <div className="hl4">
            <a href="/contact" className="btn-o">Book a Free Demo</a>
          </div>

        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <div className="shimmer-line" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "var(--surface)", position: "relative", overflow: "hidden" }}>

        {/* Decorative large faint "06" */}
        <div className="display" style={{
          position: "absolute", right: "-2%", top: "50%", transform: "translateY(-50%)",
          fontSize: "clamp(14rem,22vw,22rem)", fontWeight: 800, lineHeight: 1,
          color: "rgba(249,115,22,0.03)", pointerEvents: "none", userSelect: "none",
        }}>06</div>

        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "5rem", alignItems: "center" }}>

          {/* Left */}
          <div>
            <span className="s-label reveal">Who We Are</span>
            <span className="o-rule reveal reveal-d1" style={{ margin: "0 0 1.5rem" }} />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 700, color: "var(--cream)", marginBottom: "2rem", lineHeight: 1.2 }}>
              More Than a Coaching<br /><span className="orange-text">Institute</span>
            </h2>
            <p className="reveal reveal-d2" style={{ color: "var(--muted)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              SixBytes Educational Institute is one of the best coaching institutes in Premnagar, Dehradun, providing high-quality education for students from Class 9 to 12.
            </p>
            <p className="reveal reveal-d2" style={{ color: "var(--muted)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              We specialise in building strong concepts in Maths, Science, and competitive exam preparation including NDA, RMS, RIMC, and Sainik School.
            </p>
            <p className="reveal reveal-d3" style={{ color: "var(--muted)", lineHeight: 1.9, marginBottom: "2.5rem" }}>
              Our goal is to provide personalised attention through small batch sizes, experienced faculty, and regular performance tracking that leaves no student behind.
            </p>

            {/* Stats row */}
            <div className="reveal reveal-d3" style={{ display: "flex", gap: "2.5rem" }}>
              {[
                { n: 1200, suf: "+", label: "Students" },
                { n: 5, suf: "+ Yrs", label: "Experience" },
                { n: 350, suf: "+", label: "Top Results" },
              ].map(({ n, suf, label }) => (
                <div key={label}>
                  <div className="stat-n"><Counter end={n} suffix={suf} /></div>
                  <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: "0.4rem" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Why Choose Us card */}
          <div className="g-card reveal reveal-d2" style={{ padding: "2.5rem 2.25rem" }}>
            <h3 className="display" style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.4rem" }}>Why Choose Us</h3>
            <p className="serif" style={{ color: "var(--orange)", fontStyle: "italic", marginBottom: "2rem", fontSize: "1rem" }}>What sets us apart from the rest</p>

            <ul style={{ display: "flex", flexDirection: "column", gap: "1.2rem", listStyle: "none" }}>
              {[
                "Expert Faculty with years of proven experience",
                "Small batch size for genuine personal attention",
                "Weekly tests & deep performance tracking",
                "NDA, RMS & Sainik School full preparation",
                "Doubt sessions before every major exam",
                "Personality & interview coaching for defence",
              ].map((item, i) => (
                <li key={i} className={`reveal reveal-d${Math.min(i + 1, 5)}`} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, marginTop: "0.15rem",
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--orange-dim)", border: "1px solid rgba(249,115,22,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.55rem", color: "var(--orange)",
                  }}>◆</span>
                  <span style={{ color: "rgba(247,243,236,0.8)", fontSize: "0.9rem", lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "2.5rem" }}>
              <a href="/contact" className="btn-o">Book Free Demo</a>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6 PILLARS
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "linear-gradient(160deg, #0a0c0e 0%, #130e0a 100%)", position: "relative", overflow: "hidden" }}>

        {/* Faint background text */}
        <div className="display" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          fontSize: "clamp(12rem,20vw,20rem)", fontWeight: 800, lineHeight: 1,
          color: "rgba(249,115,22,0.025)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
        }}>EXCELLENCE</div>

        <div style={{ maxWidth: 1120, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span className="s-label reveal">Our Pillars</span>
            <span className="o-rule reveal reveal-d1" />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 700, color: "var(--cream)" }}>
              Built on <span className="orange-text">Six Foundations</span>
            </h2>
            <p className="reveal reveal-d2" style={{ color: "var(--muted)", maxWidth: 500, margin: "1.25rem auto 0", lineHeight: 1.8, fontSize: "0.95rem" }}>
              Every aspect of SixBytes is engineered around these core pillars of educational excellence.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.5rem" }}>
            {pillars.map(({ icon, title, desc }, i) => (
              <div key={title} className={`g-card reveal reveal-d${(i % 3) + 1}`} style={{ padding: "2.25rem 2rem" }}>
                <div className="p-icon">{icon}</div>
                <h3 className="display" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.6rem" }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "var(--surface-mid)", position: "relative", overflow: "hidden" }}>

        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span className="s-label reveal">Our Story</span>
            <span className="o-rule reveal reveal-d1" />
            <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2rem,4vw,3.4rem)", fontWeight: 700, color: "var(--cream)" }}>
              Five Years of <span className="orange-text">Legacy</span>
            </h2>
          </div>

          {/* Timeline items */}
          <div style={{ position: "relative" }}>
            <div className="tl-line" />

            {timeline.map(({ year, title, desc }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={year} className={`reveal reveal-d${(i % 3) + 1}`} style={{
                  display: "flex",
                  flexDirection: isLeft ? "row" : "row-reverse",
                  alignItems: "center",
                  gap: "2rem",
                  marginBottom: "3rem",
                  position: "relative",
                }}>
                  {/* Card */}
                  <div className="g-card" style={{ flex: 1, padding: "1.75rem", maxWidth: "calc(50% - 2rem)" }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase",
                      color: "var(--orange)", display: "block", marginBottom: "0.4rem",
                    }}>{year}</span>
                    <h4 className="display" style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.5rem" }}>{title}</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.75 }}>{desc}</p>
                  </div>

                  {/* Dot */}
                  <div className="tl-dot" />

                  {/* Spacer */}
                  <div style={{ flex: 1, maxWidth: "calc(50% - 2rem)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SEO
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "7rem 1.5rem", background: "var(--obsidian)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>

          <span className="s-label reveal">Serving Dehradun</span>
          <span className="o-rule reveal reveal-d1" />
          <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.25, marginBottom: "2rem" }}>
            Best Coaching in{" "}
            <span className="orange-text">Premnagar, Dehradun</span>
          </h2>

          <div className="g-card reveal reveal-d2" style={{ padding: "2.75rem", textAlign: "left", marginBottom: "3rem" }}>
            <p style={{ color: "rgba(247,243,236,0.72)", lineHeight: 1.95, marginBottom: "1.25rem" }}>
              If you are searching for the best coaching institute in Premnagar, Dehradun for Class 9–12, NDA, RMS, or Sainik School preparation,{" "}
              <strong style={{ color: "var(--cream)" }}>SixBytes Educational Institute</strong> is your trusted destination.
            </p>
            <p style={{ color: "rgba(247,243,236,0.72)", lineHeight: 1.95 }}>
              We focus on concept clarity, regular testing, and personalised mentorship to ensure excellent results — earning the trust of over{" "}
              <span style={{ color: "var(--orange)", fontWeight: 500 }}>1,200 students and their families</span> across Dehradun.
            </p>
          </div>

          <div className="reveal reveal-d3" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.7rem" }}>
            {["Expert Faculty", "Small Batch Size", "Weekly Tests", "Doubt Sessions", "Defence Coaching", "Premnagar, Dehradun", "Class 9–12", "NDA & RIMC"].map(tag => (
              <span key={tag} style={{
                padding: "0.4rem 1rem",
                border: "1px solid rgba(249,115,22,0.28)",
                borderRadius: "100px",
                fontSize: "0.76rem", letterSpacing: "0.06em",
                color: "var(--orange)", background: "rgba(249,115,22,0.06)",
                transition: "background 0.3s",
              }}>{tag}</span>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "8rem 1.5rem", textAlign: "center",
        background: "linear-gradient(135deg, #120d08 0%, #1a1108 50%, #0a0c0e 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "70vw", height: "70vw", maxWidth: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
          <span className="s-label reveal">Limited Seats Available</span>
          <span className="o-rule reveal reveal-d1" />
          <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 800, color: "var(--cream)", marginBottom: "1.25rem", lineHeight: 1.15 }}>
            Begin Your Journey<br /><span className="orange-text">to Excellence Today</span>
          </h2>
          <p className="reveal reveal-d2" style={{ color: "var(--muted)", marginBottom: "3rem", lineHeight: 1.85, fontSize: "0.98rem", maxWidth: 480, margin: "0 auto 3rem" }}>
            New batch forming now. Seats are strictly limited to maintain the quality of instruction we are known for.
          </p>
          <div className="reveal reveal-d3">
            <a href="/contact" className="btn-o">Join SixBytes Today</a>
          </div>
        </div>
      </section>
    </>
  );
}