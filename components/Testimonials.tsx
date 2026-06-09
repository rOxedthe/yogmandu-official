"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("@/components/TestimonialsBackground3D"), {
  ssr: false,
  loading: () => null,
});

const testimonials = [
  {
    quote: "Yoga helped me attain a flexible body, a fresh mind, and positive thinking. The teachers at Yogmandu are incredibly supportive and knowledgeable.",
    name: "Sabnam Shahi",
    origin: "Nepal",
    flag: "🇳🇵",
    program: "Yoga Classes",
    stars: 5,
    color: "#F7941D",
  },
  {
    quote: "Yoga helped me attain a flexible body, a fresh mind, and positive thinking. I feel completely transformed after joining Yogmandu.",
    name: "Pawan Kumar BK",
    origin: "Nepal",
    flag: "🇳🇵",
    program: "Yoga Classes",
    stars: 5,
    color: "#6B2D8B",
  },
  {
    quote: "The 200hr training at Yogmandu completely transformed how I understand my own body and breath. The teachers hold space with such presence and warmth.",
    name: "Sarah M.",
    origin: "Australia",
    flag: "🇦🇺",
    program: "200hr YTT",
    stars: 5,
    color: "#8DC63F",
  },
  {
    quote: "I came for yoga, but the sound healing sessions cracked something open in me. The Tibetan bowls resonate in ways words can't fully describe.",
    name: "Kenji T.",
    origin: "Japan",
    flag: "🇯🇵",
    program: "Sound Healing",
    stars: 5,
    color: "#F7941D",
  },
  {
    quote: "The valley, the mountains, the community — Kathmandu itself becomes part of your practice. Dr. Gautam's teaching is unmatched in authenticity.",
    name: "Priya N.",
    origin: "United Kingdom",
    flag: "🇬🇧",
    program: "200hr YTT",
    stars: 5,
    color: "#6B2D8B",
  },
  {
    quote: "I've attended many yoga trainings, but none with this level of authentic Himalayan lineage. The philosophy teachings alone are worth the journey to Nepal.",
    name: "Marco L.",
    origin: "Italy",
    flag: "🇮🇹",
    program: "200hr YTT",
    stars: 5,
    color: "#8DC63F",
  },
  {
    quote: "Yogmandu became part of my daily rhythm. The teachers meet you exactly where you are — beginner or returning practitioner.",
    name: "Achitra Thieng",
    origin: "Nepal",
    flag: "🇳🇵",
    program: "Yoga Classes",
    stars: 5,
    color: "#F7941D",
  },
  {
    quote: "I left every session lighter than I arrived. The studio has a calm I haven't found anywhere else in Kathmandu.",
    name: "Dolkar Sherpa",
    origin: "Nepal",
    flag: "🇳🇵",
    program: "Yoga & Sound Healing",
    stars: 5,
    color: "#6B2D8B",
  },
];


