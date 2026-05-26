import type { Metadata } from "next";
import Link from "next/link";
import ScheduleGrid from "./ScheduleGrid";
import HeroDecor from "./HeroDecor";
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
        background: "linear-gradient(155deg, #1a0535 0%, #3D1560 45%, #6B2D8B 100%)",
        padding: "7rem 2rem 4.5rem",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        {/* ── Yoga-themed decorative background ── */}

        {/* Mandala — large, slowly rotating, centred behind content */}
        <svg aria-hidden="true" style={{ position:"absolute", left:"50%", top:"50%", marginLeft:"-320px", marginTop:"-320px",
          width:640, height:640, opacity:0.07, animation:"spin-slow 90s linear infinite", pointerEvents:"none" }}
          viewBox="0 0 640 640" fill="none">
          {[40,80,120,160,200,240,280,320].map(r => (
            <circle key={r} cx="320" cy="320" r={r} stroke="#F7941D" strokeWidth="0.8"/>
          ))}
          {[0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270,285,300,315,330,345].map(d => (
            <line key={d} x1="320" y1="0" x2="320" y2="640" stroke="#F7941D" strokeWidth="0.4"
              transform={`rotate(${d} 320 320)`}/>
          ))}
          {[0,45,90,135,180,225,270,315].map(d => (
            <ellipse key={d} cx="320" cy="160" rx="22" ry="70" fill="none" stroke="#8DC63F" strokeWidth="0.7" opacity="0.6"
              transform={`rotate(${d} 320 320)`}/>
          ))}
          <circle cx="320" cy="320" r="18" stroke="#F7941D" strokeWidth="1.2"/>
          <circle cx="320" cy="320" r="6" fill="#F7941D" opacity="0.5"/>
        </svg>

        {/* Inner mandala ring — counter-rotates for depth */}
        <svg aria-hidden="true" style={{ position:"absolute", left:"50%", top:"50%", marginLeft:"-180px", marginTop:"-180px",
          width:360, height:360, opacity:0.09, animation:"spin-slow-rev 60s linear infinite", pointerEvents:"none" }}
          viewBox="0 0 360 360" fill="none">
          {[60,100,140].map(r => (
            <circle key={r} cx="180" cy="180" r={r} stroke="#8DC63F" strokeWidth="0.8"/>
          ))}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(d => (
            <line key={d} x1="180" y1="40" x2="180" y2="320" stroke="#8DC63F" strokeWidth="0.5"
              transform={`rotate(${d} 180 180)`}/>
          ))}
        </svg>

        {/* Interactive 3-D decorative elements (client component) */}
        <HeroDecor />

        {/* Himalayan silhouette at bottom */}
        <svg aria-hidden="true" style={{ position:"absolute", bottom:0, left:0, width:"100%", pointerEvents:"none" }}
          viewBox="0 0 1440 100" preserveAspectRatio="none">
          <polygon points="0,100 180,38 340,100"  fill="rgba(255,255,255,0.04)"/>
          <polygon points="100,100 360,15 620,100" fill="rgba(255,255,255,0.06)"/>
          <polygon points="320,100 600,8  880,100"  fill="rgba(255,255,255,0.05)"/>
          <polygon points="620,100 920,28 1200,100" fill="rgba(255,255,255,0.07)"/>
          <polygon points="950,100 1180,44 1440,100" fill="rgba(255,255,255,0.04)"/>
        </svg>

        {/* Floating energy dots */}
        {([
          [10,25,4,"#F7941D",0], [20,72,5,"#8DC63F",1.2], [78,18,3,"#fff",0.6],
          [88,65,5,"#F7941D",2], [48,88,4,"#8DC63F",3], [65,12,3,"#fff",1.8],
          [35,55,4,"#F7941D",0.4], [92,35,3,"#8DC63F",2.5],
        ] as [number,number,number,string,number][]).map(([x,y,s,c,delay],i) => (
          <div key={i} aria-hidden="true" style={{ position:"absolute", left:`${x}%`, top:`${y}%`,
            width:s, height:s, borderRadius:"50%", background:c, opacity:0.28,
            animation:"drift 7s ease-in-out infinite", animationDelay:`${delay}s`, pointerEvents:"none" }}/>
        ))}

        {/* Centered logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <picture>
            <source srcSet="/logo-206-inv.webp" type="image/webp" />
            <img src="/logo-206.png" alt="Yogmandu" width={180} height={72} fetchPriority="high" decoding="async" style={{ height: 72, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </picture>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.6rem", fontWeight: 400 }}>
            <span style={{ color: "#F7941D" }}>Yog</span>
            <span style={{ color: "#FFFFFF" }}>mandu</span>
          </span>
        </div>

        <p style={{ fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase",
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
          <span style={{ fontSize: "0.88rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A5840", fontWeight: 500 }}>Level:</span>
          {(["All levels", "Intermediate", "Beginner"] as const).map(l => {
            const lc = levelColor(l);
            return (
              <span key={l} style={{ fontSize: "0.92rem", fontWeight: 500, padding: "3px 12px", borderRadius: 999,
                background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}>
                {l}
              </span>
            );
          })}
          <span style={{ fontSize: "0.88rem", color: "#7A5840", marginLeft: "auto" }}>
            📍 Mid-Baneshwor, Kathmandu · All times local (NPT UTC+5:45)
          </span>
        </div>
      </div>

      {/* ── Interactive schedule grid (client component) ── */}
      <ScheduleGrid sessions={sessions} instructorMap={instructorMap} />
    </main>
  );
}
