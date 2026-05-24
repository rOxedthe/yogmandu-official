"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { DBSession } from "@/lib/publicData";
import { resolveInstructor, styleToAccent } from "@/lib/publicData";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Day abbreviation map
const DAY_MAP: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

// ── Hardcoded fallback (used when Supabase is not configured) ─────────────────
const FALLBACK: Record<string, { time: string; name: string; level: string; duration: string; instructor: string; accent: string }[]> = {
  Monday:    [
    { time: "06:30", name: "Morning Hatha Flow",     level: "All levels",   duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "09:00", name: "Pranayama & Meditation", level: "All levels",   duration: "60 min",  instructor: "Arjun Neupane",      accent: "#6B2D8B" },
    { time: "17:00", name: "Vinyasa Flow",            level: "Intermediate", duration: "75 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "19:00", name: "Restorative Yoga",        level: "All levels",   duration: "60 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Tuesday:   [
    { time: "06:30", name: "Ashtanga Primary Series",level: "Intermediate", duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "10:00", name: "Sound Healing Session",  level: "All levels",   duration: "60 min",  instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
    { time: "17:30", name: "Yin Yoga",               level: "All levels",   duration: "75 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Wednesday: [
    { time: "06:30", name: "Morning Hatha Flow",     level: "All levels",   duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "09:00", name: "Pranayama & Meditation", level: "All levels",   duration: "60 min",  instructor: "Arjun Neupane",      accent: "#6B2D8B" },
    { time: "11:00", name: "Tibetan Bowl Healing",   level: "All levels",   duration: "90 min",  instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
    { time: "17:00", name: "Vinyasa Flow",            level: "Intermediate", duration: "75 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "19:00", name: "Yoga Nidra",              level: "All levels",   duration: "45 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Thursday:  [
    { time: "06:30", name: "Ashtanga Primary Series",level: "Intermediate", duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "09:00", name: "Pranayama & Breathwork", level: "All levels",   duration: "60 min",  instructor: "Arjun Neupane",      accent: "#6B2D8B" },
    { time: "17:30", name: "Yin & Yang Yoga",         level: "All levels",   duration: "90 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Friday:    [
    { time: "06:30", name: "Morning Hatha Flow",     level: "All levels",   duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "10:00", name: "Sound Healing Session",  level: "All levels",   duration: "60 min",  instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
    { time: "17:00", name: "Vinyasa Flow",            level: "Intermediate", duration: "75 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "19:00", name: "Restorative & Nidra",     level: "All levels",   duration: "75 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Saturday:  [
    { time: "07:00", name: "Weekend Ashtanga",       level: "All levels",   duration: "120 min", instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "10:00", name: "Group Sound Healing",    level: "All levels",   duration: "90 min",  instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
    { time: "16:00", name: "Gentle Yoga & Stretch",  level: "Beginner",     duration: "60 min",  instructor: "Arjun Neupane",      accent: "#8DC63F" },
  ],
  Sunday:    [
    { time: "07:30", name: "Sunrise Meditation",     level: "All levels",   duration: "45 min",  instructor: "Arjun Neupane",      accent: "#6B2D8B" },
    { time: "09:00", name: "Slow Flow Hatha",         level: "All levels",   duration: "90 min",  instructor: "Arjun Rakhal Magar", accent: "#F7941D" },
    { time: "15:00", name: "Tibetan Bowl Healing",   level: "All levels",   duration: "90 min",  instructor: "Dr. Chintamani Gautam", accent: "#6B2D8B" },
  ],
};

// ── Convert DB sessions → schedule map ────────────────────────────────────────
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

const levelColor = (level: string) => {
  if (level === "Beginner")     return { bg: "rgba(141,198,63,0.1)",  text: "#5A7A20",  border: "rgba(141,198,63,0.3)" };
  if (level === "Intermediate") return { bg: "rgba(247,148,29,0.1)",  text: "#B86010",  border: "rgba(247,148,29,0.3)" };
  return                               { bg: "rgba(107,45,139,0.08)", text: "#6B2D8B",  border: "rgba(107,45,139,0.2)" };
};

function ScheduleCard({ cls, day }: {
  cls: { time: string; name: string; level: string; duration: string; instructor: string; accent: string };
  day: string;
}) {
  const lc = levelColor(cls.level);
  const cls_param = encodeURIComponent(`${day}|${cls.time}|${cls.name}|${cls.instructor}`);
  const bookHref = `/book?service=drop-in&cls=${cls_param}`;

  return (
    <Link href={bookHref} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          padding: "1.25rem 1.4rem",
          borderRadius: "1rem",
          border: `1.5px solid ${cls.accent}20`,
          background: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(42,18,8,0.05)",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = `0 10px 32px ${cls.accent}33`;
          el.style.borderColor = `${cls.accent}55`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 2px 12px rgba(42,18,8,0.05)";
          el.style.borderColor = `${cls.accent}20`;
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${cls.accent}, ${cls.accent}44)` }} />
        <div style={{ fontSize: "1.1rem", fontFamily: "Cormorant Garamond, serif",
          fontWeight: 400, color: cls.accent, marginBottom: 6, marginTop: 4 }}>
          {cls.time}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 500, color: "#2A1208", marginBottom: 8, lineHeight: 1.3 }}>
          {cls.name}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, padding: "2px 10px", borderRadius: 999,
            background: lc.bg, color: lc.text, border: `1px solid ${lc.border}` }}>
            {cls.level}
          </span>
          <span style={{ fontSize: "0.72rem", color: "#7A5840", display: "flex", alignItems: "center", gap: 3 }}>
            ⏱ {cls.duration}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.78rem", color: "#7A5840" }}>👤 {cls.instructor}</div>
          <span style={{
            fontSize: "0.7rem", fontWeight: 600, color: "#fff",
            background: cls.accent, padding: "3px 10px", borderRadius: 999,
            letterSpacing: "0.05em",
          }}>
            Book
          </span>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  sessions?:     DBSession[] | null;
  instructorMap?: Record<string, string>;
}

export default function ScheduleGrid({ sessions, instructorMap }: Props) {
  const map = instructorMap || {};
  const schedule = sessions && sessions.length > 0 ? buildSchedule(sessions, map) : FALLBACK;

  // Default to today's day name
  const todayIndex = new Date().getDay(); // 0=Sun … 6=Sat
  const todayName  = DAYS[todayIndex];    // e.g. "Saturday"

  // activeDay: null = show ALL days
  const [activeDay, setActiveDay] = useState<string | null>(todayName);

  // Recalculate today if component mounts after midnight (rare but clean)
  useEffect(() => {
    setActiveDay(DAYS[new Date().getDay()]);
  }, []);

  const visibleDays = activeDay ? [activeDay] : DAYS;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2rem 3rem" }}>

      {/* ── Day filter pills ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        justifyContent: "center",
        marginBottom: "2.5rem",
        padding: "1.5rem 1rem",
        background: "#F9F5FF",
        borderRadius: "1.25rem",
        border: "1px solid rgba(107,45,139,0.1)",
      }}>
        {/* "All" pill */}
        <button
          onClick={() => setActiveDay(null)}
          style={{
            padding: "0.55rem 1.35rem",
            borderRadius: 999,
            border: activeDay === null
              ? "none"
              : "1.5px solid rgba(107,45,139,0.25)",
            background: activeDay === null ? "#3D1560" : "transparent",
            color: activeDay === null ? "#FFFFFF" : "#6B2D8B",
            fontSize: "0.85rem",
            fontWeight: activeDay === null ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => {
            if (activeDay !== null)
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(107,45,139,0.07)";
          }}
          onMouseLeave={e => {
            if (activeDay !== null)
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          All Days
        </button>

        {/* One pill per day */}
        {DAYS.map((day, i) => {
          const isActive  = activeDay === day;
          const isToday   = day === todayName;
          const hasClasses = !!(schedule[day] && schedule[day].length > 0);

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              disabled={!hasClasses}
              style={{
                padding: "0.55rem 1.35rem",
                borderRadius: 999,
                border: isActive
                  ? "none"
                  : "1.5px solid rgba(107,45,139,0.25)",
                background: isActive
                  ? "#3D1560"
                  : isToday
                    ? "rgba(107,45,139,0.08)"
                    : "transparent",
                color: isActive
                  ? "#FFFFFF"
                  : hasClasses ? "#6B2D8B" : "rgba(107,45,139,0.3)",
                fontSize: "0.85rem",
                fontWeight: isActive ? 600 : isToday ? 500 : 400,
                cursor: hasClasses ? "pointer" : "default",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
                position: "relative",
                opacity: hasClasses ? 1 : 0.45,
              }}
              onMouseEnter={e => {
                if (!isActive && hasClasses)
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(107,45,139,0.12)";
              }}
              onMouseLeave={e => {
                if (!isActive && hasClasses)
                  (e.currentTarget as HTMLButtonElement).style.background = isToday
                    ? "rgba(107,45,139,0.08)"
                    : "transparent";
              }}
            >
              {DAY_ABBR[i]}
              {isToday && (
                <span style={{
                  position: "absolute",
                  bottom: -2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: isActive ? "#8DC63F" : "#6B2D8B",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active day label (single-day view) ── */}
      {activeDay && (
        <div style={{
          textAlign: "center",
          marginBottom: "1.75rem",
        }}>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 300,
            color: "#2A1208",
            margin: 0,
          }}>
            {activeDay}
            {activeDay === todayName && (
              <span style={{
                marginLeft: 12,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#8DC63F",
                background: "rgba(141,198,63,0.12)",
                border: "1px solid rgba(141,198,63,0.3)",
                borderRadius: 999,
                padding: "3px 12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                verticalAlign: "middle",
              }}>
                Today
              </span>
            )}
          </h2>
          {schedule[activeDay] && (
            <p style={{ fontSize: "0.82rem", color: "#9A7860", marginTop: 4 }}>
              {schedule[activeDay].length} {schedule[activeDay].length === 1 ? "class" : "classes"} scheduled
            </p>
          )}
        </div>
      )}

      {/* ── Schedule content ── */}
      {visibleDays.map(day => {
        const classes = schedule[day];
        if (!classes || classes.length === 0) return null;
        return (
          <div key={day} style={{ marginBottom: activeDay ? "0" : "2.5rem" }}>
            {/* Day header — only shown in "All" mode */}
            {!activeDay && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem",
                  fontWeight: 400, color: "#2A1208", margin: 0 }}>
                  {day}
                </h2>
                <div style={{ flex: 1, height: 1, background: "rgba(107,45,139,0.1)" }} />
                <span style={{ fontSize: "0.7rem", color: "#9A7860", letterSpacing: "0.12em" }}>
                  {classes.length} {classes.length === 1 ? "class" : "classes"}
                </span>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
              {classes.map((cls, i) => <ScheduleCard key={i} cls={cls} day={day} />)}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {activeDay && (!schedule[activeDay] || schedule[activeDay].length === 0) && (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          color: "#9A7860", fontSize: "1rem",
        }}>
          <p style={{ fontSize: "2rem", marginBottom: 12 }}>🌿</p>
          <p>No classes scheduled for {activeDay}.</p>
          <p style={{ fontSize: "0.85rem", marginTop: 8 }}>Try another day or view all sessions.</p>
        </div>
      )}

      {/* CTA strip */}
      <div style={{
        background: "linear-gradient(135deg, #F7941D 0%, #E07800 100%)",
        padding: "3.5rem 2rem", textAlign: "center",
        borderRadius: "1.5rem", marginTop: "3rem",
      }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 300,
          color: "#FFFFFF", margin: "0 0 12px" }}>
          Ready to join a class?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", marginBottom: 24 }}>
          Drop in any time — or get in touch to reserve your spot.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book?service=drop-in" className="cta-lift" style={{
            padding: "0.8rem 2rem", borderRadius: 999, background: "#FFFFFF",
            color: "#F7941D", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>
            Book Now
          </Link>
          <Link href="/yoga-teacher-training" className="cta-lift" style={{
            padding: "0.8rem 2rem", borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.6)", color: "#FFFFFF",
            fontSize: "0.9rem", fontWeight: 400, textDecoration: "none" }}>
            Teacher Training
          </Link>
          <Link href="/sound-healing-therapy" className="cta-lift" style={{
            padding: "0.8rem 2rem", borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.6)", color: "#FFFFFF",
            fontSize: "0.9rem", fontWeight: 400, textDecoration: "none" }}>
            Sound Healing
          </Link>
        </div>
      </div>
    </div>
  );
}
