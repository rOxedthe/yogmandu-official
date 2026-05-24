"use client";

import { useCallback, useRef } from "react";

type Tier = {
  id:        string;
  badge:     string;
  badgeColor: string;
  category:  string;
  title:     string;
  icon:      string;
  price:     string;
  priceSub:  string;
  priceNote: string;
  color:     string;        // accent
  features:  string[];
  ctaLabel:  string;
  ctaHref:   string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    id:        "commuter",
    badge:     "",
    badgeColor: "#F7941D",
    category:  "Non-Residential",
    title:     "Commuter Program",
    icon:      "🚪",
    price:     "USD 600",
    priceSub:  "NPR 45,000 early bird · NPR 70,000 regular",
    priceNote: "(Nepalese citizens)",
    color:     "#F7941D",
    features: [
      "Yoga Alliance RYT 200 Certificate",
      "Yogmandu training manual",
      "Tea & coffee daily",
      "28-day program",
      "Morning & afternoon sessions",
    ],
    ctaLabel:  "Apply Now",
    ctaHref:   "https://wa.me/9779862909469",
  },
  {
    id:        "residential",
    badge:     "Most Popular",
    badgeColor: "#6B2D8B",
    category:  "Residential",
    title:     "Full Board Program",
    icon:      "🏡",
    price:     "USD 1,400",
    priceSub:  "USD 200 deposit on booking",
    priceNote: "+ USD 1,200 due on arrival",
    color:     "#6B2D8B",
    features: [
      "Yoga Alliance RYT 200 Certificate",
      "Shared accommodation (25 days)",
      "3 organic vegetarian meals daily",
      "Unlimited herbal teas",
      "Shatkarma kit",
      "2 Ayurvedic massages",
      "Training manual & notebook",
    ],
    ctaLabel:  "Apply Now",
    ctaHref:   "https://wa.me/9779862909469",
    featured:  true,
  },
  {
    id:        "virtual",
    badge:     "",
    badgeColor: "#8DC63F",
    category:  "Virtual",
    title:     "Online Program",
    icon:      "💻",
    price:     "Contact Us",
    priceSub:  "Live virtual sessions",
    priceNote: "Registration via Google Form",
    color:     "#8DC63F",
    features: [
      "Yoga Alliance RYT 200 Certificate",
      "Live online sessions",
      "Training manual",
      "Asanas, Pranayama & bandhas",
      "Teaching methodology",
    ],
    ctaLabel:  "Get Details",
    ctaHref:   "mailto:info@yogmandu.com",
  },
];

