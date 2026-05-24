"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FloatingLotus = dynamic(() => import("@/components/FloatingLotus"), {
  ssr: false,
  loading: () => (
    <div className="h-72 flex items-center justify-center">
      <div className="w-20 h-20 rounded-full animate-pulse" style={{ background: "rgba(141,198,63,0.15)", border: "1px solid rgba(141,198,63,0.3)" }} />
    </div>
  ),
});

const PARTICLES = [
  { left: 8,  delay: 0.2, dur: 4.1, size: 3 }, { left: 18, delay: 1.5, dur: 5.0, size: 2 },
  { left: 27, delay: 0.8, dur: 3.6, size: 4 }, { left: 36, delay: 2.1, dur: 4.8, size: 2 },
  { left: 45, delay: 0.4, dur: 5.5, size: 3 }, { left: 55, delay: 1.8, dur: 4.2, size: 2 },
  { left: 64, delay: 0.9, dur: 3.9, size: 4 }, { left: 73, delay: 2.4, dur: 5.1, size: 3 },
  { left: 82, delay: 0.6, dur: 4.6, size: 2 }, { left: 91, delay: 1.2, dur: 3.8, size: 3 },
  { left: 12, delay: 3.1, dur: 6.0, size: 2 }, { left: 24, delay: 2.7, dur: 5.3, size: 3 },
  { left: 50, delay: 3.5, dur: 4.4, size: 2 }, { left: 68, delay: 1.0, dur: 5.8, size: 4 },
  { left: 88, delay: 2.9, dur: 4.0, size: 2 },
];

function TiltCard({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(12px)`;
    el.style.boxShadow = `${-x * 24}px ${y * 24}px 48px rgba(107,45,139,0.18)`;
  }
  function onLeave() {
    const el = ref.current; if (!el) return;
    el.style.transform = ""; el.style.boxShadow = "";
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.18s ease, box-shadow 0.18s ease", ...style }}>
      {children}
    </div>
  );
}

function AnimatedStat({ value, suffix, label, color, delay = 0 }: { value: number; suffix?: string; label: string; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const step = value / 50;
      const timer = setInterval(() => {
        start += step;
        if (start >= value) { setCount(value); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 30);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, value, delay]);

  return (
    <div ref={ref}
      className="stat-3d"
      style={{
        padding: "1.75rem 1.25rem", borderRadius: "1.25rem",
        background: `linear-gradient(160deg, ${color}10 0%, ${color}03 100%)`,
        border: `1.5px solid ${color}33`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 6px 22px ${color}10`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}>
      {/* Corner orb */}
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -30, left: -30, width: 100, height: 100, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div className="stat-num" style={{
        fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 300,
        color, lineHeight: 1, position: "relative",
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontSize: "0.88rem", letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#7A5840", marginTop: 10, position: "relative", fontWeight: 500,
      }}>{label}</div>
      <div style={{
        height: 2, width: 32, background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        margin: "10px auto 0", position: "relative",
      }} />
    </div>
  );
}

const team = [
  {
    name: "Dr. Chintamani Gautam",
    role: "President & Lead Yoga Teacher",
    bio: "Born in Lumbini — the birthplace of Buddha — Dr. Gautam developed a passion for Sanskrit and philosophy at age eight. He holds a PhD from Gurukul Kangri University (Haridwar), a Master's in Yoga, and an Aacharya in Sanskrit from Sampurnananda University, Varanasi. With 22+ years and over 40,000 hours of teaching across Hatha, Ashtanga, Kriya, Jnana, Bhakti, Raja, Mantra, and Kundalini yoga, he has led workshops in Japan, Italy, Austria, China, and India. In 2012 he received the Nepal Vidyabhushan 'KA' award from President Dr. Ramvaran Yadav.",
    color: "#6B2D8B",
    initials: "CG",
    credentials: ["PhD — Gurukul Kangri University", "E-RYT 500", "40,000+ teaching hours", "Nepal Vidyabhushan Award 2012"],
  },
  {
    name: "Yogi Arjun Rakhal",
    role: "Senior Yoga Teacher & Trainer",
    bio: "Deeply versed in Hatha, Ashtanga, Vinyasa, Power, and traditional Sanatan yoga styles, Yogi Arjun brings disciplined precision and compassionate guidance to every class. Drawing from years of practice rooted in the Himalayan tradition, he teaches students of all levels across the weekly drop-in schedule and teacher training programs.",
    color: "#F7941D",
    initials: "AR",
    credentials: ["Hatha & Ashtanga", "Vinyasa & Power Yoga", "Sanatan Tradition"],
  },
  {
    name: "Dr. Dipika",
    role: "Yoga Therapist & Wellness Consultant",
    bio: "Integrating modern medicine with yogic science, Dr. Dipika specialises in therapeutic yoga for physical and mental wellness. She works with students managing back pain, joint pain, diabetes, anxiety, depression, and chronic conditions — bridging clinical knowledge with the healing intelligence of the yoga tradition.",
    color: "#8DC63F",
    initials: "DP",
    credentials: ["Yoga Therapy", "Clinical Wellness", "Chronic Condition Care"],
  },
];

