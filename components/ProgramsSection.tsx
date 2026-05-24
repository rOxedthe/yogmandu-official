"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── 3-D Background ── */
function Ring({ pos, r, thick, color, sx, sz, op }: {
  pos:[number,number,number]; r:number; thick:number; color:string; sx:number; sz:number; op:number;
}) {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!m.current) return;
    m.current.rotation.x += sx;
    m.current.rotation.z += sz;
    m.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 0.4 + pos[0]) * 0.28;
  });
  return (
    <mesh ref={m} position={pos}>
      <torusGeometry args={[r, thick, 20, 80]} />
      <meshStandardMaterial color={color} transparent opacity={op} roughness={0.1} metalness={0.75} />
    </mesh>
  );
}
function Knot({ pos, color, s=1 }: { pos:[number,number,number]; color:string; s?:number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.rotation.y = clock.elapsedTime * 0.09;
    g.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 0.28) * 0.2;
  });
  return (
    <group ref={g} position={pos} scale={s}>
      <mesh><torusKnotGeometry args={[0.5,0.14,200,20,2,3]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} roughness={0.05} metalness={0.85} />
      </mesh>
    </group>
  );
}
function BgScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3,4,3]}   intensity={2.2} color="#F7941D" />
      <pointLight position={[-4,-2,3]} intensity={1.6} color="#6B2D8B" />
      <pointLight position={[0,5,1]}   intensity={1.0} color="#8DC63F" />
      {/* Left orange chakra */}
      <Ring pos={[-4.8,0,-2]}   r={1.7} thick={0.08} color="#F7941D" sx={0.012} sz={0.008} op={0.6} />
      <Ring pos={[-4.8,0,-2]}   r={1.1} thick={0.06} color="#F7941D" sx={-0.009} sz={0.013} op={0.4} />
      <Ring pos={[-4.8,0,-2]}   r={0.6} thick={0.05} color="#F7941D" sx={0.016} sz={-0.01} op={0.25} />
      {/* Right purple chakra */}
      <Ring pos={[4.8,0.3,-2]}  r={1.5} thick={0.08} color="#6B2D8B" sx={0.01}  sz={0.007} op={0.6} />
      <Ring pos={[4.8,0.3,-2]}  r={0.9} thick={0.06} color="#6B2D8B" sx={-0.013} sz={0.01} op={0.4} />
      <Ring pos={[4.8,0.3,-2]}  r={0.5} thick={0.04} color="#6B2D8B" sx={0.018} sz={-0.009} op={0.25} />
      {/* Top green */}
      <Ring pos={[0.5,3.2,-3.5]} r={1.0} thick={0.07} color="#8DC63F" sx={0.008} sz={0.012} op={0.55} />
      <Ring pos={[0.5,3.2,-3.5]} r={0.6} thick={0.05} color="#8DC63F" sx={-0.011} sz={0.008} op={0.35} />
      {/* Knots */}
      <Knot pos={[-5.5,-1.5,-4]} color="#F7941D" s={1.1} />
      <Knot pos={[5.5,1.8,-4.5]} color="#6B2D8B" s={0.9} />
    </>
  );
}