// ── A single 3D tilt pricing card ─────────────────────────────────────
function PricingCard({ tier }: { tier: Tier }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const priceRef   = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    const liftBase = tier.featured ? -16 : -10;
    el.style.transform = `perspective(1000px) rotateY(${x * 11}deg) rotateX(${-y * 8}deg) translateY(${liftBase}px) scale(${tier.featured ? 1.03 : 1.02})`;
    el.style.boxShadow =
      `${-x * 30}px ${y * 30}px 60px rgba(42,18,8,0.22), ` +
      `0 0 0 1.5px ${tier.color}99, ` +
      `0 0 40px ${tier.color}44`;
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.transform = `translate(${(e.clientX - r.left)}px, ${(e.clientY - r.top)}px)`;
    }
    if (priceRef.current) {
      priceRef.current.style.transform = `translate(${-x * 8}px, ${-y * 6}px)`;
    }
  }, [tier.color, tier.featured]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const liftBase = tier.featured ? -10 : 0;
    el.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(${liftBase}px) scale(${tier.featured ? 1.02 : 1})`;
    el.style.boxShadow = tier.featured
      ? `0 18px 50px ${tier.color}33, 0 0 0 1px ${tier.color}66`
      : `0 8px 28px rgba(42,18,8,0.08)`;
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (priceRef.current) priceRef.current.style.transform = "translate(0, 0)";
  }, [tier.color, tier.featured]);

  // Initial featured lift via inline style on first render
  const initialTransform = tier.featured
    ? "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(-10px) scale(1.02)"
    : "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)";

  const initialShadow = tier.featured
    ? `0 18px 50px ${tier.color}33, 0 0 0 1px ${tier.color}66`
    : `0 8px 28px rgba(42,18,8,0.08)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="ytt-card relative rounded-3xl overflow-hidden"
      style={{
        background:    "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        border:        `1.5px solid ${tier.color}33`,
        boxShadow:     initialShadow,
        transform:     initialTransform,
        transition:    "transform 0.3s ease, box-shadow 0.3s ease",
        willChange:    "transform",
        padding:       "2.2rem 1.9rem",
      }}
    >
      {/* Animated gradient ring around featured card */}
      {tier.featured && (
        <div style={{
          position: "absolute", inset: -1, borderRadius: 26,
          background: `conic-gradient(from 0deg, ${tier.color}88, transparent 25%, ${tier.color}55 50%, transparent 75%, ${tier.color}88)`,
          opacity: 0.7, animation: "yttRingSpin 12s linear infinite",
          pointerEvents: "none", zIndex: 0,
        }} />
      )}

      <div className="ytt-card-inner relative" style={{
        background: tier.featured ? "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(249,245,255,0.92))" : "rgba(255,255,255,0.92)",
        borderRadius: 22, padding: "0.6rem 0", zIndex: 1,
      }}>

        {/* Cursor-follow soft glow */}
        <div
          ref={glowRef}
          style={{
            position: "absolute", top: 0, left: 0, width: 360, height: 360,
            marginLeft: -180, marginTop: -180,
            background: `radial-gradient(circle, ${tier.color}25 0%, transparent 60%)`,
            pointerEvents: "none", opacity: 0,
            transition: "opacity 0.35s ease",
            borderRadius: "50%",
            mixBlendMode: "multiply",
          }}
        />

        {/* Floating background orbs */}
        <div style={{
          position: "absolute", top: -50, right: -50, width: 170, height: 170, borderRadius: "50%",
          background: `radial-gradient(circle, ${tier.color}1a 0%, transparent 70%)`,
          filter: "blur(10px)", pointerEvents: "none",
          animation: `yttOrb 8s ease-in-out ${tier.featured ? 0 : 1}s infinite alternate`,
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -50, width: 150, height: 150, borderRadius: "50%",
          background: `radial-gradient(circle, ${tier.color}14 0%, transparent 70%)`,
          filter: "blur(12px)", pointerEvents: "none",
          animation: `yttOrb 10s ease-in-out ${tier.featured ? 1.5 : 0.5}s infinite alternate-reverse`,
        }} />

        {/* "Most popular" floating badge */}
        {tier.badge && (
          <div className="ytt-badge" style={{
            position: "absolute", top: -38, left: "50%",
            transform: "translateX(-50%) rotate(-2deg)",
            padding: "8px 18px",
            background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
            color: "#fff",
            fontSize: "0.95rem",
            letterSpacing: "0.22em",
            fontWeight: 600,
            textTransform: "uppercase",
            borderRadius: 99,
            boxShadow: `0 10px 24px ${tier.color}60, inset 0 1px 0 rgba(255,255,255,0.4)`,
            zIndex: 3,
            animation: "yttBadgeSway 4s ease-in-out infinite",
          }}>
            <span style={{
              display: "inline-block",
              width: 5, height: 5, borderRadius: "50%",
              background: "#fff", marginRight: 8,
              verticalAlign: "middle", boxShadow: "0 0 6px #fff",
            }} />
            {tier.badge}
          </div>
        )}

        {/* Icon + category */}
        <div className="relative flex items-start justify-between mb-5">
          <div className="ytt-icon" style={{
            width: 62, height: 62, borderRadius: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem",
            background: `linear-gradient(135deg, ${tier.color}30, ${tier.color}08)`,
            border: `1.5px solid ${tier.color}55`,
            boxShadow:
              `0 8px 22px ${tier.color}33, ` +
              `inset 0 1px 0 rgba(255,255,255,0.7), ` +
              `inset 0 -1px 0 ${tier.color}22`,
          }}>
            <span style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.18))" }}>{tier.icon}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-1"
              style={{ color: tier.color, opacity: 0.7 }}>
              {tier.category}
            </p>
            <div style={{
              width: 32, height: 1, marginLeft: "auto",
              background: `linear-gradient(90deg, transparent, ${tier.color})`,
            }} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-[1.7rem] font-light leading-tight mb-5 relative"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
          {tier.title}
        </h3>

        {/* Price block with parallax */}
        <div ref={priceRef} className="mb-7 relative" style={{ transition: "transform 0.25s ease" }}>
          <div className="text-[2.4rem] font-light leading-none mb-2"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              background: `linear-gradient(135deg, ${tier.color}, ${tier.color}aa)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: `0 2px 12px ${tier.color}30`,
            }}>
            {tier.price}
          </div>
          <p className="text-[0.82rem] leading-snug" style={{ color: "#5C3D2E" }}>
            {tier.priceSub}
          </p>
          <p className="text-[0.72rem] mt-1" style={{ color: "#9A7860" }}>
            {tier.priceNote}
          </p>
        </div>

        {/* Feature list with animated check */}
        <ul className="space-y-2.5 mb-8 relative">
          {tier.features.map((f, i) => (
            <li key={f} className="ytt-feat flex items-start gap-3 text-sm"
              style={{
                color: "#3D2515",
                animation: `yttFeatIn 0.5s ease ${i * 0.06}s both`,
              }}>
              <span style={{
                marginTop: 3,
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${tier.color}25, ${tier.color}10)`,
                border: `1px solid ${tier.color}55`,
                fontSize: 11, color: tier.color, fontWeight: 700,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5)`,
              }}>✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={tier.ctaHref}
          target={tier.ctaHref.startsWith("http") ? "_blank" : undefined}
          rel={tier.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
          className="ytt-cta block text-center w-full py-3.5 rounded-full font-medium text-sm relative overflow-hidden"
          style={{
            background:
              tier.id === "virtual"
                ? "transparent"
                : `linear-gradient(135deg, ${tier.color}, ${tier.color}d0)`,
            color: tier.id === "virtual" ? tier.color : "#fff",
            border: tier.id === "virtual" ? `1.5px solid ${tier.color}` : "none",
            boxShadow: tier.id === "virtual" ? "none" : `0 10px 28px ${tier.color}55`,
            transition: "transform 0.22s ease, box-shadow 0.22s ease",
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ position: "relative", zIndex: 2 }}>
            {tier.ctaLabel} {tier.ctaHref.startsWith("http") ? "→" : ""}
          </span>
          <span style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: "translateX(-100%)",
            animation: "yttCtaShine 3.5s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        </a>
      </div>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────
export default function PricingSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FAF3FF 40%, #FFF7E8 100%)" }}>

      <style>{`
        @keyframes yttOrb {
          from { transform: translate(0, 0)   scale(1); }
          to   { transform: translate(12px, -10px) scale(1.06); }
        }
        @keyframes yttRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes yttBadgeSway {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); }
          50%      { transform: translateX(-50%) rotate(2deg); }
        }
        @keyframes yttCtaShine {
          0%, 30% { transform: translateX(-100%); }
          70%     { transform: translateX(100%); }
          100%    { transform: translateX(100%); }
        }
        @keyframes yttFeatIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes yttPetalDrift {
          0%   { transform: translateY(0)   rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 0.6; }
          50%  { transform: translateY(-30vh) rotate(180deg) translateX(20px); }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-60vh) rotate(360deg) translateX(-15px); opacity: 0; }
        }
        @keyframes yttBgPulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        .ytt-card:hover .ytt-icon {
          transform: translateY(-3px) scale(1.06) rotate(-4deg);
        }
        .ytt-icon { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ytt-card:hover .ytt-cta {
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── Decorative background layers ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "8%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,148,29,0.10) 0%, transparent 70%)",
          filter: "blur(40px)", animation: "yttOrb 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "6%", width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,45,139,0.10) 0%, transparent 70%)",
          filter: "blur(45px)", animation: "yttOrb 17s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "20%", width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(141,198,63,0.08) 0%, transparent 70%)",
          filter: "blur(35px)", animation: "yttOrb 11s ease-in-out 2s infinite",
        }} />

        {/* Stacked lotus mandala — large, very faint */}
        <svg width="640" height="640" viewBox="0 0 640 640" fill="none"
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", opacity: 0.05,
            animation: "yttBgPulse 8s ease-in-out infinite",
          }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 22.5) * Math.PI / 180;
            return (
              <ellipse key={i}
                cx={320 + Math.cos(a) * 110}
                cy={320 + Math.sin(a) * 110}
                rx="160" ry="60"
                stroke="#6B2D8B" strokeWidth="0.8"
                transform={`rotate(${i * 22.5} 320 320)`} />
            );
          })}
          <circle cx="320" cy="320" r="40"  stroke="#F7941D" strokeWidth="1.5" />
          <circle cx="320" cy="320" r="12"  fill="#F7941D" opacity="0.6" />
        </svg>

        {/* Drifting petal particles */}
        {[
          { left: "8%",  delay: 0,   dur: 18, color: "#F7941D" },
          { left: "22%", delay: 3.5, dur: 22, color: "#6B2D8B" },
          { left: "38%", delay: 7,   dur: 19, color: "#8DC63F" },
          { left: "55%", delay: 1.5, dur: 24, color: "#F7941D" },
          { left: "72%", delay: 5,   dur: 20, color: "#6B2D8B" },
          { left: "88%", delay: 8.5, dur: 23, color: "#8DC63F" },
        ].map((p, i) => (
          <span key={i} style={{
            position: "absolute", left: p.left, bottom: 0,
            width: 8, height: 14, borderRadius: "50% 50% 50% 0",
            background: p.color, opacity: 0,
            animation: `yttPetalDrift ${p.dur}s ease-in-out ${p.delay}s infinite`,
            filter: "blur(0.5px)",
          }} />
        ))}
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "6px 16px", borderRadius: 99,
            background: "rgba(247,148,29,0.10)",
            border: "1px solid rgba(247,148,29,0.28)",
            marginBottom: 18,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#F7941D",
              boxShadow: "0 0 10px #F7941D", animation: "yttBgPulse 2.4s ease-in-out infinite",
            }} />
            <span className="text-[11px] tracking-[0.28em] uppercase font-semibold"
              style={{ color: "#B86010" }}>Choose Your Format</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Program options &amp; <em style={{ color: "#6B2D8B" }}>pricing</em>
          </h2>
          <p className="text-sm font-light max-w-xl mx-auto" style={{ color: "#6B5240" }}>
            Three formats, one certification. Pick the rhythm that fits your life — commute, immerse, or train remotely.
          </p>
        </div>

        {/* ── 3-card grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-6 pt-8" style={{ perspective: "1500px" }}>
          {TIERS.map((tier) => <PricingCard key={tier.id} tier={tier} />)}
        </div>
      </div>
    </section>
  );
}
