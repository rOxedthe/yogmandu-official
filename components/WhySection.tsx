"use client";
import { useRef, useEffect, useState, useCallback } from "react";

/* ── Animated counter ── */
function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

/* ── 3-D tilt card — entrance wrapper is separate so delay doesn't bleed into tilt ── */
function TiltCard({ p, delay }: { p: typeof pillars[0]; delay: number }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) scale(1.04)`;
    el.style.boxShadow = `${-x * 20}px ${y * 20}px 56px ${p.color}25, 0 8px 32px rgba(42,18,8,0.07)`;
  }, [p.color]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "0 4px 24px rgba(42,18,8,0.06)";
  }, []);

  return (
    /* Outer div owns ONLY the entrance animation — delay here doesn't affect tilt */
    <div
      ref={wrapRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(44px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {/* Inner div owns ONLY the tilt — zero delay, instant response */}
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          background: "white",
          borderRadius: "1.5rem",
          padding: "2rem",
          border: `1px solid ${p.color}18`,
          boxShadow: "0 4px 24px rgba(42,18,8,0.06)",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
          willChange: "transform",
          cursor: "default",
          position: "relative",
          overflow: "hidden",
          height: "100%",
        }}
      >
        {/* Top gradient line */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
          background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
          opacity: 0.5,
        }} />
        {/* Corner glow */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: 130, height: 130, pointerEvents: "none",
          background: `radial-gradient(circle at 100% 0%, ${p.color}14 0%, transparent 65%)`,
        }} />
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "1rem", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${p.color}10`, border: `1.5px solid ${p.color}25`,
        }}>
          {p.icon}
        </div>
        <h3 style={{
          fontFamily: "Cormorant Garamond, serif", fontSize: "1.35rem",
          fontWeight: 400, color: "#2A1208", marginBottom: 10,
        }}>
          {p.title}
        </h3>
        <p style={{ fontSize: "0.85rem", fontWeight: 400, lineHeight: 1.75, color: "#4A2E1A" }}>
          {p.body}
        </p>
        <div style={{
          position: "absolute", bottom: 20, right: 20, width: 8, height: 8,
          borderRadius: "50%", background: p.color, opacity: 0.25,
        }} />
      </div>
    </div>
  );
}

