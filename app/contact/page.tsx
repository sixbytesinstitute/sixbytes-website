"use client"

import { useEffect, useRef, useState } from "react";

// ── Scroll reveal ──────────────────────────────────────────────────────────────
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

// ── Magnetic button hook ───────────────────────────────────────────────────────
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [strength]);
  return ref;
}

// ── Floating particles (scoped) ────────────────────────────────────────────────
function MiniParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let id: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 35 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.1 + 0.2,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.35 + 0.08,
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
          if (d < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249,115,22,${0.05 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── Contact info row ───────────────────────────────────────────────────────────
function InfoRow({ icon, label, children, delay = 0 }: { icon: string; label: string; children: React.ReactNode; delay?: number }) {
  return (
    <div className={`reveal reveal-d${delay}`} style={{
      display: "flex", gap: "1.25rem", alignItems: "flex-start",
      padding: "1.4rem 1.5rem",
      background: "rgba(249,115,22,0.04)",
      border: "1px solid rgba(249,115,22,0.12)",
      borderRadius: "14px",
      transition: "border-color 0.35s, background 0.35s, transform 0.35s",
    }}
      onMouseEnter={e => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.borderColor = "rgba(249,115,22,0.4)";
        d.style.background = "rgba(249,115,22,0.08)";
        d.style.transform = "translateX(6px)";
      }}
      onMouseLeave={e => {
        const d = e.currentTarget as HTMLDivElement;
        d.style.borderColor = "rgba(249,115,22,0.12)";
        d.style.background = "rgba(249,115,22,0.04)";
        d.style.transform = "translateX(0)";
      }}
    >
      <div style={{
        flexShrink: 0, width: 46, height: 46, borderRadius: "12px",
        background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(249,115,22,0.7)", marginBottom: "0.3rem" }}>{label}</p>
        {children}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  useReveal();
  const waRef = useMagnetic(0.4);
  const igRef = useMagnetic(0.4);
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --orange: #F97316;
          --orange-light: #FB923C;
          --obsidian: #0a0c0e;
          --surface: #111416;
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

        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1); }
        .reveal.revealed { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }
        .reveal-d5 { transition-delay: 0.5s; }

        .s-label { font-size: 0.67rem; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase; color: var(--orange); display: block; margin-bottom: 0.7rem; }
        .o-rule  { display: block; width: 50px; height: 2px; background: linear-gradient(90deg, var(--orange), transparent); margin: 0 auto 1.5rem; }

        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .shimmer-line { background: linear-gradient(90deg, transparent 0%, var(--orange) 50%, transparent 100%); background-size: 200% auto; animation: shimmer 3.5s linear infinite; height: 1px; width: 100%; }

        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .hl1 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.2s both; }
        .hl2 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .hl3 { animation: slideUp 1s cubic-bezier(.22,1,.36,1) 0.6s both; }

        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .float { animation: floatY 4s ease-in-out infinite; }

        @keyframes glowPulse { 0%,100%{opacity:0.45} 50%{opacity:0.9} }
        @keyframes spin { to{transform:rotate(360deg)} }

        @keyframes skelshimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .soc-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem;
          padding: 0.95rem 1.75rem; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500;
          letter-spacing: 0.06em; text-decoration: none; cursor: pointer;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s;
          position: relative; overflow: hidden;
        }
        .soc-btn::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.12);
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(.22,1,.36,1);
        }
        .soc-btn:hover::after { transform: translateX(0); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--obsidian); }
        ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 4px; }

        .map-frame { transition: opacity 0.6s ease; }

        @keyframes ping { 75%,100%{transform:scale(2.2);opacity:0} }
        .ping { animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: "relative", minHeight: "52vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #130e0a 0%, #1a1008 55%, #0a0c0e 100%)",
        overflow: "hidden",
      }}>
        <MiniParticles />

        {/* Orbit rings */}
        {[280, 420, 560].map((sz, i) => (
          <div key={sz} style={{
            position: "absolute", width: sz, height: sz, borderRadius: "50%",
            border: `1px solid rgba(249,115,22,${0.1 - i * 0.025})`,
            animation: `spin ${16 + i * 9}s linear infinite ${i % 2 ? "reverse" : ""}`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "55vw", height: "55vw", maxWidth: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 68%)",
          animation: "glowPulse 4s ease-in-out infinite", pointerEvents: "none",
        }} />

        {/* Grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03, pointerEvents: "none" }}>
          <defs><pattern id="ctgrid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#F97316" strokeWidth="0.5"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#ctgrid)" />
        </svg>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "4rem 1.5rem 3rem" }}>
          <div className="hl1 float" style={{ marginBottom: "2rem" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(249,115,22,0.09)", border: "1px solid rgba(249,115,22,0.28)",
              borderRadius: "100px", padding: "0.42rem 1.15rem",
              fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--orange)",
            }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span className="ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--orange)", opacity: 0.6 }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange)", display: "block" }} />
              </span>
              We're here to help
            </span>
          </div>

          <h1 className="display hl2" style={{ fontSize: "clamp(2.8rem,8vw,6rem)", fontWeight: 800, lineHeight: 1.05, color: "var(--cream)", marginBottom: "0.3rem" }}>
            Get in
          </h1>
          <h1 className="display hl2 orange-text" style={{ fontSize: "clamp(2.8rem,8vw,6rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "1.5rem" }}>
            Touch
          </h1>
          <p className="serif hl3" style={{ fontSize: "clamp(1rem,2vw,1.35rem)", fontWeight: 300, color: "var(--muted)", letterSpacing: "0.04em", lineHeight: 1.8 }}>
            Visit us · Call us · WhatsApp us · Find us on the map
          </p>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
          <div className="shimmer-line" />
        </div>
      </section>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem 8rem", background: "var(--surface)", position: "relative", overflow: "hidden" }}>

        <div className="display" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          fontSize: "clamp(8rem,18vw,18rem)", fontWeight: 900, lineHeight: 1,
          color: "rgba(249,115,22,0.022)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap",
        }}>CONTACT</div>

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Header card */}
              <div className="reveal" style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.04) 100%)",
                border: "1px solid rgba(249,115,22,0.22)",
                borderRadius: "20px", padding: "2.25rem 2rem",
                position: "relative", overflow: "hidden",
              }}>
                <svg style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, opacity: 0.06 }} viewBox="0 0 120 120">
                  <circle cx="120" cy="0" r="80" fill="none" stroke="#F97316" strokeWidth="1"/>
                  <circle cx="120" cy="0" r="55" fill="none" stroke="#F97316" strokeWidth="0.5"/>
                </svg>
                <span className="s-label">Reach Us Directly</span>
                <h2 className="display" style={{ fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
                  We'd Love to<br /><span className="orange-text">Hear From You</span>
                </h2>
                <p className="serif" style={{ color: "var(--muted)", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.75 }}>
                  Book a free demo class, ask us anything, or simply drop by — we're always open.
                </p>
              </div>

              {/* Address */}
              <InfoRow icon="📍" label="Our Location" delay={1}>
                <p style={{ color: "var(--cream)", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  SixBytes Educational Institute<br />
                  Opp. Lane No. 3, Sai Vihar, Shyampur<br />
                  <span style={{ color: "var(--orange)" }}>Premnagar, Dehradun</span>
                </p>
              </InfoRow>

              {/* Phone */}
              <InfoRow icon="📞" label="Call Us" delay={2}>
                <a href="tel:+917536839760" style={{
                  color: "var(--cream)", fontSize: "1.1rem", fontWeight: 500,
                  textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.25s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--orange)"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--cream)"}
                >+91 75368 39760</a>
                <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.2rem" }}>Mon – Sat, 8 AM – 7 PM</p>
              </InfoRow>

              {/* Social buttons */}
              <div className="reveal reveal-d3" style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <a ref={waRef} href="https://wa.me/917536839760" target="_blank" rel="noopener noreferrer" className="soc-btn"
                  style={{ background: "linear-gradient(135deg, #1db954 0%, #16a34a 100%)", boxShadow: "0 8px 32px rgba(29,185,84,0.25)", color: "#fff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                  <span style={{ marginLeft: "auto", fontSize: "0.7rem", opacity: 0.7 }}>→</span>
                </a>

                <a ref={igRef} href="https://instagram.com/sixbytes" target="_blank" rel="noopener noreferrer" className="soc-btn"
                  style={{ background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)", boxShadow: "0 8px 32px rgba(253,29,29,0.2)", color: "#fff" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Follow on Instagram
                  <span style={{ marginLeft: "auto", fontSize: "0.7rem", opacity: 0.7 }}>→</span>
                </a>
              </div>

              {/* Batch timings */}
              <div className="reveal reveal-d4" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(249,115,22,0.1)",
                borderRadius: "14px", padding: "1.5rem",
              }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(249,115,22,0.7)", marginBottom: "1rem" }}>Batch Timings</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {[
                    { batch: "Morning Batch", time: "7:00 AM – 9:00 AM" },
                    { batch: "Afternoon Batch", time: "2:00 PM – 4:00 PM" },
                    { batch: "Evening Batch", time: "5:00 PM – 7:00 PM" },
                  ].map(({ batch, time }) => (
                    <div key={batch} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{batch}</span>
                      <span style={{ color: "var(--cream)", fontSize: "0.82rem", fontWeight: 500 }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT: Map ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              <div className="reveal reveal-d2" style={{
                position: "relative", borderRadius: "20px", overflow: "hidden",
                border: "1px solid rgba(249,115,22,0.2)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.05)",
              }}>
                {/* Map header */}
                <div style={{
                  padding: "1rem 1.5rem",
                  background: "linear-gradient(90deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))",
                  borderBottom: "1px solid rgba(249,115,22,0.15)",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                }}>
                  <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                    <span className="ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--orange)", opacity: 0.5 }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--orange)", display: "block" }} />
                  </span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--orange)" }}>
                    SixBytes Educational Institute
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--muted)" }}>Premnagar, Dehradun</span>
                </div>

                {/* Skeleton */}
                {!mapLoaded && (
                  <div style={{
                    position: "absolute", inset: 0, top: 48,
                    background: "linear-gradient(90deg, #111416 25%, #1a1e22 50%, #111416 75%)",
                    backgroundSize: "200% 100%",
                    animation: "skelshimmer 1.5s infinite",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1,
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>📍</div>
                      <p style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>Loading map…</p>
                    </div>
                  </div>
                )}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8540051474743!2d77.9320947754021!3d30.326670274782657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092b56ccad2f27%3A0x2b0ae3d4359a4853!2sSixBytes%20Educational%20Institute!5e0!3m2!1sen!2sin!4v1774718605519!5m2!1sen!2sin"
                  width="100%" height="420"
                  className="map-frame"
                  style={{ border: 0, display: "block", opacity: mapLoaded ? 1 : 0 }}
                  allowFullScreen loading="lazy"
                  onLoad={() => setMapLoaded(true)}
                  title="SixBytes Educational Institute Location – Premnagar, Dehradun"
                />
              </div>

              {/* Directions link */}
              <a href="https://maps.google.com/?q=SixBytes+Educational+Institute+Premnagar+Dehradun"
                target="_blank" rel="noopener noreferrer"
                className="reveal reveal-d3"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  padding: "1.1rem",
                  background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)",
                  borderRadius: "12px", color: "var(--orange)", fontSize: "0.82rem",
                  fontFamily: "'DM Sans'", letterSpacing: "0.08em", textDecoration: "none",
                  transition: "background 0.3s, border-color 0.3s",
                }}
                onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(249,115,22,0.12)"; a.style.borderColor = "rgba(249,115,22,0.45)"; }}
                onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.background = "rgba(249,115,22,0.06)"; a.style.borderColor = "rgba(249,115,22,0.2)"; }}
              >
                <span>📍</span>
                <span>Get Directions on Google Maps</span>
                <span style={{ marginLeft: "auto", opacity: 0.6 }}>↗</span>
              </a>

              {/* Quick contact tiles */}
              <div className="reveal reveal-d4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { icon: "📞", label: "Call Now", sub: "+91 75368 39760", href: "tel:+917536839760" },
                  { icon: "💬", label: "WhatsApp", sub: "Message us now", href: "https://wa.me/917536839760" },
                ].map(({ icon, label, sub, href }) => (
                  <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer" style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                      padding: "1.25rem 1rem",
                      background: "rgba(249,115,22,0.05)",
                      border: "1px solid rgba(249,115,22,0.1)",
                      borderRadius: "14px", textDecoration: "none",
                      transition: "transform 0.3s, border-color 0.3s",
                    }}
                    onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = "translateY(-4px)"; a.style.borderColor = "rgba(249,115,22,0.35)"; }}
                    onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.transform = "translateY(0)"; a.style.borderColor = "rgba(249,115,22,0.1)"; }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                    <span style={{ color: "var(--cream)", fontSize: "0.82rem", fontWeight: 600 }}>{label}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{sub}</span>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "6rem 1.5rem", textAlign: "center",
        background: "linear-gradient(135deg, #120d08 0%, #1a1108 50%, #0a0c0e 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "65vw", height: "65vw", maxWidth: 650, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 580, margin: "0 auto" }}>
          <span className="s-label reveal">Limited Seats Available</span>
          <span className="o-rule reveal reveal-d1" />
          <h2 className="display reveal reveal-d1" style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 800, color: "var(--cream)", lineHeight: 1.15, marginBottom: "1rem" }}>
            Ready to Start Your<br /><span className="orange-text">Journey?</span>
          </h2>
          <p className="reveal reveal-d2" style={{ color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
            New batches forming now. Reach out today and secure your seat at SixBytes Educational Institute, Premnagar Dehradun.
          </p>
          <div className="reveal reveal-d3" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a href="tel:+917536839760" style={{
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
            >Call Us Now</a>
            <a href="https://wa.me/917536839760" target="_blank" rel="noopener noreferrer" style={{
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
            >WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  );
}