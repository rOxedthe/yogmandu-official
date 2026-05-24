"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ProgramsSection = dynamic(() => import("./ProgramsSection"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 480, background: "#F9F5FF" }} />,
});

/** Card data inlined — avoids importing ProgramsSection (which loads Three.js) on mobile */
const MOBILE_CARDS = [
  { accent: "#6B2D8B", darkAccent: "#4B1F6A", label: "RYS 200 · 28 Days",    title: "200hr Teacher Training",   desc: "Yoga Alliance certified. Hatha, Ashtanga, philosophy, anatomy, pranayama — the complete foundation.",   cta: "View Program",   href: "/yoga-teacher-training" },
  { accent: "#3D1560", darkAccent: "#3D1560", label: "RYS 300 · Advanced",    title: "300hr Advanced Training",  desc: "For certified 200hr teachers ready to deepen mastery, advanced asana and teaching mentorship.",         cta: "View Program",   href: "/yoga-teacher-training" },
  { accent: "#A65808", darkAccent: "#A65808", label: "Individual · Group",    title: "Sound Healing Sessions",   desc: "Authentic Tibetan singing bowl sessions. Individual and group formats, all experience levels welcome.", cta: "Book a Session", href: "/sound-healing-therapy" },
  { accent: "#C47A1E", darkAccent: "#9A5E10", label: "Certification Program", title: "Sound Healing Cert.",     desc: "Full certification in therapeutic sound — bowl tuning, chakra work, session design and facilitation.",  cta: "Learn More",     href: "/sound-healing-therapy" },
  { accent: "#4A6418", darkAccent: "#4A6418", label: "7-Day · Immersive",     title: "Meditation & Pranayama",  desc: "Pranayama lineage techniques and meditation traditions. Stillness as a practice in the Himalayas.",      cta: "View Retreat",   href: "/yoga-teacher-training" },
];

function MobilePrograms() {
  return (
    <section style={{ background: "#F9F5FF", padding: "3.5rem 0 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1.75rem", padding: "0 1.5rem" }}>
        <p style={{ fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B2D8B", marginBottom: 8, fontWeight: 500 }}>
          Our Offerings
        </p>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.9rem,6vw,2.6rem)", fontWeight: 300, color: "#2A1208", margin: "0 0 4px" }}>
          Begin your <em style={{ color: "#6B2D8B" }}>transformation</em>
        </h2>
        <div style={{ width: 40, height: 2, background: "linear-gradient(90deg,#6B2D8B,#A65808)", margin: "12px auto 0" }} />
      </div>

      {/* Horizontal snap-scroll strip */}
      <div style={{
        display: "flex", gap: "0.875rem",
        overflowX: "auto", overflowY: "hidden",
        padding: "0.5rem 1.5rem 1.25rem",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {MOBILE_CARDS.map(card => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              textDecoration: "none",
              flexShrink: 0,
              width: "78vw",
              maxWidth: 300,
              scrollSnapAlign: "start",
              display: "block",
            }}
          >
            <div style={{
              background: "#FFFFFF",
              borderRadius: "1.25rem",
              border: `1.5px solid ${card.accent}28`,
              padding: "1.4rem 1.25rem 1.25rem",
              position: "relative", overflow: "hidden",
              boxShadow: "0 4px 18px rgba(42,18,8,0.06)",
              height: "100%",
              minHeight: 200,
            }}>
              {/* Accent top bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: card.accent }} />
              <p style={{ fontSize: "0.95rem", fontWeight: 600, color: card.darkAccent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, marginTop: 2 }}>
                {card.label}
              </p>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.25rem", fontWeight: 400, color: "#2A1208", marginBottom: 8, lineHeight: 1.25 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "#4A2E1A", marginBottom: 14 }}>
                {card.desc}
              </p>
              <span style={{
                fontSize: "0.95rem", fontWeight: 600,
                color: card.darkAccent,
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                {card.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll hint dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 4 }}>
        {MOBILE_CARDS.map((_, i) => (
          <div key={i} style={{ width: i === 0 ? 16 : 6, height: 6, borderRadius: 999, background: i === 0 ? "#6B2D8B" : "rgba(107,45,139,0.2)", transition: "all 0.3s" }} />
        ))}
      </div>
    </section>
  );
}

/**
 * Mobile (<768px): lightweight static card strip — Three.js never downloads.
 * Desktop: full 3-D coverflow ProgramsSection loaded when visible.
 */
export default function ProgramsSectionClient() {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setMobile(window.innerWidth < 768);
  }, []);

  if (mobile === null) return <div style={{ minHeight: 480, background: "#F9F5FF" }} />;
  if (mobile) return <MobilePrograms />;
  return <ProgramsSection />;
}