const values = [
  { n: "01", title: "Authentic Lineage", body: "Every technique has a traceable source — no hybridised wellness trends. We root in verified traditions from the Himalayan region.", color: "#F7941D" },
  { n: "02", title: "Intimate Scale",    body: "We keep groups small. Every student receives real attention, real feedback, and a genuine relationship with their teachers.", color: "#6B2D8B" },
  { n: "03", title: "Place as Practice", body: "Kathmandu is not incidental. The temples, the altitude, the community — Nepal is woven into the curriculum itself.", color: "#8DC63F" },
  { n: "04", title: "Holistic Wellness", body: "A one-stop solution for health and fitness in collaboration with dietitians, nutritionists, and mental health professionals.", color: "#F7941D" },
];

export default function AboutContent() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden" style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 40%, #3D1560 70%, #1a0a2e 100%)", minHeight: "85vh", display: "flex", alignItems: "center" }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,45,139,0.4) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,148,29,0.15) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute", bottom: "-10px",
              left: `${p.left}%`,
              width: p.size, height: p.size,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#F7941D" : i % 3 === 1 ? "#8DC63F" : "#9B6BDF",
              opacity: 0.5,
              animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>

        <style>{`
          @keyframes floatUp {
            0%   { opacity: 0; transform: translateY(0) scale(1); }
            20%  { opacity: 0.6; }
            80%  { opacity: 0.4; }
            100% { opacity: 0; transform: translateY(-120px) scale(0.5); }
          }
          @keyframes pulseRing {
            0%   { transform: scale(0.95); opacity: 0.4; }
            50%  { transform: scale(1.05); opacity: 0.15; }
            100% { transform: scale(0.95); opacity: 0.4; }
          }
        `}</style>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p style={{ fontSize: "0.88rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#8DC63F", marginBottom: 20 }}>Our Story</p>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 300, color: "#FFFFFF", lineHeight: 1.08, marginBottom: 24 }}>
              Born from the valley,<br />
              <em style={{ color: "#F7941D" }}>rooted in the mountains</em>
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(255,255,255,0.7)", maxWidth: 460, marginBottom: 32 }}>
              Nepal&apos;s first Yoga Alliance registered school — a complete one-stop solution for health and fitness, making people healthy physically, mentally, socially, and spiritually at an affordable cost.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/yoga-teacher-training" style={{
                padding: "0.85rem 1.8rem", borderRadius: "3rem",
                background: "#A65808", color: "#fff",
                fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
              }}>
                Explore Programs
              </Link>
              <Link href="/contact" style={{
                padding: "0.85rem 1.8rem", borderRadius: "3rem",
                border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff",
                fontWeight: 500, fontSize: "0.85rem", textDecoration: "none",
              }}>
                Get in Touch
              </Link>
            </div>
          </div>

          {/* 3D Lotus */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(141,198,63,0.2)", animation: "pulseRing 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(107,45,139,0.15)", animation: "pulseRing 3s ease-in-out 1s infinite" }} />
            <FloatingLotus size="lg" />
            <p style={{ fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(141,198,63,0.5)", marginTop: 12 }}>
              The lotus — rooted in mud, rising in light
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(247,148,29,0.6), transparent)" }} />
          <span style={{ fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#FFFFFF", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.88rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F7941D", marginBottom: 48 }}>By the Numbers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            <AnimatedStat value={2018}  label="Year Founded" color="#F7941D" delay={0} />
            <AnimatedStat value={3000}  suffix="+" label="Teachers Trained" color="#6B2D8B" delay={150} />
            <AnimatedStat value={50}    suffix="+" label="Countries" color="#8DC63F" delay={300} />
            <AnimatedStat value={40000} suffix="+" label="Teaching Hours" color="#F7941D" delay={450} />
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section style={{ background: "#FAF6F0", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.88rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8DC63F", marginBottom: 16 }}>Our Mission</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 300, color: "#2A1208", lineHeight: 1.15, marginBottom: 24 }}>
              Why we exist
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: "0.92rem", lineHeight: 1.85, color: "#4A2E1A" }}>
              <p>Yogmandu Yoga and Retreat is a complete one-stop solution for all of your health and fitness needs under one roof. Our mission is to make people healthy physically, mentally, socially, and spiritually at an affordable cost.</p>
              <p>Established in 2018 as Nepal&apos;s first registered Yoga School and as a sister company to Zumbandu Fitness and Diet Therapy Clinic, we are affiliated with Yoga Alliance USA and Yoga Alliance International Australia.</p>
              <p>We collaborate with dietitians, nutritionists, and mental health professionals to offer holistic care — from therapeutic yoga for chronic conditions to weight management programs and diet consultation.</p>
            </div>
          </div>

          {/* Affiliations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { badge: "RYS 200, 300 & 500", org: "Yoga Alliance USA", color: "#6B2D8B" },
              { badge: "Certified School", org: "Yoga Alliance International Australia", color: "#F7941D" },
              { badge: "Since 2018", org: "Nepal's First Registered Yoga School", color: "#8DC63F" },
            ].map(a => (
              <TiltCard key={a.org} style={{
                padding: "1.25rem 1.5rem", borderRadius: "1rem",
                background: "#FFFFFF", border: `1.5px solid ${a.color}20`,
                display: "flex", alignItems: "center", gap: 16, cursor: "default",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${a.color}12`, border: `1px solid ${a.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: a.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{a.badge}</div>
                  <div style={{ fontSize: "0.88rem", color: "#2A1208", marginTop: 2 }}>{a.org}</div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: "#FFFFFF", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.88rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8DC63F", marginBottom: 12 }}>The Teachers</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "3rem", fontWeight: 300, color: "#2A1208" }}>Meet your guides</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {team.map(member => (
              <TiltCard key={member.name} style={{
                padding: "2rem", borderRadius: "1.5rem",
                background: "#FFFFFF", border: `1.5px solid ${member.color}15`,
                cursor: "default", overflow: "hidden", position: "relative",
              }}>
                {/* Top accent bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${member.color}, ${member.color}44)` }} />
                {/* Avatar */}
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `${member.color}15`, border: `2px solid ${member.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "1.1rem", color: member.color,
                  marginBottom: 16,
                }}>
                  {member.initials}
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 400, color: "#2A1208", marginBottom: 4 }}>{member.name}</h3>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: member.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{member.role}</p>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "#4A2E1A", marginBottom: 16 }}>{member.bio}</p>
                {/* Credentials */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {member.credentials.map(c => (
                    <span key={c} style={{
                      fontSize: "1rem", padding: "3px 10px", borderRadius: "3rem",
                      background: `${member.color}10`, border: `1px solid ${member.color}25`,
                      color: member.color, fontWeight: 500,
                    }}>{c}</span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: "#FAF6F0", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.88rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#F7941D", marginBottom: 12 }}>What We Stand For</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "3rem", fontWeight: 300, color: "#2A1208" }}>Our values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {values.map(v => (
              <TiltCard key={v.title} style={{
                padding: "2rem", borderRadius: "1.25rem",
                background: "#FFFFFF", border: "1px solid rgba(42,18,8,0.07)",
                cursor: "default",
              }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "3.5rem", fontWeight: 300, color: v.color, opacity: 0.2, lineHeight: 1, marginBottom: 12 }}>{v.n}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 400, color: "#2A1208", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "#4A2E1A" }}>{v.body}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ background: "#FFFFFF", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: "0.88rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B2D8B", marginBottom: 12 }}>What We Offer</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 300, color: "#2A1208" }}>Our services</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {[
              "Hatha Yoga Classes", "Vinyasa Yoga", "Power Yoga",
              "Ashtanga Yoga", "Sanatan Yoga", "Meditation Classes",
              "200hr Yoga Teacher Training", "300hr Advanced Training", "500hr Master Training", "Sound Healing Therapy",
              "Sound Healing Certification (Level I & II)", "Pranayama & Breathwork", "Yoga Therapy",
              "Virtual Live Yoga Classes", "Private & Corporate Yoga", "Children's Yoga",
              "Senior Citizen Yoga", "49-Day Weight Loss Bootcamp", "Diet & Nutrition Consultation",
              "Yoga Retreats & Trekking", "Reiki Healing",
            ].map((s, i) => {
              const accent = i % 3 === 0 ? "#F7941D" : i % 3 === 1 ? "#6B2D8B" : "#8DC63F";
              return (
                <div key={s}
                  className="pill-3d"
                  style={{
                    padding: "0.8rem 1.1rem", borderRadius: "0.85rem",
                    border: `1.5px solid ${accent}28`,
                    background: `linear-gradient(135deg, ${accent}12 0%, ${accent}04 100%)`,
                    fontSize: "1rem", color: "#2A1208",
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "default",
                    position: "relative", overflow: "hidden",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = `linear-gradient(135deg, ${accent}28 0%, ${accent}10 100%)`;
                    el.style.borderColor = `${accent}66`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = `linear-gradient(135deg, ${accent}12 0%, ${accent}04 100%)`;
                    el.style.borderColor = `${accent}28`;
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", background: accent,
                    flexShrink: 0, boxShadow: `0 0 8px ${accent}80`,
                  }} />
                  {s}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #3D1560 100%)", padding: "6rem 1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(107,45,139,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "3rem", fontWeight: 300, color: "#FFFFFF", marginBottom: 16 }}>
            Ready to begin?
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", marginBottom: 36, lineHeight: 1.8 }}>
            The next cohort is forming. Reach out and we will help you find the right program for where you are in your practice.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" style={{ padding: "0.9rem 2rem", borderRadius: "3rem", background: "#A65808", color: "#fff", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}>
              Get in Touch
            </Link>
            <Link href="/yoga-teacher-training" style={{ padding: "0.9rem 2rem", borderRadius: "3rem", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontWeight: 500, fontSize: "0.88rem", textDecoration: "none" }}>
              View Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