/* ── Card data ── */
const CARDS = [
  {
    accent:"#6B2D8B", shadow:"rgba(107,45,139,0.45)", label:"RYS 200 · 28 Days",
    title:"200hr Teacher Training",
    desc:"The complete foundation. Yoga Alliance RYS 200 certified — Hatha, Ashtanga, philosophy, anatomy, pranayama and the full art of teaching yoga.",
    features:["Yoga Alliance RYS 200","Daily asana & pranayama","Himalayan philosophy","Groups of 8–12"],
    cta:"View Program", href:"/yoga-teacher-training",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  },
  {
    accent:"#3D1560", shadow:"rgba(61,21,96,0.45)", label:"RYS 300 · Advanced",
    title:"300hr Advanced Training",
    desc:"Deepen mastery. For certified 200hr teachers ready to step into advanced asana, subtle body science, Sanskrit chanting and professional teaching mentorship.",
    features:["Yoga Alliance RYS 300","Advanced asana & alignment","Sanskrit & Vedic philosophy","1-on-1 teaching mentorship"],
    cta:"View Program", href:"/yoga-teacher-training",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    accent:"#F7941D", shadow:"rgba(247,148,29,0.45)", label:"Individual · Group",
    title:"Sound Healing Sessions",
    desc:"Enter stillness. Authentic Tibetan singing bowl sessions — vibrational medicine practiced for centuries in the Himalayas. Individual and group formats available.",
    features:["Tibetan singing bowls","Individual & group sessions","Chakra alignment work","Stress & anxiety relief"],
    cta:"Book a Session", href:"/sound-healing-therapy",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="9"/><path d="M8 12a4 4 0 0 1 8 0"/><path d="M5.5 12a6.5 6.5 0 0 1 13 0"/></svg>,
  },
  {
    accent:"#C47A1E", shadow:"rgba(196,122,30,0.45)", label:"Certification Program",
    title:"Sound Healing Certification",
    desc:"Become a practitioner. Learn the full science of therapeutic sound — bowl tuning, chakra mapping, session design and client facilitation in an immersive certification course.",
    features:["Full certification awarded","Bowl tuning & technique","Session design & practice","Client facilitation skills"],
    cta:"Learn More", href:"/sound-healing-therapy",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    accent:"#8DC63F", shadow:"rgba(141,198,63,0.45)", label:"7-Day · Immersive",
    title:"Meditation & Pranayama",
    desc:"Return to breath. A dedicated 7-day retreat in the breathing techniques and meditation lineages of Nepal — stillness as a practice, not a side-note.",
    features:["Pranayama lineage techniques","Meditation & dharana","Silent practice sessions","Himalayan retreat setting"],
    cta:"View Retreat", href:"/yoga-teacher-training",
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
];

/* ── 3-D Coverflow Carousel ── */
export default function ProgramsSection() {
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => Math.max(0, i - 1));
  const next = () => setActive(i => Math.min(CARDS.length - 1, i + 1));

  /* keyboard nav */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* auto-advance */
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % CARDS.length), 5500);
    return () => clearInterval(t);
  }, []);

  /* per-card 3-D transform — only compositor-friendly props (no filter/blur) */
  const cardStyle = (i: number): React.CSSProperties => {
    const off    = i - active;
    const absOff = Math.abs(off);
    const rotY   = Math.max(-50, Math.min(50, off * 35));
    const tx     = off * 480;
    const scale  = Math.max(0.62, 1 - absOff * 0.14);
    const op     = Math.max(0, 1 - absOff * 0.42);
    const zIdx   = 20 - Math.round(absOff * 5);
    return {
      position: "absolute",
      top: 0,
      left: "calc(50% - 210px)",
      width: 420,
      // perspective comes from parent container — don't repeat it here
      transform: `translateX(${tx}px) rotateY(${rotY}deg) scale(${scale})`,
      opacity: op,
      zIndex: zIdx,
      pointerEvents: absOff > 1.5 ? "none" : "auto",
      transition: "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      cursor: absOff > 0.4 ? "pointer" : "default",
    };
  };

  return (
    <section style={{ background:"#F9F5FF", position:"relative", overflow:"hidden", padding:"6rem 0" }}>

      {/* 3-D canvas */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <Canvas camera={{ position:[0,0,7], fov:46 }} gl={{ alpha:true, antialias:true }}
          style={{ width:"100%", height:"100%" }}>
          <BgScene />
        </Canvas>
      </div>
      {/* vignette */}
      <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 70% at 50% 50%, rgba(249,245,255,0.1) 0%, rgba(249,245,255,0.82) 100%)" }} />

      {/* Content */}
      <div style={{ position:"relative", zIndex:2 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"3rem", padding:"0 1.5rem" }}>
          <p style={{ fontSize:"0.95rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"#F7941D", marginBottom:10 }}>Our Offerings</p>
          <h2 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"clamp(2rem,5vw,3.2rem)",
            fontWeight:300, color:"#2A1208", margin:0 }}>
            Begin your <em style={{ color:"#6B2D8B" }}>transformation</em>
          </h2>
          <div style={{ width:48, height:2, background:"linear-gradient(90deg,#6B2D8B,#F7941D)", margin:"1rem auto 0" }} />
        </div>

        {/* Carousel viewport */}
        <div style={{
          position:"relative", height:560,
          perspective:"1400px",
          perspectiveOrigin:"50% 40%",
          overflow:"hidden",
          WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          maskImage:"linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}>
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={cardStyle(i)}
              onClick={() => { if (i !== active) setActive(i); }}
            >
              <div style={{
                borderRadius:"1.75rem",
                overflow:"hidden",
                background:"rgba(255,255,255,0.9)",
                backdropFilter:"blur(16px)",
                border:`1.5px solid ${card.accent}30`,
                boxShadow:`0 24px 64px ${card.shadow}, 0 0 0 1px ${card.accent}18`,
                padding:"2.25rem 2.25rem 2rem",
                position:"relative",
                height:"100%",
              }}>
                {/* Top stripe */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:4,
                  background:`linear-gradient(90deg,${card.accent},${card.accent}55)` }} />
                {/* Corner glow */}
                <div style={{ position:"absolute", top:0, right:0, width:160, height:160, pointerEvents:"none",
                  background:`radial-gradient(circle at 100% 0%,${card.accent}18 0%,transparent 65%)`,
                  borderRadius:"0 1.75rem 0 0" }} />
                {/* Label badge */}
                <div style={{ position:"absolute", top:14, right:18,
                  fontSize:"0.95rem", letterSpacing:"0.18em", textTransform:"uppercase",
                  color:card.accent, background:`${card.accent}12`, border:`1px solid ${card.accent}30`,
                  borderRadius:999, padding:"3px 10px" }}>
                  {card.label}
                </div>

                {/* Icon */}
                <div style={{ width:50, height:50, borderRadius:"50%", display:"flex",
                  alignItems:"center", justifyContent:"center", marginBottom:18,
                  background:`${card.accent}12`, border:`1px solid ${card.accent}22`, color:card.accent }}>
                  {card.icon}
                </div>

                <h3 style={{ fontFamily:"Cormorant Garamond, serif", fontSize:"1.8rem",
                  fontWeight:300, color:"#2A1208", marginBottom:10 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize:"1rem", lineHeight:1.75, color:"#4A2E1A",
                  fontWeight:400, marginBottom:18 }}>
                  {card.desc}
                </p>
                <ul style={{ listStyle:"none", padding:0, margin:"0 0 1.5rem",
                  display:"flex", flexDirection:"column", gap:9 }}>
                  {card.features.map(f => (
                    <li key={f} style={{ display:"flex", alignItems:"center", gap:9,
                      fontSize:"1rem", fontWeight:400, color:"#3D2015" }}>
                      <span style={{ width:17, height:17, borderRadius:"50%",
                        background:`${card.accent}15`, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0 }}>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L5 8.5 2 5.5" stroke={card.accent} strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={card.href} className="cta-lift" style={{
                  display:"inline-block", padding:"0.65rem 1.5rem", borderRadius:999,
                  background:card.accent, color:"#fff", fontSize:"1rem", fontWeight:500,
                  boxShadow:`0 8px 24px ${card.shadow}`,
                }}>
                  {card.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginTop:32, padding:"0 1.5rem" }}>
          {/* Prev / Next arrows */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button
              onClick={prev} disabled={active === 0}
              aria-label="Previous program"
              style={{ width:44, height:44, borderRadius:"50%", border:"1.5px solid rgba(107,45,139,0.25)",
                background:"rgba(255,255,255,0.8)", display:"flex", alignItems:"center", justifyContent:"center",
                cursor:active===0?"not-allowed":"pointer", opacity:active===0?0.35:1,
                backdropFilter:"blur(8px)", transition:"all 0.25s",
                boxShadow:"0 4px 16px rgba(107,45,139,0.12)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Dot indicators */}
            <div style={{ display:"flex", gap:8 }}>
              {CARDS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  style={{ width:i===active?28:8, height:8, borderRadius:999, border:"none",
                    background:i===active?"#F7941D":"rgba(107,45,139,0.2)",
                    cursor:"pointer", transition:"all 0.35s ease", padding:0 }}
                />
              ))}
            </div>

            <button
              onClick={next} disabled={active === CARDS.length - 1}
              aria-label="Next program"
              style={{ width:44, height:44, borderRadius:"50%", border:"1.5px solid rgba(107,45,139,0.25)",
                background:"rgba(255,255,255,0.8)", display:"flex", alignItems:"center", justifyContent:"center",
                cursor:active===CARDS.length-1?"not-allowed":"pointer", opacity:active===CARDS.length-1?0.35:1,
                backdropFilter:"blur(8px)", transition:"all 0.25s",
                boxShadow:"0 4px 16px rgba(107,45,139,0.12)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Card counter */}
          <p style={{ fontSize:"0.85rem", letterSpacing:"0.18em", color:"rgba(42,18,8,0.3)", textTransform:"uppercase" }}>
            {active+1} / {CARDS.length} · use ← → keys
          </p>
        </div>
      </div>
    </section>
  );
}