/* ── Pulsing stat orb ── */
function StatOrb({ s, i }: { s: typeof stats[0]; i: number }) {
  const { count, ref } = useCounter(s.numeric ?? 0, 1600);
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
    }}>
      <div style={{ position: "relative", width: 100, height: 100 }}>
        <div style={{
          position: "absolute", inset: -8, borderRadius: "50%",
          border: `1px solid ${s.color}`,
          opacity: 0.15,
          animation: `orb-pulse 2.4s ease-in-out ${i * 0.3}s infinite`,
        }} />
        <div style={{
          position: "absolute", inset: -2, borderRadius: "50%",
          border: `1px solid ${s.color}30`,
        }} />
        <div ref={ref} style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${s.color}28 0%, ${s.color}10 60%, transparent 100%)`,
          border: `1.5px solid ${s.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 32px ${s.color}18, inset 0 1px 0 rgba(255,255,255,0.6)`,
        }}>
          <span style={{
            fontFamily: "Cormorant Garamond, serif", fontSize: "1.9rem",
            fontWeight: 300, color: s.textColor ?? s.color, lineHeight: 1,
          }}>
            {s.numeric !== undefined ? `${count}${s.suffix ?? ""}` : s.value}
          </span>
        </div>
      </div>
      <p style={{ fontSize: "0.92rem", fontWeight: 400, color: "#5C3D2E", letterSpacing: "0.04em", textAlign: "center" }}>
        {s.label}
      </p>
    </div>
  );
}

const pillars = [
  {
    color: "#F7941D",
    title: "Authentic lineage",
    body: "Every technique traces directly to Himalayan masters. No hybridised wellness trends — just the real thing, held in its original context.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F7941D" strokeWidth="1.4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    color: "#6B2D8B",
    title: "Intimate groups",
    body: "We cap every cohort at 12 students. You get genuine attention, honest feedback, and teachers who actually know your practice.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="1.4">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    color: "#8DC63F",
    title: "Place as teacher",
    body: "The temples, the altitude, the living tradition — Kathmandu is woven into the curriculum. Nepal itself accelerates the transformation.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="1.4">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const stats = [
  { value: "3000+", numeric: 3000, suffix: "+", label: "Teachers trained",        color: "#F7941D", textColor: "#A65808" },
  { value: "50+",   numeric: 50,   suffix: "+", label: "Countries represented",   color: "#6B2D8B", textColor: "#6B2D8B" },
  { value: "2018",  numeric: undefined,          label: "Established in Nepal",    color: "#8DC63F", textColor: "#4A6418" },
  { value: "RYS",   numeric: undefined,          label: "Yoga Alliance certified", color: "#F7941D", textColor: "#A65808" },
];

export default function WhySection() {
  return (
    <section style={{ background: "#FFFFFF", padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}>

      {/* ── 3-D CSS background elements ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", perspective: "600px" }}>
        {/* Rotating mandala ring — top left */}
        <div style={{
          position: "absolute", top: "8%", left: "3%", width: 200, height: 200,
          animation: "why-spin-slow 18s linear infinite",
          willChange: "transform",
        }}>
          <svg viewBox="0 0 200 200" fill="none" opacity="0.07">
            <circle cx="100" cy="100" r="90" stroke="#F7941D" strokeWidth="1"/>
            <circle cx="100" cy="100" r="70" stroke="#F7941D" strokeWidth="0.8"/>
            <circle cx="100" cy="100" r="50" stroke="#6B2D8B" strokeWidth="0.8"/>
            {[0,45,90,135,180,225,270,315].map(d => (
              <line key={d} x1="100" y1="10" x2="100" y2="190"
                stroke="#F7941D" strokeWidth="0.5"
                transform={`rotate(${d} 100 100)`}/>
            ))}
          </svg>
        </div>

        {/* Counter-rotating ring — bottom right */}
        <div style={{
          position: "absolute", bottom: "5%", right: "2%", width: 240, height: 240,
          animation: "why-spin-slow 24s linear infinite reverse",
          willChange: "transform",
        }}>
          <svg viewBox="0 0 240 240" fill="none" opacity="0.06">
            <circle cx="120" cy="120" r="110" stroke="#6B2D8B" strokeWidth="1"/>
            <circle cx="120" cy="120" r="85"  stroke="#8DC63F" strokeWidth="0.8"/>
            <circle cx="120" cy="120" r="60"  stroke="#6B2D8B" strokeWidth="0.6"/>
            {[0,60,120,180,240,300].map(d => (
              <line key={d} x1="120" y1="10" x2="120" y2="230"
                stroke="#6B2D8B" strokeWidth="0.5"
                transform={`rotate(${d} 120 120)`}/>
            ))}
          </svg>
        </div>

        {/* Floating 3-D torus-like ring — mid right */}
        <div style={{
          position: "absolute", top: "40%", right: "5%", width: 120, height: 120,
          animation: "why-float-a 7s ease-in-out infinite",
          willChange: "transform",
        }}>
          <svg viewBox="0 0 120 120" fill="none" opacity="0.09">
            <ellipse cx="60" cy="60" rx="52" ry="22" stroke="#F7941D" strokeWidth="1.5"/>
            <ellipse cx="60" cy="60" rx="52" ry="52" stroke="#F7941D" strokeWidth="0.6"/>
          </svg>
        </div>

        {/* Small lotus — mid left */}
        <div style={{
          position: "absolute", top: "55%", left: "4%", width: 90, height: 90,
          animation: "why-float-b 9s ease-in-out infinite",
          willChange: "transform",
        }}>
          <svg viewBox="0 0 90 90" fill="none" opacity="0.08">
            <circle cx="45" cy="45" r="38" stroke="#8DC63F" strokeWidth="1"/>
            {[0,36,72,108,144,180,216,252,288,324].map(d => (
              <ellipse key={d} cx="45" cy="20" rx="7" ry="14"
                fill="#8DC63F" fillOpacity="0.15" stroke="#8DC63F" strokeWidth="0.5"
                transform={`rotate(${d} 45 45)`}/>
            ))}
          </svg>
        </div>

        {/* Dot grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025 }}>
          <defs>
            <pattern id="why-dots" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="1" fill="#6B2D8B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#why-dots)" />
        </svg>

        {/* Soft glow blobs */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 350, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(247,148,29,0.07) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: 0, width: 280, height: 280,
          background: "radial-gradient(circle, rgba(107,45,139,0.07) 0%, transparent 70%)",
        }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase",
            color: "#6B2D8B", marginBottom: 12 }}>Why Yogmandu</p>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 300, color: "#2A1208", lineHeight: 1.15, marginBottom: 16,
          }}>
            The difference you can <em style={{ color: "#A65808" }}>feel</em>
          </h2>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg,#6B2D8B,#F7941D)", margin: "0 auto" }} />
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.5rem",
          maxWidth: 680, margin: "0 auto 4.5rem",
        }}>
          {stats.map((s, i) => <StatOrb key={s.value} s={s} i={i} />)}
        </div>

        {/* Pillar cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {pillars.map((p, i) => <TiltCard key={p.title} p={p} delay={i * 120} />)}
        </div>
      </div>

      <style>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.15; }
          50%       { transform: scale(1.28); opacity: 0.04; }
        }
        @keyframes why-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes why-float-a {
          0%, 100% { transform: translateY(0px)   rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(8deg); }
        }
        @keyframes why-float-b {
          0%, 100% { transform: translateY(0px)  rotate(0deg); }
          50%       { transform: translateY(14px) rotate(-6deg); }
        }
      `}</style>
    </section>
  );
}
