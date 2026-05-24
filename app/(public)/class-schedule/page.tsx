import type { Metadata } from "next";
import Link from "next/link";
import ScheduleGrid from "./ScheduleGrid";
import { getActiveSessions, getInstructorMap } from "@/lib/publicData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Yoga Class Schedule Kathmandu | Daily Classes at Yogmandu Nepal",
  description:
    "Weekly yoga timetable at Yogmandu Kathmandu — Morning Hatha, Vinyasa, Ashtanga, Yin Yoga, Pranayama, Meditation, Tibetan Bowl Healing and Restorative Yoga. All levels welcome.",
  keywords: [
    "yoga classes Kathmandu",
    "yoga schedule Nepal",
    "yoga timetable Kathmandu",
    "Hatha yoga Kathmandu",
    "Vinyasa class Nepal",
    "Ashtanga Kathmandu",
    "sound healing class schedule",
    "morning yoga Kathmandu",
    "yoga drop-in Nepal",
  ],
  alternates: { canonical: "https://yogmandu.com/class-schedule" },
  openGraph: {
    title: "Yoga Class Schedule Kathmandu | Daily Classes at Yogmandu",
    description: "Hatha, Vinyasa, Ashtanga, Yin, Pranayama, Meditation & Sound Healing — 7 days a week in Kathmandu. All levels welcome.",
    url: "https://yogmandu.com/class-schedule",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Class Schedule", item: "https://yogmandu.com/class-schedule" },
  ],
};

const levelColor = (level: string) => {
  if (level === "Beginner")     return { bg: "rgba(141,198,63,0.1)",  text: "#5A7A20",  border: "rgba(141,198,63,0.3)" };
  if (level === "Intermediate") return { bg: "rgba(247,148,29,0.1)",  text: "#B86010",  border: "rgba(247,148,29,0.3)" };
  return                               { bg: "rgba(107,45,139,0.08)", text: "#6B2D8B",  border: "rgba(107,45,139,0.2)" };
};

export default async function ClassSchedulePage() {
  const [sessions, instructorMap] = await Promise.all([
    getActiveSessions(),
    getInstructorMap(),
  ]);
  return (
    <main style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Page header ── */}
      <div style={{
        background: "linear-gradient(135deg, #3D1560 0%, #6B2D8B 100%)",
        padding: "7rem 2rem 4rem",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,148,29,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(141,198,63,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Centered logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <img src="/logo.png" alt="Yogmandu" width={180} height={72} fetchPriority="high" decoding="async" style={{ height: 72, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 400 }}>
            <span style={{ color: "#F7941D" }}>Yog</span>
            <span style={{ color: "#FFFFFF" }}>mandu</span>
          </span>
        </div>

        <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
          color: "#8DC63F", marginBottom: 12, fontWeight: 500 }}>
          Weekly Timetable
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.5rem,6vw,4rem)",
          fontWeight: 300, color: "#FFFFFF", lineHeight: 1.1, margin: "0 auto 16px", maxWidth: 600 }}>
          Class <em style={{ color: "#F7941D" }}>Schedule</em>
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.7 }}>
          All classes are held at our Mid-Baneshwor studio in Kathmandu. Drop-ins welcome — no reservation required for most classes.
        </p>
        <Link href="/book?service=private" className="cta-lift" style={{
          display: "inline-block", padding: "0.8rem 2rem", borderRadius: 999,
          background: "#A65808", color: "#fff", fontSize: "0.9rem", fontWeight: 500,
          boxShadow: "0 6px 20px rgba(247,148,29,0.4)", textDecoration: "none" }}>
          Book a Private Session
        </Link>
      </div>

      {/* ── Legend ── */}
      <div style={{ background: "#F9F5FF", padding: "1.25rem 2rem", borderBottom: "1px solid rgba(107,45,139,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A5840", fontWeight: 500 }}>Level:</span>
          {(["All levels", "Intermediate", "Beginner"] as const).map(l => {
            const lc = levelColor(l);
            return (
              <span key={l} style={{ fontSize: "0.75rem", fontWeight: 500, padding: "3px 12px", borderRadius: 999,
                background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}>
                {l}
              </span>
            );
          })}
          <span style={{ fontSize: "0.72rem", color: "#7A5840", marginLeft: "auto" }}>
            📍 Mid-Baneshwor, Kathmandu · All times local (NPT UTC+5:45)
          </span>
        </div>
      </div>

      {/* ── Interactive schedule grid (client component) ── */}
      <ScheduleGrid sessions={sessions} instructorMap={instructorMap} />
    </main>
  );
}
