"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import FloatingLotus from "@/components/FloatingLotusClient";

type Service = {
  id:         string;
  title:      string;
  subtitle:   string;
  body:       string;
  icon:       string;
  color:      string;
  group:      string;
  bookHref?:  string;
  bookLabel?: string;
};

const SERVICES: Service[] = [
  // ── Yoga programs ──────────────────────────────────────────
  {
    id: "drop-in", group: "Yoga Programs", color: "#F7941D",
    title: "Drop-In Yoga Sessions",
    subtitle: "6 styles · 6 days a week",
    body: "Regular drop-in classes designed methodically across six styles — Hatha, Vinyasa, Power, Sanatan, Meditation, and breathwork. Sunday through Friday, with six experienced certified teachers.",
    icon: "🧘",
    bookHref: "https://forms.gle/pq7Ux5bxqqtLoudk9", bookLabel: "Register",
  },
  {
    id: "virtual", group: "Yoga Programs", color: "#6B2D8B",
    title: "Virtual Live Yoga",
    subtitle: "घरबाट घरमै योग — Home to home",
    body: "Live online sessions streamed daily with quality audio and video. Practice from home, hotel, or office with our certified teachers. Available privately or in groups.",
    icon: "💻",
    bookHref: "https://forms.gle/pq7Ux5bxqqtLoudk9", bookLabel: "Register",
  },
  {
    id: "home", group: "Yoga Programs", color: "#8DC63F",
    title: "Yoga at Home",
    subtitle: "We come to you",
    body: "Tailored yoga sessions in your own home — perfect when a hectic schedule keeps you from the studio, or when you prefer practicing with family rather than in a group setting.",
    icon: "🏡",
  },
  {
    id: "private", group: "Yoga Programs", color: "#F7941D",
    title: "Private Yoga Classes",
    subtitle: "1-on-1 or max 4 students",
    body: "Personal sessions for safe, effective practice with focused attention. Beginner, intermediate, or advanced — designed around your body and your goals.",
    icon: "🌿",
    bookHref: "https://forms.gle/cvsLKqf3fn2HQmvJ9", bookLabel: "Book",
  },

  // ── Special programs ──────────────────────────────────────
  {
    id: "retreat", group: "Special Programs", color: "#6B2D8B",
    title: "Yoga Retreat",
    subtitle: "Outside Kathmandu Valley",
    body: "Connect with nature beyond the city — hiking, meditation, sauna bath, Hawan (fire ceremony), Surya Namaskar, pranayama, and full board meals. Programs customised to your group.",
    icon: "⛰",
  },
  {
    id: "bootcamp", group: "Special Programs", color: "#F7941D",
    title: "Weight Loss Bootcamp",
    subtitle: "49-day transformation program",
    body: "Healthy, scientific weight loss with a certified instructor — fun workouts, registered-dietitian diet planning, sauna, massage, body analysis, and internal detoxification.",
    icon: "🔥",
    bookHref: "https://forms.gle/iCVUTUcr8kg8gokW7", bookLabel: "Register",
  },
  {
    id: "corporate", group: "Special Programs", color: "#8DC63F",
    title: "Corporate Yoga",
    subtitle: "For your team & office",
    body: "Office-friendly yoga, breath, and meditation that fits into the workday. Reduces stress-related sick days and improves focus, decision-making, and team energy.",
    icon: "💼",
  },

  // ── Therapy & wellness ────────────────────────────────────
  {
    id: "therapy", group: "Therapy & Wellness", color: "#6B2D8B",
    title: "Yoga Therapy",
    subtitle: "Lifestyle disease support",
    body: "Therapeutic yoga for back pain, joint pain, diabetes, uric acid, gastritis, high/low BP, arthritis, mood disorders, depression, stress, and anxiety. Tailored after a full medical assessment.",
    icon: "🌺",
  },
  {
    id: "sound", group: "Therapy & Wellness", color: "#F7941D",
    title: "Sound Healing Therapy",
    subtitle: "Tibetan singing bowl sessions",
    body: "Authentic Tibetan singing bowl therapy. Individual (NPR 2,000 / USD 20), 3-session pack (NPR 5,500 / USD 55), or group sound bath (NPR 1,000 / USD 10 pp). 90 minutes per session.",
    icon: "🎵",
    bookHref: "/sound-healing-therapy", bookLabel: "Learn more",
  },
  {
    id: "diet", group: "Therapy & Wellness", color: "#8DC63F",
    title: "Diet Consultation",
    subtitle: "Sister clinic — Zumbandu",
    body: "Disease-specific diet planning, weight management, Ketogenic diet, pregnancy diet counselling, and Ayurvedic diet from our sister diet therapy clinic.",
    icon: "🥗",
  },
  {
    id: "reiki", group: "Therapy & Wellness", color: "#6B2D8B",
    title: "Reiki Healing",
    subtitle: "Energy work",
    body: "Gentle hands-on energy healing — pairs beautifully with our sound and yoga therapy work for those drawn to subtle-body practices.",
    icon: "✨",
  },

  // ── For specific groups ───────────────────────────────────
  {
    id: "prenatal", group: "For Specific Groups", color: "#F7941D",
    title: "Prenatal & Postnatal Yoga",
    subtitle: "Before & after birth",
    body: "Safe, gentle practice for expecting and new mothers — supporting body, breath, and emotional balance through every stage of pregnancy and recovery.",
    icon: "🌸",
  },
  {
    id: "children", group: "For Specific Groups", color: "#8DC63F",
    title: "Children's Yoga",
    subtitle: "Playful & age-appropriate",
    body: "Yoga that feels like play — building focus, coordination, and emotional regulation in children through games, postures, and storytelling.",
    icon: "🌱",
  },
  {
    id: "seniors", group: "For Specific Groups", color: "#6B2D8B",
    title: "Yoga for Senior Citizens",
    subtitle: "Gentle, chair-supported options",
    body: "Slow, safe yoga and breath practice for older bodies — supporting mobility, circulation, balance, and mental clarity in later life.",
    icon: "🍃",
  },
  {
    id: "school", group: "For Specific Groups", color: "#F7941D",
    title: "School Yoga Programs",
    subtitle: "Yoga in education",
    body: "On-site yoga programs for schools — Dr. Chintamani has directly taught yoga in Nepal's leading academic schools. Builds focus, self-regulation, and well-being in students.",
    icon: "🎒",
  },

  // ── Workshops & extras ────────────────────────────────────
  {
    id: "flexibility", group: "Workshops & Extras", color: "#8DC63F",
    title: "Flexibility Workshop",
    subtitle: "Open joints, calm mind",
    body: "Focused half-day or full-day workshop building mobility and joint freedom — for stiff bodies and athletes alike.",
    icon: "🌀",
  },
  {
    id: "trekking", group: "Workshops & Extras", color: "#6B2D8B",
    title: "Yoga Trekking",
    subtitle: "Yoga + Himalayan trails",
    body: "Combine multi-day trekking in Nepal's foothills with morning and evening yoga, meditation, and pranayama. For those who want their practice to move with them.",
    icon: "🏔",
  },
  {
    id: "hotel", group: "Workshops & Extras", color: "#F7941D",
    title: "Yoga at Hotel",
    subtitle: "For travellers & retreats",
    body: "Bring certified yoga teachers to your hotel or resort — perfect for retreat groups, wellness tours, or visitors staying in Kathmandu who want quality practice on site.",
    icon: "🏨",
  },
  {
    id: "chair", group: "Workshops & Extras", color: "#8DC63F",
    title: "Chair Yoga",
    subtitle: "For limited mobility",
    body: "Full yoga practice supported by a chair — for those recovering from injury, working long desk hours, or wanting an accessible entry into the practice.",
    icon: "💺",
  },
  {
    id: "acupressure", group: "Workshops & Extras", color: "#6B2D8B",
    title: "Acupressure Yoga",
    subtitle: "Marma + yoga",
    body: "A blend of traditional acupressure / marma points with yoga and breathwork — targeted relief for tension, fatigue, and chronic discomfort.",
    icon: "👐",
  },
];

