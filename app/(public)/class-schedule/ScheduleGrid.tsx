"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from "framer-motion";
import type { DBSession } from "@/lib/publicData";
import { resolveInstructor, styleToAccent } from "@/lib/publicData";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const DAY_MAP: Record<string,string> = {
  Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday",
  Fri:"Friday", Sat:"Saturday", Sun:"Sunday",
};

const FALLBACK: Record<string,{ time:string; name:string; level:string; duration:string; instructor:string; accent:string }[]> = {
  Sunday:[
    { time:"5:30 – 6:30 AM",          name:"Flexibility Yoga",           level:"All levels",   duration:"60 min",  instructor:"Baikuntha Paudel",      accent:"#F7941D" },
    { time:"6:30 – 7:30 AM",          name:"Ashtanga Vinyasa Yoga",      level:"Intermediate", duration:"60 min",  instructor:"Baikuntha Paudel",      accent:"#F7941D" },
    { time:"6:30 – 7:30 AM (Online)", name:"Asana & Meditation",         level:"All levels",   duration:"60 min",  instructor:"Sudha Rajouria",        accent:"#6B2D8B" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teacher's Training",    level:"Advanced",     duration:"150 min", instructor:"Dr. Chintamani Gautam", accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Soniya Shahi",          accent:"#F7941D" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teacher's Training",    level:"Advanced",     duration:"150 min", instructor:"Arjun Rakhal Magar",    accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Hatha Yoga",                 level:"All levels",   duration:"60 min",  instructor:"Love Thakur",           accent:"#F7941D" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Bhadra Rana",           accent:"#6B2D8B" },
  ],
  Monday:[
    { time:"5:30 – 6:30 AM",          name:"Hatha Yoga",                 level:"All levels",   duration:"60 min",  instructor:"Soniya Shahi",          accent:"#F7941D" },
    { time:"6:30 – 7:30 AM",          name:"Flexibility Yoga",           level:"All levels",   duration:"60 min",  instructor:"Soniya Shahi",          accent:"#F7941D" },
    { time:"6:30 – 7:30 AM (Online)", name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Kanchan Manandhar",     accent:"#F7941D" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Chintamani Gautam", accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Pranayama & Surya Namaskar", level:"All levels",   duration:"60 min",  instructor:"Sushmita Lama",         accent:"#6B2D8B" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Arjun Rakhal Magar",    accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Pranayama & Surya Namaskar", level:"All levels",   duration:"60 min",  instructor:"Baikuntha Paudel",      accent:"#6B2D8B" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Paribesh Malla",        accent:"#6B2D8B" },
  ],
  Tuesday:[
    { time:"5:30 – 6:30 AM",          name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Arjun Neupane",         accent:"#F7941D" },
    { time:"6:30 – 7:30 AM",          name:"Hatha Yoga",                 level:"All levels",   duration:"60 min",  instructor:"Arjun Neupane",         accent:"#F7941D" },
    { time:"6:30 – 7:30 AM (Online)", name:"Ashtanga Vinyasa",           level:"Intermediate", duration:"60 min",  instructor:"Soniya Shahi",          accent:"#F7941D" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Arjun Rakhal Magar",    accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Flexibility Yoga",           level:"All levels",   duration:"60 min",  instructor:"Biku Magar",            accent:"#F7941D" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Chintamani Gautam", accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Asana Flow & Meditation",    level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Sweta Thieng",          accent:"#6B2D8B" },
  ],
  Wednesday:[
    { time:"5:30 – 6:30 AM",          name:"Vinyasa Flow",               level:"All levels",   duration:"60 min",  instructor:"Neelina Nakarmi",       accent:"#F7941D" },
    { time:"6:30 – 7:30 AM",          name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Neelina Nakarmi",       accent:"#F7941D" },
    { time:"6:30 – 7:30 AM (Online)", name:"Hatha Yoga",                 level:"All levels",   duration:"60 min",  instructor:"Bandana Thapa",         accent:"#F7941D" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Dipika Hada",       accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Asana Flow & Meditation",    level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Geeta K.C",         accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Flexibility Yoga",           level:"All levels",   duration:"60 min",  instructor:"Biku Magar",            accent:"#F7941D" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
  ],
  Thursday:[
    { time:"5:30 – 6:30 AM",          name:"Pranayama & Surya Namaskar", level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"6:30 – 7:30 AM",          name:"Asana Flow & Meditation",    level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"6:30 – 7:30 AM (Online)", name:"Asana & Pranayama",          level:"All levels",   duration:"60 min",  instructor:"Sandhya Gyawali",       accent:"#6B2D8B" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Geeta K.C",         accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Ashtanga Vinyasa",           level:"Intermediate", duration:"60 min",  instructor:"Ushma Pandey",          accent:"#F7941D" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Dr. Dipika Hada",       accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Vinyasa Flow",               level:"All levels",   duration:"60 min",  instructor:"Manju Lama",            accent:"#F7941D" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Bandana Thapa",         accent:"#6B2D8B" },
  ],
  Friday:[
    { time:"5:30 – 6:30 AM",          name:"Asana Flow & Meditation",    level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"6:30 – 7:30 AM",          name:"Pranayama & Surya Namaskar", level:"All levels",   duration:"60 min",  instructor:"Arjun Rakhal Magar",    accent:"#6B2D8B" },
    { time:"6:30 – 7:30 AM (Online)", name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Mukesh Shrestha",       accent:"#F7941D" },
    { time:"6:30 – 9:00 AM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Arjun Neupane",         accent:"#4A6418" },
    { time:"9:30 – 10:30 AM",         name:"Hatha Yoga",                 level:"All levels",   duration:"60 min",  instructor:"Baikuntha Paudel",      accent:"#F7941D" },
    { time:"3:00 – 5:30 PM",          name:"Yoga Teachers Training",     level:"Advanced",     duration:"150 min", instructor:"Arjun Neupane",         accent:"#4A6418" },
    { time:"5:30 – 6:30 PM",          name:"Power Yoga",                 level:"Intermediate", duration:"60 min",  instructor:"Ushma Pandey",          accent:"#F7941D" },
    { time:"8:30 – 9:30 PM",          name:"Online Zoom Meditation",     level:"All levels",   duration:"60 min",  instructor:"Baikuntha Paudel",      accent:"#6B2D8B" },
  ],
  Saturday:[
    { time:"8:30 – 9:30 PM",          name:"Online Meditation",          level:"All levels",   duration:"60 min",  instructor:"Paribesh Malla",        accent:"#6B2D8B" },
  ],
};

function buildSchedule(sessions: DBSession[], instructorMap: Record<string,string>) {
  const map: typeof FALLBACK = {};
  for (const s of sessions) {
    const abbrs = Array.isArray(s.days) ? s.days : [];
    for (const abbr of abbrs) {
      const day = DAY_MAP[abbr] ?? abbr;
      if (!map[day]) map[day] = [];
      map[day].push({ time:s.startTime, name:s.name, level:s.level,
        duration:`${s.duration} min`, instructor:resolveInstructor(s.instructorId, instructorMap),
        accent:styleToAccent(s.styles) });
    }
  }
  for (const day of Object.keys(map)) map[day].sort((a,b)=>a.time.localeCompare(b.time));
  return map;
}

interface Props { sessions?: DBSession[]|null; instructorMap?: Record<string,string> }

/* ─── Spring config ─────────────────────────────────────────────────────────── */
const TILT_SPRING = { stiffness: 120, damping: 22 };
const ROW_VARIANTS = {
  hidden: { opacity:0, x:-24, filter:"blur(6px)" },
  show:   (i:number) => ({
    opacity:1, x:0, filter:"blur(0px)",
    transition:{ delay: i * 0.06, duration:0.38, ease:[0.25,0.46,0.45,0.94] as const },
  }),
  exit: { opacity:0, x:16, filter:"blur(4px)", transition:{ duration:0.22 } },
};

export default function ScheduleGrid({ sessions, instructorMap }: Props) {
  const map      = instructorMap || {};
  const schedule = sessions && sessions.length > 0 ? buildSchedule(sessions, map) : FALLBACK;

  const todayIdx  = new Date().getDay();
  const todayName = DAYS[todayIdx];
  const [activeDay, setActiveDay] = useState<string>(todayName);

  useEffect(() => { setActiveDay(DAYS[new Date().getDay()]); }, []);

  /* ── 3-D tilt tracking ─────────────────────────────────────────────────── */
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1,1],  [ 4,-4]), TILT_SPRING);
  const rotateY = useSpring(useTransform(rawX, [-1,1],  [-5, 5]), TILT_SPRING);
  const glowX   = useSpring(useTransform(rawX, [-1,1],  [10,90]), TILT_SPRING);
  const glowY   = useSpring(useTransform(rawY, [-1,1],  [10,90]), TILT_SPRING);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  };
  const onMouseLeave = () => { rawX.set(0); rawY.set(0); };

  const classes = schedule[activeDay] ?? [];

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"2rem 1rem 3rem" }}>

      {/* ── Day tabs ──────────────────────────────────────────────────────── */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem",
        justifyContent:"center", marginBottom:"2.25rem" }}>
        {DAYS.map((day) => {
          const isActive = activeDay === day;
          const isToday  = day === todayName;
          return (
            <motion.button
              key={day}
              onClick={() => setActiveDay(day)}
              whileHover={isActive ? {} : { y:-5, boxShadow:"0 12px 28px rgba(107,45,139,0.35)" }}
              whileTap={{ scale:0.93, y:0 }}
              transition={{ type:"spring", stiffness:420, damping:18 }}
              style={{
                padding:"0.48rem 1.2rem",
                borderRadius:999,
                border: isActive ? "none" : "1.5px solid rgba(107,45,139,0.3)",
                background: isActive
                  ? "linear-gradient(135deg,#4A1A72 0%,#3D1560 60%,#2E0F4A 100%)"
                  : isToday ? "rgba(107,45,139,0.09)" : "transparent",
                color: isActive ? "#FFFFFF" : "#6B2D8B",
                fontSize:"0.88rem",
                fontWeight: isActive ? 650 : isToday ? 500 : 400,
                cursor:"pointer",
                letterSpacing:"0.01em",
                position:"relative",
                boxShadow: isActive
                  ? "0 8px 24px rgba(61,21,96,0.45), inset 0 1px 0 rgba(255,255,255,0.12)"
                  : "0 2px 8px rgba(107,45,139,0.1)",
              }}
            >
              {day}
              {isToday && (
                <motion.span
                  layoutId="today-dot"
                  style={{
                    position:"absolute", bottom:-5, left:"50%",
                    transform:"translateX(-50%)",
                    width:5, height:5, borderRadius:"50%",
                    background: isActive ? "#F7941D" : "#6B2D8B",
                    boxShadow: isActive ? "0 0 6px #F7941D" : "none",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── 3-D table card ────────────────────────────────────────────────── */}
      <div style={{ perspective:"1400px" }}>
        <motion.div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            rotateX, rotateY,
            borderRadius:"1rem",
            overflow:"hidden",
            boxShadow:"0 20px 60px rgba(61,21,96,0.2), 0 4px 16px rgba(61,21,96,0.12)",
            border:"1px solid rgba(107,45,139,0.22)",
            position:"relative",
          }}
          transition={{ type:"spring", ...TILT_SPRING }}
        >
          {/* Specular gloss that follows the mouse */}
          <motion.div
            style={{
              position:"absolute", inset:0, pointerEvents:"none", zIndex:10,
              background: useTransform(
                [glowX, glowY] as const,
                ([x,y]: number[]) =>
                  `radial-gradient(ellipse 60% 40% at ${x}% ${y}%,rgba(255,255,255,0.07) 0%,transparent 70%)`
              ),
            }}
          />

          {/* Header */}
          <div style={{
            display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
            padding:"1rem 1.5rem",
            background:"linear-gradient(135deg, #4A1A72 0%, #3D1560 50%, #2E0F4A 100%)",
            position:"relative", overflow:"hidden",
          }}>
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x:["−100%","200%"] }}
              transition={{ duration:3.5, repeat:Infinity, repeatDelay:4, ease:"easeInOut" }}
              style={{
                position:"absolute", top:0, bottom:0, width:"40%",
                background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",
                pointerEvents:"none",
              }}
            />
            {["Time","Teacher","Class Type"].map((h) => (
              <span key={h} style={{
                color:"#FFFFFF", fontSize:"1rem", fontWeight:650,
                letterSpacing:"0.07em", textTransform:"uppercase",
                fontFamily:"Cormorant Garamond, serif",
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          <AnimatePresence mode="wait">
            <motion.div key={activeDay}>
              {classes.length === 0 ? (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ textAlign:"center", padding:"3.5rem 1rem",
                    color:"#9A7860", background:"#FFFFFF" }}>
                  <p style={{ fontSize:"2rem", marginBottom:8 }}>🌿</p>
                  <p>No classes scheduled for {activeDay}.</p>
                </motion.div>
              ) : (
                classes.map((cls, i) => {
                  const isEven   = i % 2 === 0;
                  const bookHref = `/book?service=drop-in&cls=${encodeURIComponent(`${activeDay}|${cls.time}|${cls.name}|${cls.instructor}`)}`;
                  return (
                    <motion.div
                      key={`${activeDay}-${i}`}
                      custom={i}
                      variants={ROW_VARIANTS}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      whileHover={{
                        x: 6,
                        backgroundColor: "rgba(247,148,29,0.055)",
                        boxShadow: `inset 4px 0 0 ${cls.accent}`,
                        transition:{ duration:0.18 },
                      }}
                      style={{
                        display:"grid", gridTemplateColumns:"1fr 1fr 1fr",
                        padding:"0.95rem 1.5rem",
                        background: isEven ? "#FFFFFF" : "rgba(249,245,255,0.6)",
                        borderTop:"1px solid rgba(107,45,139,0.09)",
                        cursor:"pointer",
                        position:"relative",
                      }}
                    >
                      <Link href={bookHref} style={{ display:"contents", textDecoration:"none" }}>
                        <span style={{ fontSize:"0.9rem", color:"#2A1208",
                          fontWeight:500, lineHeight:1.45 }}>
                          {cls.time}
                        </span>
                        <span style={{ fontSize:"0.9rem", color:"#4A3020", lineHeight:1.45 }}>
                          {cls.instructor}
                        </span>
                        <motion.span
                          style={{ fontSize:"0.9rem", color:cls.accent,
                            fontWeight:600, lineHeight:1.45 }}
                          whileHover={{ letterSpacing:"0.03em" }}
                          transition={{ duration:0.2 }}
                        >
                          {cls.name}
                        </motion.span>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Row count */}
      {classes.length > 0 && (
        <motion.p
          key={activeDay}
          initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3 }}
          style={{ textAlign:"center", marginTop:"0.75rem",
            fontSize:"0.82rem", color:"#9A7860" }}
        >
          {classes.length} {classes.length === 1 ? "class" : "classes"} on {activeDay}
          {activeDay === todayName && " · Today"}
        </motion.p>
      )}

      {/* CTA strip */}
      <motion.div
        initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.5, ease:"easeOut" }}
        style={{
          background:"linear-gradient(135deg,#F7941D 0%,#E07800 100%)",
          padding:"3rem 2rem", textAlign:"center",
          borderRadius:"1.25rem", marginTop:"2.5rem",
          boxShadow:"0 16px 48px rgba(247,148,29,0.3)",
        }}
      >
        <h2 style={{ fontFamily:"Cormorant Garamond, serif",
          fontSize:"clamp(1.7rem,4vw,2.4rem)", fontWeight:300,
          color:"#FFFFFF", margin:"0 0 10px" }}>
          Ready to join a class?
        </h2>
        <p style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.95rem", marginBottom:22 }}>
          Drop in any time — or get in touch to reserve your spot.
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { href:"/book?service=drop-in", label:"Book Now",
              style:{ background:"#FFFFFF", color:"#F7941D", fontWeight:600 } },
            { href:"/yoga-teacher-training", label:"Teacher Training",
              style:{ border:"2px solid rgba(255,255,255,0.6)", color:"#FFFFFF" } },
            { href:"/sound-healing-therapy", label:"Sound Healing",
              style:{ border:"2px solid rgba(255,255,255,0.6)", color:"#FFFFFF" } },
          ].map(b => (
            <motion.div key={b.label} whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.97 }}
              transition={{ type:"spring", stiffness:380, damping:18 }}>
              <Link href={b.href} style={{
                display:"block", padding:"0.75rem 1.8rem", borderRadius:999,
                fontSize:"0.9rem", fontWeight:400, textDecoration:"none", ...b.style }}>
                {b.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
