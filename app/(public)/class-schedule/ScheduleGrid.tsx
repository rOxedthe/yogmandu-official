"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { DBSession } from "@/lib/publicData";
import { resolveInstructor, styleToAccent } from "@/lib/publicData";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DAY_MAP: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

// ── Hardcoded fallback ─────────────────────────────────────────────────────────
const FALLBACK: Record<string, { time: string; name: string; level: string; duration: string; instructor: string; accent: string }[]> = {
  Monday: [
    { time: "5:30 - 6:30 AM",  name: "Flexibility Yoga",          level: "All levels",   duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Ashtanga Vinyasa Yoga",     level: "Intermediate", duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Asana & Meditation",        level: "All levels",   duration: "60 min", instructor: "Sudha Rajouria",         accent: "#6B2D8B" },
    { time: "6:30 - 9:00 AM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Dr. Chintamani Gautam", accent: "#4A6418" },
    { time: "9:30 - 10:30 AM", name: "Power Yoga",                level: "Intermediate", duration: "60 min", instructor: "Soniya Shahi",          accent: "#F7941D" },
    { time: "3:00 - 5:30 PM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Arjun Rakhal",          accent: "#4A6418" },
  ],
  Tuesday: [
    { time: "5:30 - 6:30 AM",  name: "Flexibility Yoga",          level: "All levels",   duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Ashtanga Vinyasa Yoga",     level: "Intermediate", duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 9:00 AM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Dr. Chintamani Gautam", accent: "#4A6418" },
    { time: "9:30 - 10:30 AM", name: "Power Yoga",                level: "Intermediate", duration: "60 min", instructor: "Soniya Shahi",          accent: "#F7941D" },
    { time: "3:00 - 5:30 PM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Arjun Rakhal",          accent: "#4A6418" },
  ],
  Wednesday: [
    { time: "5:30 - 6:30 AM",  name: "Flexibility Yoga",          level: "All levels",   duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Ashtanga Vinyasa Yoga",     level: "Intermediate", duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Asana & Meditation",        level: "All levels",   duration: "60 min", instructor: "Sudha Rajouria",         accent: "#6B2D8B" },
    { time: "6:30 - 9:00 AM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Dr. Chintamani Gautam", accent: "#4A6418" },
    { time: "9:30 - 10:30 AM", name: "Power Yoga",                level: "Intermediate", duration: "60 min", instructor: "Soniya Shahi",          accent: "#F7941D" },
    { time: "3:00 - 5:30 PM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Arjun Rakhal",          accent: "#4A6418" },
  ],
  Thursday: [
    { time: "5:30 - 6:30 AM",  name: "Flexibility Yoga",          level: "All levels",   duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Ashtanga Vinyasa Yoga",     level: "Intermediate", duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 9:00 AM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Dr. Chintamani Gautam", accent: "#4A6418" },
    { time: "9:30 - 10:30 AM", name: "Power Yoga",                level: "Intermediate", duration: "60 min", instructor: "Soniya Shahi",          accent: "#F7941D" },
    { time: "3:00 - 5:30 PM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Arjun Rakhal",          accent: "#4A6418" },
  ],
  Friday: [
    { time: "5:30 - 6:30 AM",  name: "Flexibility Yoga",          level: "All levels",   duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Ashtanga Vinyasa Yoga",     level: "Intermediate", duration: "60 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "6:30 - 7:30 AM",  name: "Asana & Meditation",        level: "All levels",   duration: "60 min", instructor: "Sudha Rajouria",         accent: "#6B2D8B" },
    { time: "6:30 - 9:00 AM",  name: "Yoga Teacher's Training",   level: "Advanced",     duration: "150 min",instructor: "Dr. Chintamani Gautam", accent: "#4A6418" },
    { time: "9:30 - 10:30 AM", name: "Power Yoga",                level: "Intermediate", duration: "60 min", instructor: "Soniya Shahi",          accent: "#F7941D" },
  ],
  Saturday: [
    { time: "7:00 - 8:30 AM",  name: "Weekend Ashtanga",          level: "All levels",   duration: "90 min", instructor: "Arjun Rakhal",          accent: "#F7941D" },
    { time: "10:00 - 11:30 AM",name: "Group Sound Healing",       level: "All levels",   duration: "90 min", instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
    { time: "4:00 - 5:00 PM",  name: "Gentle Yoga & Stretch",     level: "Beginner",     duration: "60 min", instructor: "Sudha Rajouria",         accent: "#8DC63F" },
  ],
  Sunday: [
    { time: "7:30 - 8:15 AM",  name: "Sunrise Meditation",        level: "All levels",   duration: "45 min", instructor: "Arjun Rakhal",          accent: "#6B2D8B" },
    { time: "9:00 - 10:30 AM", name: "Slow Flow Hatha",           level: "All levels",   duration: "90 min", instructor: "Baikuntha Paudel",      accent: "#F7941D" },
    { time: "3:00 - 4:30 PM",  name: "Tibetan Bowl Healing",      level: "All levels",   duration: "90 min", instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
  ],
};

function buildSchedule(sessions: DBSession[], instructorMap: Record<string, string>) {
  const map: typeof FALLBACK = {};
  for (const s of sessions) {
    const abbrs = Array.isArray(s.days) ? s.days : [];
    for (const abbr of abbrs) {
      const day = DAY_MAP[abbr] ?? abbr;
      if (!map[day]) map[day] = [];
      map[day].push({
        time:       s.startTime,
        name:       s.name,
        level:      s.level,
        duration:   `${s.duration} min`,
        instructor: resolveInstructor(s.instructorId, instructorMap),
        accent:     styleToAccent(s.styles),
      });
    }
  }
  for (const day of Object.keys(map)) {
    map[day].sort((a, b) => a.time.localeCompare(b.time));
  }
  return map;
}

interface Props {
  sessions?:     DBSession[] | null;
  instructorMap?: Record<string, string>;
}

const HEADER_BG  = "#3D1560";   // deep purple — matches site brand
const ACTIVE_BG  = "#3D1560";   // deep purple — active day pill
const PILL_COLOR = "#6B2D8B";   // purple — inactive pill text/border

export default function ScheduleGrid({ sessions, instructorMap }: Props) {
  const map      = instructorMap || {};
  const schedule = sessions && sessions.length > 0 ? buildSchedule(sessions, map) : FALLBACK;

  const todayIndex = new Date().getDay();
  const todayName  = DAYS[todayIndex];

  const [activeDay, setActiveDay] = useState<string>(todayName);

  useEffect(() => {
    setActiveDay(DAYS[new Date().getDay()]);
  }, []);

  const classes = schedule[activeDay] ?? [];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem 3rem" }}>

      {/* ── Day tab pills ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem",
        justifyContent: "center",
        marginBottom: "2rem",
      }}>
        {DAYS.map((day) => {
          const isActive = activeDay === day;
          const isToday  = day === todayName;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 999,
                border: isActive ? "none" : `1.5px solid rgba(107,45,139,0.3)`,
                background: isActive
                  ? ACTIVE_BG
                  : isToday
                    ? "rgba(107,45,139,0.08)"
                    : "transparent",
                color: isActive ? "#FFFFFF" : PILL_COLOR,
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : isToday ? 500 : 400,
                cursor: "pointer",
                transition: "all 0.18s",
                letterSpacing: "0.01em",
                position: "relative",
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(107,45,139,0.12)";
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = isToday
                  ? "rgba(107,45,139,0.08)"
                  : "transparent";
              }}
            >
              {day}
              {isToday && !isActive && (
                <span style={{
                  position: "absolute", bottom: -3, left: "50%",
                  transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%",
                  background: PILL_COLOR,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div style={{
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid rgba(107,45,139,0.18)",
        boxShadow: "0 4px 24px rgba(42,18,8,0.07)",
      }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          background: HEADER_BG,
          padding: "0.85rem 1.25rem",
        }}>
          {["Time", "Teacher", "Class Type"].map((h) => (
            <span key={h} style={{
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {classes.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "3rem 1rem",
            color: "#9A7860", background: "#FFFFFF",
          }}>
            <p style={{ fontSize: "1.6rem", marginBottom: 8 }}>🌿</p>
            <p>No classes scheduled for {activeDay}.</p>
          </div>
        ) : (
          classes.map((cls, i) => {
            const bookHref = `/book?service=drop-in&cls=${encodeURIComponent(`${activeDay}|${cls.time}|${cls.name}|${cls.instructor}`)}`;
            const isEven   = i % 2 === 0;
            return (
              <Link
                key={i}
                href={bookHref}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "1rem 1.25rem",
                    background: isEven ? "#FFFFFF" : "#F7F4F0",
                    borderTop: "1px solid rgba(107,45,139,0.1)",
                    transition: "background 0.15s",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(247,148,29,0.07)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = isEven ? "#FFFFFF" : "#F7F4F0";
                  }}
                >
                  {/* Time */}
                  <span style={{
                    fontSize: "0.9rem",
                    color: "#2A1208",
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}>
                    {cls.time}
                  </span>

                  {/* Teacher */}
                  <span style={{
                    fontSize: "0.9rem",
                    color: "#4A3020",
                    lineHeight: 1.4,
                  }}>
                    {cls.instructor}
                  </span>

                  {/* Class Type */}
                  <span style={{
                    fontSize: "0.9rem",
                    color: cls.accent,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}>
                    {cls.name}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Row count */}
      {classes.length > 0 && (
        <p style={{
          textAlign: "center", marginTop: "0.75rem",
          fontSize: "0.82rem", color: "#9A7860",
        }}>
          {classes.length} {classes.length === 1 ? "class" : "classes"} on {activeDay}
          {activeDay === todayName && " · Today"}
        </p>
      )}

      {/* CTA strip */}
      <div style={{
        background: "linear-gradient(135deg, #F7941D 0%, #E07800 100%)",
        padding: "3rem 2rem", textAlign: "center",
        borderRadius: "1.25rem", marginTop: "2.5rem",
      }}>
        <h2 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(1.7rem, 4vw, 2.4rem)", fontWeight: 300,
          color: "#FFFFFF", margin: "0 0 10px",
        }}>
          Ready to join a class?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", marginBottom: 22 }}>
          Drop in any time — or get in touch to reserve your spot.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book?service=drop-in" className="cta-lift" style={{
            padding: "0.75rem 1.8rem", borderRadius: 999, background: "#FFFFFF",
            color: "#F7941D", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
            Book Now
          </Link>
          <Link href="/yoga-teacher-training" className="cta-lift" style={{
            padding: "0.75rem 1.8rem", borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.6)", color: "#FFFFFF",
            fontSize: "0.9rem", fontWeight: 400, textDecoration: "none" }}>
            Teacher Training
          </Link>
          <Link href="/sound-healing-therapy" className="cta-lift" style={{
            padding: "0.75rem 1.8rem", borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.6)", color: "#FFFFFF",
            fontSize: "0.9rem", fontWeight: 400, textDecoration: "none" }}>
            Sound Healing
          </Link>
        </div>
      </div>
    </div>
  );
}
