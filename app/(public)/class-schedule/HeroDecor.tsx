"use client";
import { useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Interactive 3-D decorative layer for the Class Schedule hero.
 * Extracted into a client component so Framer Motion can run here
 * while the parent (page.tsx) stays a server component.
 *
 * Elements:
 *  • OM symbol  — mouse-tracked 3-D perspective tilt + pulsing glow
 *  • Large lotus — parallax shift + rotateZ tilt + breathing scale
 *  • Small lotus — opposite-direction parallax + continuous spin + float
 */
export default function HeroDecor() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── mouse tracking ─────────────────────────────────────────── */
  const rawX = useMotionValue(0.5); // 0 = far-left, 1 = far-right
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 28, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 28, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Only respond while the cursor is over the hero area
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      rawX.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      rawY.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    };
    const onLeave = () => { rawX.set(0.5); rawY.set(0.5); };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Centered range: −0.5 … +0.5
  const cx = useTransform(springX, [0, 1], [-0.5, 0.5]);
  const cy = useTransform(springY, [0, 1], [-0.5, 0.5]);

  /* ── derived motion values ──────────────────────────────────── */
  // OM: large, dramatic — 3-D perspective tilt driven by mouse
  const omX      = useTransform(cx, [-0.5, 0.5], [-32, 32]);
  const omY      = useTransform(cy, [-0.5, 0.5], [-18, 18]);
  const omRotY   = useTransform(cx, [-0.5, 0.5], [-30, 30]); // Y-axis spin feel
  const omRotX   = useTransform(cy, [-0.5, 0.5], [ 15, -15]); // tilt up/down

  // Large lotus: moderate shift, same direction
  const llX    = useTransform(cx, [-0.5, 0.5], [-16, 16]);
  const llY    = useTransform(cy, [-0.5, 0.5], [  8, -8]);
  const llRotZ = useTransform(cx, [-0.5, 0.5], [ 14, -14]);

  // Small lotus: opposite direction (parallax depth cue)
  const slX = useTransform(cx, [-0.5, 0.5], [24, -24]);
  const slY = useTransform(cy, [-0.5, 0.5], [-18, 18]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", overflow: "hidden",
      }}
    >
      {/* ═══════════════════════════════════════════════════
          OM SYMBOL  ॐ
          ═══════════════════════════════════════════════════ */}
      <motion.div
        style={{
          position: "absolute", top: "18%", left: "8%",
          fontSize: "clamp(80px,10vw,140px)",
          fontFamily: "serif", lineHeight: 1, userSelect: "none",
          color: "#F7941D",
          x: omX, y: omY,
          rotateY: omRotY,
          rotateX: omRotX,
          transformPerspective: 900,
        }}
        animate={{ opacity: [0.10, 0.32, 0.10], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {/* Radial aura — pulses in sync with the symbol */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-45%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(247,148,29,0.35) 0%, transparent 65%)",
          }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.85, 1.18, 0.85] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        ॐ
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          LARGE LOTUS — bottom-left
          breathing scale + parallax tilt
          ═══════════════════════════════════════════════════ */}
      <motion.div
        style={{
          position: "absolute", bottom: -30, left: "6%",
          x: llX, y: llY, rotateZ: llRotZ,
          transformPerspective: 700,
        }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="220" height="220" viewBox="0 0 220 220"
          style={{
            display: "block",
            filter: "drop-shadow(0 0 20px rgba(247,148,29,0.45))",
          }}
        >
          {[0,45,90,135,180,225,270,315].map(d => (
            <ellipse
              key={d} cx="110" cy="60" rx="22" ry="62"
              fill="#F7941D" opacity="0.7"
              transform={`rotate(${d} 110 110)`}
            />
          ))}
          <circle cx="110" cy="110" r="14" fill="#8DC63F" />
        </svg>
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          SMALL LOTUS — top-right
          slow continuous spin + bob + parallax position
          ═══════════════════════════════════════════════════ */}
      <motion.div
        style={{
          position: "absolute", top: "12%", right: "7%",
          x: slX, y: slY,
          transformPerspective: 600,
        }}
        animate={{
          rotate: 360,               // full continuous spin
          opacity: [0.16, 0.30, 0.16],
          scale:   [1, 1.12, 1],
        }}
        transition={{
          rotate:  { duration: 22, repeat: Infinity, ease: "linear" },
          opacity: { duration: 6,  repeat: Infinity, ease: "easeInOut" },
          scale:   { duration: 6,  repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <svg
          width="120" height="120" viewBox="0 0 120 120"
          style={{
            display: "block",
            filter: "drop-shadow(0 0 14px rgba(141,198,63,0.55))",
          }}
        >
          {[0,60,120,180,240,300].map(d => (
            <ellipse
              key={d} cx="60" cy="28" rx="14" ry="36"
              fill="#8DC63F" opacity="0.7"
              transform={`rotate(${d} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="9" fill="#F7941D" />
        </svg>
      </motion.div>
    </div>
  );
}
