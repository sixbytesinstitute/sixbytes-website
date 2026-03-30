"use client"

import { useEffect, useState, useRef } from "react";

// ── Particle canvas ────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const count = 90;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${p.o})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249,115,22,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}

// ── Counter ────────────────────────────────────────────────────────────────────
function Counter({ end, duration = 2200 }: { end: number; duration?: number }) {
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
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// ── Scroll reveal hook ─────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();

  return (
    <>
      {/* ── GLOBAL STYLES ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --orange: #F97316;
          --orange-light: #FB923C;
          --orange-dim: rgba(249,115,22,0.15);
          --obsidian: #0a0c0e;
          --navy: #0f1318;
          --navy-mid: #141a1f;
          --cream: #F7F3EC;
          --text-muted: rgba(247,243,236,0.55);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--obsidian);
          color: var(--cream);
          overflow-x: hidden;
          cursor: none;
        }

        /* Custom cursor */
        .cursor {
          position: fixed; top: 0; left: 0; z-index: 9999;
          pointer-events: none; mix-blend-mode: difference;
        }
        .cursor-dot {
          width: 8px; height: 8px; background: var(--orange);
          border-radius: 50%; transform: translate(-50%,-50%);
          transition: transform 0.1s;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1px solid rgba(249,115,22,0.6);
          border-radius: 50%; transform: translate(-50%,-50%);
          transition: transform 0.35s cubic-bezier(.25,.8,.25,1), width 0.3s, height 0.3s;
        }
        body:hover .cursor-ring { transform: translate(-50%,-50%) scale(1); }

        /* Scroll reveal */
        .reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
        }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-delay-1 { transition-delay: 0.15s; }
        .reveal-delay-2 { transition-delay: 0.30s; }
        .reveal-delay-3 { transition-delay: 0.45s; }
        .reveal-delay-4 { transition-delay: 0.60s; }

        /* Orange rule */
        .orange-rule {
          display: block; width: 60px; height: 2px;
          background: linear-gradient(90deg, var(--orange), transparent);
          margin: 0 auto 1.5rem;
        }

        /* Section label */
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--orange); margin-bottom: 1rem;
        }

        /* Display font */
        .display { font-family: 'Playfair Display', serif; }
        .serif { font-family: 'Cormorant Garamond', serif; }

        /* Gradient text */
        .orange-text {
          background: linear-gradient(135deg, var(--orange-light) 0%, var(--orange) 60%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Glass card */
        .glass-card {
          background: rgba(16,30,53,0.6);
          border: 1px solid rgba(249,115,22,0.18);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          transition: border-color 0.4s, transform 0.4s, box-shadow 0.4s;
        }
        .glass-card:hover {
          border-color: rgba(249,115,22,0.5);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(249,115,22,0.1);
        }

        /* CTA button */
        .btn-orange {
          display: inline-block;
          position: relative; overflow: hidden;
          padding: 1rem 2.5rem;
          background: transparent;
          border: 1px solid var(--orange);
          color: var(--orange);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
          transition: color 0.4s;
          cursor: none;
        }
        .btn-orange::before {
          content: ''; position: absolute; inset: 0;
          background: var(--orange);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(.77,0,.175,1);
          z-index: -1;
        }
        .btn-orange:hover { color: var(--obsidian); }
        .btn-orange:hover::before { transform: scaleX(1); }

        /* Stat number */
        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 600; line-height: 1;
          background: linear-gradient(180deg, var(--orange-light), var(--orange));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* Horizontal rule */
        hr.orange { border: none; border-top: 1px solid rgba(249,115,22,0.2); }

        /* Floating badge */
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .float { animation: floatY 4s ease-in-out infinite; }

        /* Shimmer line */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, var(--orange) 50%, transparent 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          height: 1px; width: 100%;
        }

        /* Testimonial */
        .testimonial-card {
          background: linear-gradient(135deg, rgba(16,30,53,0.9) 0%, rgba(8,12,20,0.9) 100%);
          border: 1px solid rgba(249,115,22,0.12);
          border-radius: 16px; padding: 2.5rem;
          transition: border-color 0.4s, transform 0.4s;
        }
        .testimonial-card:hover {
          border-color: rgba(249,115,22,0.4);
          transform: translateY(-4px);
        }

        /* Tag pill */
        .tag-pill {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 1.1rem;
          border: 1px solid rgba(249,115,22,0.3);
          border-radius: 100px;
          font-size: 0.78rem; letter-spacing: 0.06em;
          color: var(--orange);
          background: rgba(249,115,22,0.06);
          transition: background 0.3s, border-color 0.3s;
        }
        .tag-pill:hover { background: rgba(249,115,22,0.14); border-color: var(--orange); }

        /* Diagonal section divider */
        .clip-diagonal { clip-path: polygon(0 4%, 100% 0%, 100% 96%, 0% 100%); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--obsidian); }
        ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }

        /* Hero text stagger */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-line-1 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.3s both; }
        .hero-line-2 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.55s both; }
        .hero-line-3 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.8s both; }
        .hero-stats  { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 1.0s both; }
        .hero-cta    { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 1.25s both; }

        /* Course icon glow */
        .icon-wrap {
          width: 56px; height: 56px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          background: var(--orange-dim);
          border: 1px solid rgba(249,115,22,0.3);
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          transition: background 0.3s;
        }
        .glass-card:hover .icon-wrap { background: rgba(249,115,22,0.25); }
      `}</style>

      {/* ── CURSOR ──────────────────────────────────────────────────────────── */}
      <CursorFollower />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative", minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(160deg, #130e0a 0%, #1a1008 50%, #0a0c0e 100%)`,
          overflow: "hidden",
        }}
      >
        {/* Particle canvas */}
        <ParticleField />

        {/* Radial glow blobs */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "60vw", height: "60vw", maxWidth: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "50vw", height: "50vw", maxWidth: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,80,180,0.12) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Diagonal grid lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F97316" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 1.5rem", maxWidth: 900 }}>

          {/* Logo badge */}
          <div className="float hero-line-1" style={{ marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: "100px", padding: "0.5rem 1.25rem",
            }}>
              <img src="/logo.png" style={{ width: 28, height: 28, objectFit: "contain" }} alt="SixBytes" />
              <span style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--orange)" }}>
                SixBytes Educational Institute
              </span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="display hero-line-2" style={{
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
            fontWeight: 800, lineHeight: 1.08,
            color: "var(--cream)", marginBottom: "0.5rem",
          }}>
            Where Excellence
          </h1>
          <h1 className="display hero-line-2 orange-text" style={{
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
            fontWeight: 800, lineHeight: 1.08, marginBottom: "1.75rem",
          }}>
            Becomes Legacy
          </h1>

          {/* Sub */}
          <p className="hero-line-3" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
            fontWeight: 300, color: "var(--text-muted)",
            letterSpacing: "0.04em", marginBottom: "3rem",
          }}>
            Classes 9–10 &nbsp;·&nbsp; Classes 11–12 &nbsp;·&nbsp; NDA &nbsp;·&nbsp; RIMC
          </p>

          {/* Stats */}
          <div className="hero-stats" style={{
            display: "flex", justifyContent: "center", gap: "clamp(2rem,6vw,5rem)",
            marginBottom: "3.5rem",
          }}>
            {[
              { n: 1200, label: "Students Shaped" },
              { n: 350, label: "Top Results" },
              { n: 5, label: "Years of Mastery" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="stat-num"><Counter end={n} />+</div>
                <div style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "0.5rem" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="hero-cta">
            <a href="/contact" className="btn-orange">Book a Free Demo</a>
          </div>

        </div>

        {/* Bottom shimmer */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <div className="shimmer-line" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COURSES
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "var(--navy)", position: "relative", overflow: "hidden" }}>

        {/* Background noise texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          opacity: 0.4, pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p className="section-label reveal">Our Programmes</p>
            <span className="orange-rule reveal reveal-delay-1" />
            <h2 className="display reveal reveal-delay-1" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 700, color: "var(--cream)" }}>
              Crafted for <span className="orange-text">Champions</span>
            </h2>
            <p className="reveal reveal-delay-2" style={{ color: "var(--text-muted)", maxWidth: 520, margin: "1.25rem auto 0", lineHeight: 1.8 }}>
              Comprehensive programmes designed with precision to build unshakeable concepts and deliver outstanding results.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.75rem" }}>

            {[
              {
                icon: "📐",
                title: "Class 9–10 Foundation",
                sub: "Conceptual clarity in Maths & Science, weekly tests and personalised doubt sessions.",
                points: ["Maths & Science Focus", "Weekly Tests & Deep Analysis", "One-on-One Doubt Sessions"],
                tag: "Strong base for future success",
                delay: 0,
              },
              {
                icon: "⚗️",
                title: "Class 11–12 Boards + Competitive",
                sub: "Board mastery combined with JEE / NEET foundation under expert faculty.",
                points: ["Physics, Chemistry, Maths / Biology", "Board + Competitive Strategy", "Regular Mock Test Series"],
                tag: "Score high in every arena",
                delay: 1,
              },
              {
                icon: "🎖️",
                title: "NDA / RMS / Sainik School",
                sub: "Full-spectrum coaching for defence entrances — written, SSB and beyond.",
                points: ["Maths + General Ability", "SSB Interview Guidance", "Physical & Personality Training"],
                tag: "Complete defence preparation",
                delay: 2,
              },
            ].map(({ icon, title, sub, points, tag, delay }) => (
              <div key={title} className={`glass-card reveal reveal-delay-${delay + 1}`} style={{ padding: "2.5rem 2rem" }}>
                <div className="icon-wrap">{icon}</div>
                <h3 className="display" style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.75rem" }}>{title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>{sub}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.75rem" }}>
                  {points.map(p => (
                    <li key={p} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: "var(--cream)", opacity: 0.8 }}>
                      <span style={{ color: "var(--orange)", fontSize: "0.6rem" }}>◆</span>{p}
                    </li>
                  ))}
                </ul>
                <p style={{ fontFamily: "'Cormorant Garamond'", color: "var(--orange)", fontSize: "1rem", fontStyle: "italic" }}>{tag}</p>
              </div>
            ))}

          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }} className="reveal">
            <a href="/contact" className="btn-orange">Book Free Demo Class</a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RESULTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "8rem 1.5rem",
        background: "linear-gradient(160deg, var(--obsidian) 0%, #150f08 100%)",
        position: "relative", overflow: "hidden",
      }}>

        {/* Decorative circle */}
        <div style={{
          position: "absolute", right: "-15%", top: "50%", transform: "translateY(-50%)",
          width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "50%", border: "1px solid rgba(249,115,22,0.07)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "-12%", top: "50%", transform: "translateY(-50%)",
          width: "40vw", height: "40vw", maxWidth: 480, maxHeight: 480,
          borderRadius: "50%", border: "1px solid rgba(249,115,22,0.05)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p className="section-label reveal">Proof of Excellence</p>
            <span className="orange-rule reveal reveal-delay-1" />
            <h2 className="display reveal reveal-delay-1" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 700, color: "var(--cream)" }}>
              Our Top <span className="orange-text">Achievers</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "2rem" }}>

            {[
              { name: "Ishant Bisht", img: "/topper1.jpg", grade: "Class 10", score: "94%", desc: "Outstanding performance in board examinations" },
              { name: "Anshika Baluni", img: "/topper2.jpg", grade: "Class 12", score: "92%", desc: "Excellent results in the Science stream" },
            ].map(({ name, img, grade, score, desc }) => (
              <div key={name} className="glass-card reveal" style={{ padding: "2.5rem", display: "flex", gap: "2rem", alignItems: "center" }}>
                <div style={{ flexShrink: 0, position: "relative" }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: "50%",
                    border: "2px solid var(--orange)",
                    overflow: "hidden",
                  }}>
                    <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{
                    position: "absolute", bottom: -6, right: -6,
                    background: "var(--orange)", borderRadius: "50%",
                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 700, color: "var(--obsidian)",
                  }}>★</div>
                </div>
                <div>
                  <h3 className="display" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--cream)", marginBottom: "0.2rem" }}>{name}</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{grade}</p>
                  <p className="stat-num" style={{ fontSize: "2.8rem", lineHeight: 1, marginBottom: "0.4rem" }}>{score}</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontStyle: "italic" }}>{desc}</p>
                </div>
              </div>
            ))}

          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }} className="reveal">
            <a href="/contact" className="btn-orange">Join Our Success Batch</a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "var(--navy-mid)", position: "relative" }}>

        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p className="section-label reveal">Voices That Matter</p>
            <span className="orange-rule reveal reveal-delay-1" />
            <h2 className="display reveal reveal-delay-1" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 700, color: "var(--cream)" }}>
              What <span className="orange-text">Parents Say</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.75rem" }}>

            {[
              { quote: "My son improved from 65% to 92%. The teachers are deeply supportive and the weekly test structure helped enormously.", author: "Mr Suresh Chauhan", delay: 1 },
              { quote: "The best coaching institute in our area. The weekly assessments genuinely improved my daughter's confidence and rank.", author: "Mr Bisht", delay: 2 },
              { quote: "Exceptional NDA preparation. The discipline, guidance, and attention to personality development are unmatched.", author: "Mrs. Sharma", delay: 3 },
            ].map(({ quote, author, delay }) => (
              <div key={author} className={`testimonial-card reveal reveal-delay-${delay}`}>
                <div style={{ color: "var(--orange)", fontSize: "2rem", marginBottom: "1.25rem", letterSpacing: "0.05em" }}>✦ ✦ ✦ ✦ ✦</div>
                <p className="serif" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(247,243,236,0.8)", marginBottom: "1.75rem", fontStyle: "italic" }}>"{quote}"</p>
                <hr className="orange" style={{ marginBottom: "1.25rem" }} />
                <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)" }}>{author}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEO / ABOUT
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "8rem 1.5rem", background: "var(--obsidian)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>

          <p className="section-label reveal">About SixBytes</p>
          <span className="orange-rule reveal reveal-delay-1" />
          <h2 className="display reveal reveal-delay-1" style={{ fontSize: "clamp(1.9rem,4vw,3.2rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: "2rem" }}>
            Best Coaching Institute in{" "}
            <span className="orange-text">Premnagar, Dehradun</span>
          </h2>

          <p className="serif reveal reveal-delay-2" style={{ fontSize: "clamp(1rem,1.8vw,1.3rem)", color: "var(--text-muted)", lineHeight: 1.9, maxWidth: 700, margin: "0 auto 3rem" }}>
            SixBytes Educational Institute provides expert coaching for Classes 9–12, NDA, RMS and Sainik School — with an unwavering focus on conceptual clarity and real results. Trusted by over 1,000 students across Dehradun.
          </p>

          <div className="glass-card reveal reveal-delay-2" style={{ padding: "3rem", textAlign: "left", marginBottom: "3.5rem" }}>
            <p style={{ color: "rgba(247,243,236,0.75)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              We specialise in building strong foundations in{" "}
              <strong style={{ color: "var(--cream)" }}>Mathematics, Physics, Chemistry and Biology</strong>.
              Our experienced faculty ensures every student receives personal attention through small batch sizes.
            </p>
            <p style={{ color: "rgba(247,243,236,0.75)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              Regular test series and dedicated doubt-solving sessions ensure students consistently improve and achieve excellent results.
            </p>
            <p style={{ color: "rgba(247,243,236,0.75)", lineHeight: 1.9 }}>
              We also provide dedicated preparation for{" "}
              <span style={{ color: "var(--orange)", fontWeight: 500 }}>NDA, RMS and Sainik School entrance exams</span>, covering written tests, SSB guidance and personality development.
            </p>
          </div>

          <div className="reveal reveal-delay-3" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            {["Expert Faculty", "Small Batch Size", "Weekly Tests", "Doubt Sessions", "Defence Coaching", "Premnagar, Dehradun"].map(tag => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "8rem 1.5rem",
        background: "linear-gradient(135deg, #120d08 0%, #1a1108 50%, #0a0c0e 100%)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Orange burst */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "70vw", height: "70vw", maxWidth: 700, maxHeight: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <p className="section-label reveal">Limited Seats Available</p>
          <span className="orange-rule reveal reveal-delay-1" />
          <h2 className="display reveal reveal-delay-1" style={{ fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 800, color: "var(--cream)", marginBottom: "1.25rem" }}>
            Begin Your Journey<br /><span className="orange-text">to Excellence</span>
          </h2>
          <p className="reveal reveal-delay-2" style={{ color: "var(--text-muted)", marginBottom: "3rem", lineHeight: 1.8, fontSize: "1rem" }}>
            New batch forming now. Seats are strictly limited to maintain the quality of instruction we are known for.
          </p>
          <div className="reveal reveal-delay-3">
            <a href="/contact" className="btn-orange">Contact Us Today</a>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Custom cursor component ────────────────────────────────────────────────────
function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="cursor">
      <div ref={dotRef} className="cursor-dot" style={{ position: "fixed", top: 0, left: 0 }} />
      <div ref={ringRef} className="cursor-ring" style={{ position: "fixed", top: 0, left: 0 }} />
    </div>
  );
}