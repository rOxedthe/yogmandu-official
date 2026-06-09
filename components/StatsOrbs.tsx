"use client";
import { useRef, useEffect, useState } from "react";

export type OrbStat = {
  value: string;
  numeric?: number;
  suffix?: string;
  label: string;
  color: string;
  textColor?: string;
};

/* Animated counter — counts up once the orb scrolls into view */
function useCounter(target: number, duration = 1600) {
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

function StatOrb({ s, i }: { s: OrbStat; i: number }) {
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

export default function StatsOrbs({ stats }: { stats: OrbStat[] }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1.25rem",
      maxWidth: 920, margin: "0 auto",
    }}>
      {stats.map((s, i) => <StatOrb key={s.value + s.label} s={s} i={i} />)}
      <style>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.15; }
          50%       { transform: scale(1.28); opacity: 0.04; }
        }
      `}</style>
    </div>
  );
}