const GROUPS = ["All", "Yoga Programs", "Special Programs", "Therapy & Wellness", "For Specific Groups", "Workshops & Extras"] as const;

// ── 3-D tilt card with shine sweep + idle float ───────────────────────
function ServiceCard({ s, idx }: { s: Service; idx: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 15}deg) rotateX(${-y * 11}deg) translateY(-8px) scale(1.025)`;
    el.style.boxShadow = `${-x * 28}px ${y * 28}px 52px rgba(42,18,8,0.20), 0 0 0 1.5px ${s.color}88, 0 0 30px ${s.color}33`;
    if (shineRef.current) {
      shineRef.current.style.opacity = "1";
      shineRef.current.style.transform = `translate(${(e.clientX - r.left)}px, ${(e.clientY - r.top)}px)`;
    }
  }, [s.color]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)";
    el.style.boxShadow = "0 6px 22px rgba(42,18,8,0.06)";
    if (shineRef.current)   shineRef.current.style.opacity   = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="svc-card relative rounded-2xl p-6 flex flex-col h-full overflow-hidden"
      style={{
        background:   "#FFFFFF",
        border:       `1.5px solid ${s.color}1F`,
        borderTop:    `3px solid ${s.color}`,
        boxShadow:    "0 6px 22px rgba(42,18,8,0.06)",
        transition:   "transform 0.22s ease, box-shadow 0.22s ease",
        willChange:   "transform",
        animation:    `svcIdle 7s ease-in-out ${(idx % 5) * 0.6}s infinite alternate`,
      }}
    >
      {/* top shimmer line — sweeps on hover */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 4,
          background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
          opacity: 0, transition: "opacity 0.3s ease",
          animation: "svcShimmer 2.4s ease-in-out infinite",
          backgroundSize: "200% 100%",
          pointerEvents: "none",
        }}
      />
      {/* shine sweep — follows cursor */}
      <div
        ref={shineRef}
        style={{
          position: "absolute", top: 0, left: 0, width: 320, height: 320,
          marginLeft: -160, marginTop: -160,
          background: `radial-gradient(circle, ${s.color}28 0%, transparent 60%)`,
          pointerEvents: "none", opacity: 0, transition: "opacity 0.3s ease",
          mixBlendMode: "multiply",
        }}
      />
      {/* corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 130, height: 130,
        background: `radial-gradient(circle at 100% 0%, ${s.color}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* bottom orb */}
      <div style={{
        position: "absolute", bottom: -28, left: -28, width: 90, height: 90, borderRadius: "50%",
        background: `radial-gradient(circle, ${s.color}14 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="flex items-start justify-between mb-4 relative">
        <div className="svc-icon" style={{
          width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "1.55rem", position: "relative",
          background: `linear-gradient(135deg, ${s.color}22, ${s.color}08)`,
          border: `1px solid ${s.color}40`,
          boxShadow: `0 4px 14px ${s.color}22, inset 0 1px 0 rgba(255,255,255,0.6)`,
        }}>
          <span style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))" }}>{s.icon}</span>
        </div>
        <span className="text-[10px] font-medium tracking-[0.18em] uppercase"
          style={{ color: s.color, background: `${s.color}14`, padding: "4px 10px",
            borderRadius: 99, border: `1px solid ${s.color}22` }}>
          {s.group}
        </span>
      </div>
      <h3 className="text-xl font-light mb-1 leading-tight relative"
        style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
        {s.title}
      </h3>
      <p className="text-xs font-medium mb-3 tracking-wide relative" style={{ color: s.color }}>
        {s.subtitle}
      </p>
      <p className="text-sm font-light leading-relaxed flex-1 mb-5 relative" style={{ color: "#4A2E1A" }}>
        {s.body}
      </p>
      <div className="flex flex-wrap gap-2 relative">
        <Link href={`/book?service=${s.id}`}
          className="cta-lift svc-cta text-center px-4 py-2 rounded-full text-xs font-medium text-white"
          style={{ background: s.color, boxShadow: `0 6px 18px ${s.color}55` }}>
          {s.bookLabel || "Book"}
        </Link>
        <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
          className="cta-lift text-center px-4 py-2 rounded-full text-xs font-medium"
          style={{ border: `1.5px solid ${s.color}`, color: s.color }}>
          WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── Unique decorative SVG per group ───────────────────────────────────
function SunMandala({ accent }: { accent: string }) {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none",
        animation: "svcDecoSpin 80s linear infinite", opacity: 0.12 }}>
      <circle cx="130" cy="130" r="44" stroke={accent} strokeWidth="1.2" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15) * Math.PI / 180;
        const x1 = 130 + Math.cos(a) * 56;
        const y1 = 130 + Math.sin(a) * 56;
        const x2 = 130 + Math.cos(a) * (i % 2 === 0 ? 110 : 86);
        const y2 = 130 + Math.sin(a) * (i % 2 === 0 ? 110 : 86);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1.3" strokeLinecap="round" />;
      })}
      <circle cx="130" cy="130" r="120" stroke={accent} strokeWidth="0.8" strokeDasharray="2 6" />
    </svg>
  );
}

function DharmaWheel({ accent }: { accent: string }) {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none",
        animation: "svcDecoSpinRev 70s linear infinite", opacity: 0.13 }}>
      <circle cx="130" cy="130" r="118" stroke={accent} strokeWidth="1" />
      <circle cx="130" cy="130" r="38"  stroke={accent} strokeWidth="1.4" />
      <circle cx="130" cy="130" r="14"  fill={`${accent}50`} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45) * Math.PI / 180;
        return <line key={i}
          x1={130 + Math.cos(a) * 14} y1={130 + Math.sin(a) * 14}
          x2={130 + Math.cos(a) * 118} y2={130 + Math.sin(a) * 118}
          stroke={accent} strokeWidth="1.4" strokeLinecap="round" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 + 22.5) * Math.PI / 180;
        return <circle key={i} r="3.5"
          cx={130 + Math.cos(a) * 95} cy={130 + Math.sin(a) * 95}
          fill={accent} />;
      })}
    </svg>
  );
}

function FlowingWaves({ accent }: { accent: string }) {
  return (
    <svg width="320" height="200" viewBox="0 0 320 200" fill="none"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: 0.13 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i}
          d={`M0,${60 + i * 22} Q40,${40 + i * 22} 80,${60 + i * 22} T160,${60 + i * 22} T240,${60 + i * 22} T320,${60 + i * 22}`}
          stroke={accent} strokeWidth="1" fill="none"
          style={{ animation: `svcWaveSlide ${8 + i * 0.6}s ease-in-out ${i * 0.3}s infinite alternate` }} />
      ))}
      <circle cx="60" cy="100" r="3" fill={accent} opacity="0.6"
        style={{ animation: "svcDotBob 4s ease-in-out infinite" }} />
      <circle cx="180" cy="120" r="3" fill={accent} opacity="0.6"
        style={{ animation: "svcDotBob 5s ease-in-out 0.7s infinite" }} />
      <circle cx="260" cy="90" r="3" fill={accent} opacity="0.6"
        style={{ animation: "svcDotBob 6s ease-in-out 1.4s infinite" }} />
    </svg>
  );
}

function SeedGrowth({ accent }: { accent: string }) {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: 0.13 }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60) * Math.PI / 180;
        const cx = 130 + Math.cos(a) * 50;
        const cy = 130 + Math.sin(a) * 50;
        return <circle key={i} cx={cx} cy={cy} r="50" stroke={accent} strokeWidth="1"
          style={{ animation: `svcSeedPulse 4s ease-in-out ${i * 0.3}s infinite alternate` }} />;
      })}
      <circle cx="130" cy="130" r="50" stroke={accent} strokeWidth="1.4" />
      <circle cx="130" cy="130" r="6"  fill={accent} />
    </svg>
  );
}

function GeometricStars({ accent }: { accent: string }) {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none"
      style={{ position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", pointerEvents: "none",
        animation: "svcDecoSpin 100s linear infinite", opacity: 0.13 }}>
      <polygon points="130,30 220,170 40,170" stroke={accent} strokeWidth="1" fill="none" />
      <polygon points="130,230 220,90 40,90"  stroke={accent} strokeWidth="1" fill="none" />
      <circle cx="130" cy="130" r="100" stroke={accent} strokeWidth="0.8" strokeDasharray="3 6" />
      <circle cx="130" cy="130" r="60"  stroke={accent} strokeWidth="0.8" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return <circle key={i} r="2.5"
          cx={130 + Math.cos(a) * 100} cy={130 + Math.sin(a) * 100}
          fill={accent} />;
      })}
    </svg>
  );
}

const HEADER_DECO: Record<string, (props: { accent: string }) => React.ReactElement> = {
  "Yoga Programs":       SunMandala,
  "Special Programs":    DharmaWheel,
  "Therapy & Wellness":  FlowingWaves,
  "For Specific Groups": SeedGrowth,
  "Workshops & Extras":  GeometricStars,
};

const GROUP_ICONS: Record<string, string> = {
  "Yoga Programs":       "🧘",
  "Special Programs":    "☸",
  "Therapy & Wellness":  "🌿",
  "For Specific Groups": "🌱",
  "Workshops & Extras":  "✦",
};

// ── Decorative section header with mandala ────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, accent }: {
  eyebrow: string; title: string; subtitle: string; accent: string;
}) {
  const Deco = HEADER_DECO[eyebrow] || SunMandala;
  const icon = GROUP_ICONS[eyebrow] || "✨";
  return (
    <div className="text-center mb-12 relative" style={{ paddingTop: 90, paddingBottom: 30, minHeight: 270 }}>
      {/* Animated radial glow backdrop */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380, height: 380, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}1F 0%, transparent 65%)`,
        filter: "blur(20px)", pointerEvents: "none",
        animation: "svcHeaderPulse 6s ease-in-out infinite",
      }} />
      {/* Unique deco */}
      <Deco accent={accent} />
      {/* Floating accent dots */}
      {[
        { left: "20%",  top: "15%", size: 5, delay: 0   },
        { left: "78%",  top: "22%", size: 4, delay: 1.2 },
        { left: "12%",  top: "70%", size: 3, delay: 0.6 },
        { left: "84%",  top: "65%", size: 5, delay: 1.8 },
        { left: "50%",  top: "8%",  size: 3, delay: 0.9 },
      ].map((d, i) => (
        <span key={i} style={{
          position: "absolute", left: d.left, top: d.top,
          width: d.size, height: d.size, borderRadius: "50%",
          background: accent, opacity: 0.5,
          animation: `svcDotFloat 5s ease-in-out ${d.delay}s infinite alternate`,
          pointerEvents: "none",
        }} />
      ))}

      <div className="relative">
        {/* 3D-feel icon badge */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          margin: "0 auto 18px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.7rem",
          background: `linear-gradient(135deg, ${accent}33, ${accent}0A)`,
          border: `1.5px solid ${accent}55`,
          boxShadow: `0 8px 24px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.7)`,
          animation: "svcHeaderIcon 5s ease-in-out infinite alternate",
        }}>
          <span style={{ filter: "drop-shadow(0 1.5px 1px rgba(0,0,0,0.22))" }}>{icon}</span>
        </div>
        <div style={{
          width: 50, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          margin: "0 auto 14px",
        }} />
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accent }}>{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-light mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
          {title}
        </h2>
        <p className="text-sm font-light max-w-xl mx-auto" style={{ color: "#6B5240" }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const PARTICLES = [
  { left: 6,  delay: 0.3, dur: 5.2, size: 3 }, { left: 18, delay: 1.4, dur: 6.1, size: 2 },
  { left: 29, delay: 0.7, dur: 4.8, size: 4 }, { left: 41, delay: 2.0, dur: 5.9, size: 2 },
  { left: 52, delay: 0.5, dur: 6.6, size: 3 }, { left: 63, delay: 1.9, dur: 5.3, size: 2 },
  { left: 74, delay: 0.8, dur: 4.7, size: 4 }, { left: 86, delay: 2.3, dur: 6.0, size: 3 },
];

const GROUP_ACCENT: Record<string, string> = {
  "Yoga Programs":        "#F7941D",
  "Special Programs":     "#6B2D8B",
  "Therapy & Wellness":   "#8DC63F",
  "For Specific Groups":  "#F7941D",
  "Workshops & Extras":   "#6B2D8B",
};

const GROUP_SUB: Record<string, string> = {
  "Yoga Programs":        "Core practice — daily classes, online sessions, private and at-home instruction.",
  "Special Programs":     "Retreats, bootcamps and corporate programs — focused work over a defined period.",
  "Therapy & Wellness":   "Healing-focused offerings: sound, energy, nutrition, and therapeutic yoga.",
  "For Specific Groups":  "Tailored programs for children, seniors, expecting mothers, and students.",
  "Workshops & Extras":   "Add-ons and specialised workshops — short-format, deep-dive practice.",
};

export default function ServicesGrid() {
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const filtered = activeGroup === "All" ? SERVICES : SERVICES.filter((s) => s.group === activeGroup);

  // Group cards when "All" so each category has its own decorative header.
  const grouped = (GROUPS.filter((g) => g !== "All") as readonly string[]).map((g) => ({
    group: g,
    items: SERVICES.filter((s) => s.group === g),
  }));

  return (
    <>
      <style>{`
        @keyframes floatUpServ {
          0%   { transform: translateY(100vh) scale(0);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        @keyframes svcIdle {
          from { transform: translateY(0); }
          to   { transform: translateY(-4px); }
        }
        @keyframes svcOrbDrift {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(10px, -8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes svcMandalaSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes svcDecoSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes svcDecoSpinRev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes svcHeaderPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 0.7; }
        }
        @keyframes svcHeaderIcon {
          from { transform: translateY(0)   rotate(-2deg); }
          to   { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes svcDotFloat {
          from { transform: translateY(0)   scale(1); }
          to   { transform: translateY(-12px) scale(1.4); }
        }
        @keyframes svcWaveSlide {
          from { transform: translateX(-20px); }
          to   { transform: translateX(20px);  }
        }
        @keyframes svcDotBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes svcSeedPulse {
          from { opacity: 0.6; }
          to   { opacity: 1;   }
        }
        @keyframes svcShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes ctaGemFloat {
          0%   { transform: translateY(0)    rotate(0deg)   scale(1); }
          33%  { transform: translateY(-18px) rotate(6deg)  scale(1.06); }
          66%  { transform: translateY(-8px)  rotate(-4deg) scale(0.97); }
          100% { transform: translateY(0)    rotate(0deg)   scale(1); }
        }
        .svc-card .svc-icon { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .svc-card:hover .svc-icon {
          transform: translateY(-2px) scale(1.08) rotate(-3deg);
        }
        .svc-card .svc-cta { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .svc-card:hover .svc-cta { transform: translateY(-1px); }
        .svc-filter {
          transition: all 0.22s ease;
          position: relative;
        }
        .svc-filter:hover:not(.is-active) {
          transform: translateY(-2px);
          border-color: #6B2D8B !important;
          color: #6B2D8B !important;
          box-shadow: 0 6px 16px rgba(107,45,139,0.18);
        }
        .svc-filter.is-active {
          box-shadow: 0 8px 22px rgba(107,45,139,0.35);
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 45%, #3a1458 75%, #1a0a2e 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "10%", right: "8%", width: 460, height: 460, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,45,139,0.50) 0%, transparent 70%)", filter: "blur(55px)",
            animation: "svcOrbDrift 14s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "6%", left: "4%", width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,148,29,0.22) 0%, transparent 70%)", filter: "blur(50px)",
            animation: "svcOrbDrift 18s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", top: "38%", left: "28%", width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(141,198,63,0.16) 0%, transparent 70%)", filter: "blur(40px)",
            animation: "svcOrbDrift 11s ease-in-out infinite" }} />
        </div>

        {/* Rotating mandala behind text */}
        <svg style={{
          position: "absolute", top: "50%", left: "50%", opacity: 0.08, pointerEvents: "none",
          animation: "svcMandalaSpin 120s linear infinite",
        }} width="600" height="600" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="290" stroke="#F7941D" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" stroke="#F7941D" strokeWidth="1" />
          <circle cx="300" cy="300" r="150" stroke="#F7941D" strokeWidth="1" />
          <circle cx="300" cy="300" r="80"  stroke="#F7941D" strokeWidth="1" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="300" y1="10" x2="300" y2="590" stroke="#F7941D" strokeWidth="0.4"
              transform={`rotate(${i * 15} 300 300)`} />
          ))}
        </svg>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute", left: `${p.left}%`, bottom: 0,
              width: p.size, height: p.size, borderRadius: "50%",
              background: i % 3 === 0 ? "#F7941D" : i % 3 === 1 ? "#8DC63F" : "#9B6BDF",
              opacity: 0, animation: `floatUpServ ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
              Everything we offer
            </p>
            <h1 className="text-5xl md:text-6xl font-light leading-[1.05] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#fff" }}>
              One studio.<br />
              <em style={{ color: "#F7941D" }}>Many doorways.</em>
            </h1>
            <p className="text-lg font-light mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.78)" }}>
              From a single drop-in class to a 49-day bootcamp, retreat in the hills, or corporate program for your team — explore the full range of Yogmandu services.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { num: "20+",   label: "Programs" },
                { num: "5",     label: "Categories" },
                { num: "3,000+", label: "Teachers trained" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#F7941D" }}>
                    {s.num}
                  </div>
                  <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Lotus centerpiece */}
          <div className="flex justify-center items-center">
            <div style={{ width: "100%", maxWidth: 380, height: 340, position: "relative" }}>
              <div style={{
                position: "absolute", inset: "10%", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(247,148,29,0.18) 0%, transparent 65%)",
                filter: "blur(20px)", animation: "svcOrbDrift 8s ease-in-out infinite",
              }} />
              <FloatingLotus />
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + grid ────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: "#FAF6F0" }}>
        {/* ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,45,139,0.06) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: -100, left: -100, width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,148,29,0.05) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {GROUPS.map((g) => {
              const isActive = activeGroup === g;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`svc-filter px-5 py-2.5 rounded-full text-xs font-medium ${isActive ? "is-active" : ""}`}
                  style={{
                    border: `1.5px solid ${isActive ? "transparent" : "rgba(42,18,8,0.15)"}`,
                    background: isActive ? "linear-gradient(135deg, #6B2D8B, #F7941D)" : "rgba(255,255,255,0.7)",
                    color: isActive ? "#fff" : "#7A5840",
                    letterSpacing: "0.08em",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {activeGroup === "All" ? (
            <div className="space-y-20">
              {grouped.map(({ group, items }) => (
                <div key={group}>
                  <SectionHeader
                    eyebrow={group}
                    title={`${group}`}
                    subtitle={GROUP_SUB[group]}
                    accent={GROUP_ACCENT[group]}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((s, i) => <ServiceCard key={s.id} s={s} idx={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <SectionHeader
                eyebrow={activeGroup}
                title={activeGroup}
                subtitle={GROUP_SUB[activeGroup]}
                accent={GROUP_ACCENT[activeGroup]}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((s, i) => <ServiceCard key={s.id} s={s} idx={i} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 50%, #1a0a2e 100%)" }}>

        {/* ── Layer 1: deep volumetric orbs ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position:"absolute", top:"5%",  left:"-5%",  width:480, height:480, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(107,45,139,0.55) 0%, transparent 65%)", filter:"blur(60px)",
            animation:"svcOrbDrift 18s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:"0%", right:"-6%", width:440, height:440, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(247,148,29,0.22) 0%, transparent 65%)", filter:"blur(55px)",
            animation:"svcOrbDrift 22s ease-in-out infinite reverse" }} />
          <div style={{ position:"absolute", top:"35%",  left:"38%",  width:300, height:300, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(141,198,63,0.18) 0%, transparent 65%)", filter:"blur(50px)",
            animation:"svcOrbDrift 14s ease-in-out 2s infinite" }} />
          <div style={{ position:"absolute", top:"60%", left:"15%",  width:220, height:220, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(247,148,29,0.14) 0%, transparent 70%)", filter:"blur(40px)",
            animation:"svcOrbDrift 16s ease-in-out 1s infinite reverse" }} />
          <div style={{ position:"absolute", top:"10%", right:"18%", width:180, height:180, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(141,198,63,0.12) 0%, transparent 70%)", filter:"blur(35px)",
            animation:"svcOrbDrift 11s ease-in-out 3s infinite" }} />
        </div>

        {/* ── Layer 2: dual-spin mandala ── */}
        <svg style={{ position:"absolute", top:"50%", left:"50%", opacity:0.11, pointerEvents:"none",
          animation:"svcMandalaSpin 70s linear infinite" }}
          width="620" height="620" viewBox="0 0 620 620" fill="none">
          {/* outer petal ring */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 22.5) * Math.PI / 180;
            return <ellipse key={i} cx={310 + Math.cos(a)*120} cy={310 + Math.sin(a)*120}
              rx="150" ry="52" stroke="#8DC63F" strokeWidth="0.8"
              transform={`rotate(${i*22.5} 310 310)`} />;
          })}
          <circle cx="310" cy="310" r="300" stroke="#8DC63F" strokeWidth="0.6" strokeDasharray="4 8" />
          <circle cx="310" cy="310" r="240" stroke="#F7941D" strokeWidth="0.5" />
          <circle cx="310" cy="310" r="165" stroke="#8DC63F" strokeWidth="0.8" />
          <circle cx="310" cy="310" r="90"  stroke="#F7941D" strokeWidth="1" />
          <circle cx="310" cy="310" r="36"  stroke="#8DC63F" strokeWidth="1.2" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="310" y1="10" x2="310" y2="610" stroke="#8DC63F" strokeWidth="0.3"
              transform={`rotate(${i*15} 310 310)`} />
          ))}
        </svg>
        {/* counter-rotating inner ring */}
        <svg style={{ position:"absolute", top:"50%", left:"50%", opacity:0.08, pointerEvents:"none",
          animation:"svcDecoSpinRev 50s linear infinite" }}
          width="380" height="380" viewBox="0 0 380 380" fill="none">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i*45) * Math.PI / 180;
            return <ellipse key={i} cx={190 + Math.cos(a)*60} cy={190 + Math.sin(a)*60}
              rx="90" ry="30" stroke="#F7941D" strokeWidth="1"
              transform={`rotate(${i*45} 190 190)`} />;
          })}
          <circle cx="190" cy="190" r="175" stroke="#F7941D" strokeWidth="0.6" strokeDasharray="3 6" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i*30) * Math.PI / 180;
            return <circle key={i} r="4" cx={190+Math.cos(a)*155} cy={190+Math.sin(a)*155} fill="#F7941D" opacity="0.7" />;
          })}
        </svg>

        {/* ── Layer 3: floating 3-D gem shapes ── */}
        {/* Top-left diamond */}
        <svg style={{ position:"absolute", top:"8%", left:"6%", width:80, height:80, opacity:0.22, pointerEvents:"none",
          animation:"ctaGemFloat 9s ease-in-out infinite", filter:"drop-shadow(0 0 8px rgba(141,198,63,0.6))" }}
          viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 72,28 72,52 40,76 8,52 8,28" stroke="#8DC63F" strokeWidth="1.5" fill="rgba(141,198,63,0.08)" />
          <polygon points="40,4 72,28 40,40 8,28" stroke="#8DC63F" strokeWidth="1" fill="rgba(141,198,63,0.05)" />
          <polygon points="40,40 72,28 72,52 40,76" stroke="#8DC63F" strokeWidth="0.8" fill="rgba(141,198,63,0.04)" />
          <line x1="8" y1="28" x2="72" y2="28" stroke="#8DC63F" strokeWidth="0.8" opacity="0.5" />
          <line x1="40" y1="4" x2="40" y2="40" stroke="#8DC63F" strokeWidth="0.8" opacity="0.4" />
        </svg>
        {/* Top-right crystal */}
        <svg style={{ position:"absolute", top:"12%", right:"7%", width:70, height:90, opacity:0.20, pointerEvents:"none",
          animation:"ctaGemFloat 12s ease-in-out 1.5s infinite", filter:"drop-shadow(0 0 8px rgba(247,148,29,0.5))" }}
          viewBox="0 0 70 90" fill="none">
          <polygon points="35,4 66,24 66,66 35,86 4,66 4,24" stroke="#F7941D" strokeWidth="1.5" fill="rgba(247,148,29,0.07)" />
          <polygon points="35,4 66,24 35,36 4,24" stroke="#F7941D" strokeWidth="1" fill="rgba(247,148,29,0.06)" />
          <line x1="4" y1="24" x2="66" y2="24" stroke="#F7941D" strokeWidth="0.8" opacity="0.5" />
          <line x1="35" y1="4" x2="35" y2="86" stroke="#F7941D" strokeWidth="0.6" opacity="0.35" />
          {[0,1,2,3,4,5].map(i => {
            const a = i*60*Math.PI/180; const r=10;
            return <circle key={i} cx={35+Math.cos(a)*r} cy={45+Math.sin(a)*r} r="1.5" fill="#F7941D" opacity="0.6" />;
          })}
        </svg>
        {/* Bottom-left tetrahedron */}
        <svg style={{ position:"absolute", bottom:"14%", left:"8%", width:65, height:65, opacity:0.18, pointerEvents:"none",
          animation:"ctaGemFloat 10s ease-in-out 3s infinite reverse", filter:"drop-shadow(0 0 6px rgba(107,45,139,0.7))" }}
          viewBox="0 0 65 65" fill="none">
          <polygon points="32,4 60,52 4,52" stroke="#9B6BDF" strokeWidth="1.5" fill="rgba(107,45,139,0.08)" />
          <line x1="32" y1="4" x2="32" y2="52" stroke="#9B6BDF" strokeWidth="0.8" opacity="0.5" />
          <line x1="18" y1="28" x2="46" y2="28" stroke="#9B6BDF" strokeWidth="0.8" opacity="0.4" />
          <circle cx="32" cy="4" r="2.5" fill="#9B6BDF" opacity="0.7" />
          <circle cx="60" cy="52" r="2.5" fill="#9B6BDF" opacity="0.7" />
          <circle cx="4"  cy="52" r="2.5" fill="#9B6BDF" opacity="0.7" />
        </svg>
        {/* Bottom-right octahedron-ish */}
        <svg style={{ position:"absolute", bottom:"10%", right:"9%", width:74, height:74, opacity:0.20, pointerEvents:"none",
          animation:"ctaGemFloat 14s ease-in-out 0.8s infinite", filter:"drop-shadow(0 0 8px rgba(141,198,63,0.5))" }}
          viewBox="0 0 74 74" fill="none">
          <polygon points="37,4 70,37 37,70 4,37" stroke="#8DC63F" strokeWidth="1.5" fill="rgba(141,198,63,0.06)" />
          <polygon points="37,4 70,37 37,37" stroke="#8DC63F" strokeWidth="0.8" fill="rgba(141,198,63,0.05)" />
          <polygon points="37,70 4,37 37,37" stroke="#8DC63F" strokeWidth="0.8" fill="rgba(141,198,63,0.03)" />
          <line x1="4"  y1="37" x2="70" y2="37" stroke="#8DC63F" strokeWidth="0.7" opacity="0.5" />
          <line x1="37" y1="4"  x2="37" y2="70" stroke="#8DC63F" strokeWidth="0.7" opacity="0.4" />
          {[0,1,2,3].map(i => {
            const pts = [[37,4],[70,37],[37,70],[4,37]];
            return <circle key={i} cx={pts[i][0]} cy={pts[i][1]} r="3" fill="#8DC63F" opacity="0.6" />;
          })}
        </svg>
        {/* Mid-left small spinning square */}
        <svg style={{ position:"absolute", top:"42%", left:"3%", width:44, height:44, opacity:0.16, pointerEvents:"none",
          animation:"svcDecoSpin 20s linear infinite", filter:"drop-shadow(0 0 5px rgba(247,148,29,0.5))" }}
          viewBox="0 0 44 44" fill="none">
          <rect x="4" y="4" width="36" height="36" stroke="#F7941D" strokeWidth="1.2" fill="none" transform="rotate(15 22 22)" />
          <rect x="10" y="10" width="24" height="24" stroke="#F7941D" strokeWidth="0.8" fill="rgba(247,148,29,0.06)" transform="rotate(30 22 22)" />
          <circle cx="22" cy="22" r="3" fill="#F7941D" opacity="0.5" />
        </svg>
        {/* Mid-right small gem */}
        <svg style={{ position:"absolute", top:"38%", right:"4%", width:48, height:48, opacity:0.15, pointerEvents:"none",
          animation:"ctaGemFloat 8s ease-in-out 2s infinite reverse", filter:"drop-shadow(0 0 5px rgba(141,198,63,0.5))" }}
          viewBox="0 0 48 48" fill="none">
          <polygon points="24,4 44,18 44,30 24,44 4,30 4,18" stroke="#8DC63F" strokeWidth="1.2" fill="rgba(141,198,63,0.06)" />
          <line x1="4" y1="18" x2="44" y2="18" stroke="#8DC63F" strokeWidth="0.7" opacity="0.5" />
          <line x1="24" y1="4" x2="24" y2="44" stroke="#8DC63F" strokeWidth="0.7" opacity="0.35" />
        </svg>

        {/* ── Layer 4: light rays from center ── */}
        <svg style={{ position:"absolute", top:"50%", left:"50%", opacity:0.06, pointerEvents:"none",
          animation:"svcMandalaSpin 40s linear infinite" }}
          width="900" height="900" viewBox="0 0 900 900" fill="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30) * Math.PI / 180;
            return <line key={i}
              x1="450" y1="450"
              x2={450 + Math.cos(a) * 420} y2={450 + Math.sin(a) * 420}
              stroke="url(#ctaRay)" strokeWidth={i%2===0 ? 2 : 1} />;
          })}
          <defs>
            <linearGradient id="ctaRay" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── Layer 5: floating dust particles ── */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left:"8%",  bot:"0", w:3, delay:0,   dur:14, c:"#F7941D" },
            { left:"18%", bot:"0", w:2, delay:2.2, dur:18, c:"#8DC63F" },
            { left:"29%", bot:"0", w:4, delay:0.8, dur:12, c:"#9B6BDF" },
            { left:"41%", bot:"0", w:2, delay:3.1, dur:16, c:"#F7941D" },
            { left:"53%", bot:"0", w:3, delay:1.4, dur:20, c:"#8DC63F" },
            { left:"64%", bot:"0", w:2, delay:0.3, dur:15, c:"#F7941D" },
            { left:"75%", bot:"0", w:4, delay:2.7, dur:13, c:"#9B6BDF" },
            { left:"87%", bot:"0", w:3, delay:1.0, dur:17, c:"#8DC63F" },
            { left:"13%", bot:"0", w:2, delay:4.0, dur:19, c:"#F7941D" },
            { left:"46%", bot:"0", w:3, delay:1.8, dur:11, c:"#9B6BDF" },
          ].map((p, i) => (
            <div key={i} style={{
              position:"absolute", left:p.left, bottom:0,
              width:p.w, height:p.w*2, borderRadius:"50% 50% 50% 0",
              background:p.c, opacity:0,
              animation:`floatUpServ ${p.dur}s ease-in-out ${p.delay}s infinite`,
              filter:"blur(0.5px)",
            }} />
          ))}
        </div>

        {/* ── Layer 6: perspective grid floor ── */}
        <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", height:180,
          opacity:0.06, pointerEvents:"none" }}
          viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`}
              x1={720} y1={0}
              x2={i*(1440/12)} y2={180}
              stroke="#8DC63F" strokeWidth="0.8" />
          ))}
          {[40,80,120,160].map((y, i) => (
            <line key={`h${i}`} x1="0" y1={y} x2="1440" y2={y} stroke="#8DC63F" strokeWidth="0.5" />
          ))}
        </svg>

        <div className="max-w-2xl mx-auto text-center relative">
          <div style={{
            width: 50, height: 2, background: "linear-gradient(90deg, transparent, #8DC63F, transparent)",
            margin: "0 auto 18px",
          }} />
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#8DC63F" }}>
            Begin your journey
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#fff" }}>
            Not sure which one is for you?
          </h2>
          <p className="text-base font-light mb-10" style={{ color: "rgba(255,255,255,0.78)" }}>
            Message us on WhatsApp — we&apos;ll listen to where you are and suggest the right starting point.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
              style={{ background: "linear-gradient(135deg, #6B2D8B, #F7941D)",
                boxShadow: "0 10px 28px rgba(247,148,29,0.45)" }}>
              Chat on WhatsApp
            </a>
            <Link href="/contact"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
              style={{ border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff",
                background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)" }}>
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