function TestimonialCard({
  t, index, active, total, onNext, onPrev, mousePos,
}: {
  t: typeof testimonials[0];
  index: number;
  active: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  mousePos: React.RefObject<{ x: number; y: number }>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const offset = index - active;
  const isActive = offset === 0;
  const isVisible = Math.abs(offset) <= 1;

  useEffect(() => {
    if (!isActive || !cardRef.current) return;
    let rafId: number;
    const update = () => {
      if (!cardRef.current) return;
      const mx = mousePos.current?.x ?? 0;
      const my = mousePos.current?.y ?? 0;
      cardRef.current.style.transform = `
        translateX(-50%)
        perspective(1000px)
        rotateY(${mx * 8}deg)
        rotateX(${-my * 5}deg)
        scale(1.02)
      `;
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, mousePos]);

  if (!isVisible && !(Math.abs(offset) === 1)) return null;
  if (Math.abs(offset) > 1) return null;

  const xOffset = offset * 340;
  const scale   = isActive ? 1 : 0.82;
  const opacity = isActive ? 1 : 0.4;
  const zIndex  = isActive ? 10 : 5;

  return (
    <div
      ref={isActive ? cardRef : undefined}
      onClick={!isActive ? (offset < 0 ? onPrev : onNext) : undefined}
      className="absolute top-0"
      style={{
        width: "min(480px, 90vw)",
        left: "50%",
        transform: isActive
          ? `translateX(-50%) scale(${scale})`
          : `translateX(calc(-50% + ${xOffset}px)) scale(${scale})`,
        opacity,
        zIndex,
        filter: isActive ? "none" : "blur(3px)",
        transition: "opacity 0.4s ease, filter 0.4s ease",
        cursor: isActive ? "grab" : "pointer",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.97)",
          border: `1.5px solid ${t.color}25`,
          boxShadow: isActive
            ? `0 40px 100px rgba(107,45,139,0.3), 0 0 0 1px ${t.color}15, inset 0 1px 0 white`
            : "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Colored accent bar */}
        <div className="h-1 rounded-full mb-6"
          style={{ background: `linear-gradient(90deg, ${t.color}, #F7941D, transparent)` }} />

        {/* Stars */}
        <div className="flex gap-1 mb-5">
          {Array.from({ length: t.stars }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F7941D">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>

        {/* Quote mark */}
        <div className="text-5xl font-light leading-none mb-1"
          style={{ fontFamily: "Cormorant Garamond, serif", color: t.color, opacity: 0.25 }}>
          &ldquo;
        </div>

        <blockquote className="text-base md:text-lg font-light leading-relaxed mb-7 italic"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
          {t.quote}
        </blockquote>

        {/* Author row */}
        <div className="flex items-center gap-3 pt-5"
          style={{ borderTop: `1px solid ${t.color}12` }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
            style={{ background: `${t.color}12`, border: `1px solid ${t.color}25`, color: t.color }}>
            {t.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: "#2A1208" }}>{t.name}</p>
            <p className="text-xs font-light mt-0.5 flex items-center gap-1" style={{ color: "rgba(42,18,8,0.45)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t.origin}&nbsp;&middot;&nbsp;
              <span style={{ color: t.color }}>{t.program}</span>
            </p>
          </div>
          {/* Verified badge */}
          <div className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: `${t.color}10`, border: `1px solid ${t.color}20` }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={t.color}>
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <span className="text-[9px] tracking-wide font-medium" style={{ color: t.color }}>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const dragging = useRef(false);
  const dragStart = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const next = useCallback(() => setActive(a => (a + 1) % testimonials.length), []);
  const prev = useCallback(() => setActive(a => (a - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      y: ((e.clientY - rect.top)  / rect.height) * 2 - 1,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current = { x: 0, y: 0 };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(160deg, #3D1560 0%, #6B2D8B 45%, #4A1A70 100%)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={e => { dragging.current = true; dragStart.current = e.clientX; }}
      onMouseUp={e => {
        if (!dragging.current) return;
        const diff = dragStart.current - e.clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        dragging.current = false;
      }}
      onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const diff = dragStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      }}
    >
      {/* 3D background */}
      <div className="absolute inset-0">
        <Background3D />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#8DC63F" }} />
            <span className="text-xs tracking-[0.25em] uppercase font-light" style={{ color: "rgba(255,255,255,0.8)" }}>
              3,000+ Teachers Trained Worldwide
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif", textShadow: "0 2px 40px rgba(0,0,0,0.4)" }}>
            Voices from the
            <em className="block" style={{ color: "#F7941D" }}>practice</em>
          </h2>
          <p className="text-xs font-light tracking-[0.2em] uppercase mt-3"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            ← drag or use arrow keys to explore →
          </p>
        </div>

        {/* Card stage */}
        <div className="relative select-none" style={{ height: "clamp(380px, 440px, 100vw)" }}>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i} t={t} index={i} active={active}
              total={testimonials.length} onNext={next} onPrev={prev}
              mousePos={mousePos}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-8">
          <button onClick={prev}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div className="flex gap-2 items-center">
            {testimonials.map((t, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === active ? "32px" : "8px",
                  height: "8px",
                  background: i === active ? t.color : "rgba(255,255,255,0.2)",
                  boxShadow: i === active ? `0 0 14px ${t.color}` : "none",
                }}
              />
            ))}
          </div>

          <button onClick={next}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-5 rounded-full overflow-hidden"
          style={{ width: "100px", height: "2px", background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${((active + 1) / testimonials.length) * 100}%`,
              background: `linear-gradient(90deg, ${testimonials[active].color}, #F7941D)`,
            }}
          />
        </div>
        <p className="text-center mt-2 text-xs font-light" style={{ color: "rgba(255,255,255,0.25)" }}>
          {active + 1} / {testimonials.length}
        </p>
      </div>
    </section>
  );
}
