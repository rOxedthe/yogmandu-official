import type { Metadata } from "next";
import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import SingingBowl from "@/components/SingingBowlClient";
import MountainScene from "@/components/MountainSceneClient";
import ProgramsSection from "@/components/ProgramsSectionClient";
import WhySection from "@/components/WhySection";
import { DeferUntilIdle, DeferUntilVisible } from "@/components/DeferredHeavy";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Nepal | Yogmandu Kathmandu",
  description:
    "Nepal's premier Yoga Alliance RYS 200, 300 & 500 certified teacher training school. Authentic Tibetan singing bowl sound healing. Founded 2018 by Dr. Chintamani Gautam. 3,000+ teachers from 50+ countries.",
  keywords: [
    "yoga teacher training Nepal",
    "200hr yoga teacher training Kathmandu",
    "yoga alliance Nepal",
    "sound healing Kathmandu",
    "Tibetan singing bowl Nepal",
    "yoga school Nepal",
    "Yogmandu",
    "yoga retreat Kathmandu",
    "RYS 200 Nepal",
  ],
  alternates: { canonical: "https://yogmandu.com" },
  openGraph: {
    title: "Yogmandu | Yoga Teacher Training & Sound Healing Kathmandu Nepal",
    description:
      "Nepal's premier Yoga Alliance certified school. 200hr & 300hr YTT + authentic Tibetan sound healing in Kathmandu. 3,000+ teachers trained from 50+ countries.",
    url: "https://yogmandu.com",
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Course", position: 1,
      name: "200-Hour Yoga Teacher Training Nepal",
      description: "Yoga Alliance certified 200hr teacher training in Kathmandu, Nepal.",
      provider: { "@type": "Organization", name: "Yogmandu" },
      courseMode: "onsite", location: { "@type": "Place", name: "Kathmandu, Nepal" },
    },
    {
      "@type": "Course", position: 2,
      name: "Sound Healing Therapy Nepal — Tibetan Singing Bowls",
      description: "Authentic Tibetan singing bowl sessions in Kathmandu, Nepal.",
      provider: { "@type": "Organization", name: "Yogmandu" },
      courseMode: "onsite", location: { "@type": "Place", name: "Kathmandu, Nepal" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      {/* ── HERO — white bg ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#FFFFFF" }}>
        {/* Soft colour orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(247,148,29,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(107,45,139,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-1/3 right-16 w-40 h-40 rounded-full pointer-events-none hidden md:block"
            style={{ border: "1.5px solid rgba(247,148,29,0.15)", animation: "float 8s ease-in-out infinite" }} />
          <div className="absolute top-1/2 right-24 w-24 h-24 rounded-full pointer-events-none hidden md:block"
            style={{ border: "1px solid rgba(247,148,29,0.1)", animation: "float 6s ease-in-out infinite 1s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            {/* Credential badges */}
            <div className="flex flex-col gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
                style={{ background: "rgba(141,198,63,0.1)", border: "1px solid rgba(141,198,63,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#8DC63F" }} />
                <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "#3E5C12" }}>
                  Yoga Alliance Registered · Nepal
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
                style={{ background: "rgba(107,45,139,0.08)", border: "1px solid rgba(107,45,139,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#6B2D8B" }} />
                <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "#6B2D8B" }}>
                  International Certified, Accredited &amp; Credential Program
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.08] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Where the mountains
              <br />
              <em style={{ color: "#A65808" }}>hold your practice</em>
            </h1>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "#4A2E1A", fontWeight: 400 }}>
              Yoga Alliance certified teacher training &amp; authentic Sound Healing in Kathmandu, Nepal.
              Transform your practice amid the Himalayas.
            </p>

            {/* ── 3 main focuses ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                { href: "/class-schedule",        icon: "🗓", label: "Class Schedule",    color: "#6B2D8B", bg: "rgba(107,45,139,0.07)", border: "rgba(107,45,139,0.2)" },
                { href: "/yoga-teacher-training",  icon: "🧘", label: "Teacher Training", color: "#2A1208", bg: "rgba(247,148,29,0.07)", border: "rgba(247,148,29,0.2)" },
                { href: "/sound-healing-therapy",  icon: "🎵", label: "Sound Healing",    color: "#2A1208", bg: "rgba(141,198,63,0.07)", border: "rgba(141,198,63,0.25)" },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="cta-lift"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "0.7rem 1rem", borderRadius: "0.75rem",
                    background: item.bg, border: `1.5px solid ${item.border}`,
                    textDecoration: "none", color: item.color, fontWeight: 500,
                    fontSize: "0.9rem", transition: "all 0.25s",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/yoga-teacher-training"
                className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
                style={{ background: "#A65808", boxShadow: "0 6px 20px rgba(247,148,29,0.4)" }}>
                Explore Teacher Training
              </Link>
              <Link href="/sound-healing-therapy"
                className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
                style={{ border: "1.5px solid #6B2D8B", color: "#6B2D8B" }}>
                Discover Sound Healing
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-12">
              {[
                { value: "3,000+", label: "Teachers Trained", color: "#A65808" },
                { value: "50+",    label: "Countries",         color: "#6B2D8B" },
                { value: "RYS",    label: "Yoga Alliance",     color: "#4A6418" },
              ].map((b) => (
                <div key={b.value} className="flex flex-col">
                  <span className="text-2xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: b.color }}>{b.value}</span>
                  <span className="text-xs font-medium" style={{ color: "#7A5840" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Bowl — deferred until browser is idle so it doesn't block TBT */}
          <div className="flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <div className="relative w-full max-w-xs h-72 animate-pulse-glow rounded-full">
              <DeferUntilIdle
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 animate-pulse"
                      style={{ borderColor: "rgba(107,45,139,0.3)" }} />
                  </div>
                }
              >
                <SingingBowl />
              </DeferUntilIdle>
            </div>
            <p className="mt-3 text-xs tracking-[0.25em] uppercase font-medium"
              style={{ color: "#A65808" }}>
              Click the bowl to hear it
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #F7941D, transparent)" }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "#5C3D2E" }}>scroll</span>
        </div>
      </section>

      {/* ── 3 MAIN FOCUSES — quick highlight strip ── */}
      <section style={{ background: "#FFFFFF", padding: "0 0 1rem" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem",
        }}>
          {[
            // accent = decorative (top bar, border, bg tint) — kept bright/brand
            // textAccent = used for CTA text + dynamic UI text — meets WCAG AA on white
            {
              href: "/class-schedule",
              accent: "#6B2D8B", textAccent: "#6B2D8B",
              icon: "🗓",
              title: "Class Schedule",
              desc: "Browse our weekly yoga timetable — morning flows, evening restorative sessions, pranayama and more.",
              cta: "View Schedule",
            },
            {
              href: "/yoga-teacher-training",
              accent: "#F7941D", textAccent: "#A65808",
              icon: "🧘",
              title: "Yoga Teacher Training",
              desc: "Yoga Alliance RYS 200, 300 & 500 certified programs in the heart of Kathmandu, Nepal.",
              cta: "View Programs",
            },
            {
              href: "/book?service=sound",
              accent: "#8DC63F", textAccent: "#4A6418",
              icon: "🎵",
              title: "Sound Healing",
              desc: "Authentic Tibetan singing bowl therapy — individual sessions, group healing and full certification courses.",
              cta: "Book a Session",
            },
            {
              href: "/services",
              accent: "#6B2D8B", textAccent: "#6B2D8B",
              icon: "✨",
              title: "All Services",
              desc: "Retreats, corporate yoga, weight-loss bootcamp, therapy, diet consultation, Reiki, prenatal & more — the full range.",
              cta: "Explore Services",
            },
            {
              href: "/about",
              accent: "#F7941D", textAccent: "#A65808",
              icon: "🌅",
              title: "Our Story",
              desc: "Founded in 2018 by the teams of experts in the yoga and wellness industry. Led by Dr. Chintamani Gautam (PhD Yogic Science, ERYT 500). Nepal's first Yoga Alliance registered school.",
              cta: "Meet the Team",
            },
            {
              href: "/gallery",
              accent: "#8DC63F", textAccent: "#4A6418",
              icon: "📷",
              title: "Studio & Students",
              desc: "Photos from classes, sound baths, retreats, and 200hr graduates from 50+ countries — see what awaits you in Kathmandu.",
              cta: "View Gallery",
            },
          ].map(item => (
            <div
              key={item.href}
              style={{
                padding: "2rem",
                borderRadius: "1.25rem",
                border: `1.5px solid ${item.accent}22`,
                background: `${item.accent}06`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${item.accent}, ${item.accent}55)`,
              }} />
              <span style={{ fontSize: "2rem", display: "block", marginBottom: 12 }}>{item.icon}</span>
              <h2 style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "1.4rem", fontWeight: 400,
                color: "#2A1208", marginBottom: 8,
              }}>
                {item.title}
              </h2>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#4A2E1A", fontWeight: 400, marginBottom: 18 }}>
                {item.desc}
              </p>
              <Link
                href={item.href}
                className="cta-lift"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: "0.88rem", fontWeight: 500,
                  color: item.textAccent, textDecoration: "none",
                  borderBottom: `1px solid ${item.accent}40`,
                  paddingBottom: "2px",
                }}
              >
                {item.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMS — 3D interactive section, lazy when in view ── */}
      <DeferUntilVisible fallback={<div style={{ minHeight: 600 }} />}>
        <ProgramsSection />
      </DeferUntilVisible>

      {/* ── NEPAL — deep purple bg, white text ── */}
      <section className="relative overflow-hidden" style={{ background: "#3D1560" }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(247,148,29,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(107,45,139,0.3) 0%, transparent 65%)", filter: "blur(40px)" }} />

        {/* CSS starfield */}
        <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: "55%", opacity: 0.7 }} aria-hidden>
          {[
            [8,12],[15,28],[22,8],[31,42],[38,18],[44,55],[51,7],[57,33],[63,19],[70,48],
            [76,11],[82,38],[89,22],[94,61],[6,67],[12,81],[19,54],[26,73],[33,87],[40,64],
            [47,79],[54,91],[61,68],[67,83],[73,57],[80,75],[86,88],[92,71],[3,44],[9,95],
            [16,37],[23,62],[30,14],[37,79],[43,29],[50,53],[56,86],[62,41],[68,72],[74,25],
            [81,58],[87,43],[93,84],[5,20],[11,49],[18,90],[25,33],[32,66],[39,10],[46,82],
            [52,47],[59,16],[65,60],[71,35],[78,93],[84,28],[90,51],[97,17],[4,76],[21,5],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={i % 5 === 0 ? 1.4 : i % 3 === 0 ? 0.9 : 0.55}
              fill={i % 7 === 0 ? "#e8d8ff" : "#FAF0DC"}
              opacity={i % 4 === 0 ? 0.9 : i % 3 === 0 ? 0.6 : 0.4}
            />
          ))}
        </svg>

        <div className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#8DC63F" }}>The Setting</p>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-[1.1]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Kathmandu is not a backdrop —
              <br />
              <em style={{ color: "#F7941D" }}>it is the practice itself</em>
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto font-light" style={{ color: "rgba(255,255,255,0.75)" }}>
              The ancient temples, the mountain air, the living tradition of yoga lineage — Nepal carries a
              frequency that deepens every session and accelerates every transformation.
            </p>
            <a href="https://wa.me/9779862909469"
              className="cta-lift inline-block px-10 py-4 rounded-full font-medium text-sm"
              style={{ background: "#A65808", color: "white" }}>
              Plan Your Journey to Nepal
            </a>
          </div>
        </div>

        <div className="relative">
          <DeferUntilVisible fallback={<div style={{ minHeight: 420 }} />}>
            <MountainScene />
          </DeferUntilVisible>
          <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, #3D1560, transparent)" }} />
        </div>
      </section>

      {/* ── WHY YOGMANDU ── */}
      <WhySection />

      {/* ── TESTIMONIALS — heavy 3D bg, defer until visible ── */}
      <DeferUntilVisible fallback={<div style={{ minHeight: 600 }} />}>
        <Testimonials />
      </DeferUntilVisible>
    </>
  );
}
