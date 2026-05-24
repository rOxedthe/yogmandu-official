"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SingingBowl = dynamic(() => import("@/components/SingingBowl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 200 }}>
      <div className="w-16 h-16 rounded-full animate-pulse" style={{ border: "1.5px solid rgba(107,45,139,0.3)" }} />
    </div>
  ),
});

/** CSS-only bowl — zero Three.js, zero JS weight on mobile */
function CSSBowl() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 220, gap: 14 }}>
      <div style={{ position: "relative", width: 164, height: 164 }}>
        {/* Outer pulse rings */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1.5px solid rgba(107,45,139,0.18)",
          animation: "css-bowl-pulse 2.6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 14, borderRadius: "50%",
          border: "1px solid rgba(247,148,29,0.14)",
          animation: "css-bowl-pulse 2.6s ease-in-out 0.55s infinite",
        }} />
        {/* Bowl sphere */}
        <div style={{
          position: "absolute", inset: "22%",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 32%, rgba(107,45,139,0.22) 0%, rgba(107,45,139,0.07) 60%, transparent 100%)",
          border: "1.5px solid rgba(107,45,139,0.28)",
          boxShadow: "0 6px 28px rgba(107,45,139,0.14), inset 0 1px 0 rgba(255,255,255,0.55)",
        }} />
        {/* Warm centre glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 12, height: 12, borderRadius: "50%",
          background: "rgba(247,148,29,0.55)",
          animation: "css-bowl-pulse 1.9s ease-in-out infinite",
        }} />
        {/* Subtle highlight arc */}
        <svg style={{ position: "absolute", inset: "18%", width: "64%", height: "64%" }} viewBox="0 0 80 80" fill="none" aria-hidden>
          <path d="M16 30 Q40 8 64 30" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <p style={{ fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#A65808", fontWeight: 500 }}>
        🎵 Tibetan Singing Bowl
      </p>
      <style>{`
        @keyframes css-bowl-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.45; }
          50%       { transform: scale(1.14); opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}

/**
 * Mobile (<768px): CSS-only bowl — Three.js never downloads → ~10s TBT savings.
 * Desktop: full interactive 3-D SingingBowl loaded after browser idle.
 */
export default function SingingBowlClient() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setMobile(window.innerWidth < 768);
  }, []);

  if (mobile === null) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 200 }}>
        <div className="w-16 h-16 rounded-full animate-pulse" style={{ border: "1.5px solid rgba(107,45,139,0.3)" }} />
      </div>
    );
  }
  if (mobile) return <CSSBowl />;
  return <SingingBowl />;
}
