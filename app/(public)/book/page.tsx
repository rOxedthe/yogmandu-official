"use client";

import { useCallback, useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

// ── Service catalogue (mirrors ServicesGrid) ──────────────────────────────────
type BookingService = {
  id: string; title: string; subtitle: string; icon: string;
  color: string; group: string;
};

const SERVICES: BookingService[] = [
  // Yoga Programs
  { id: "drop-in",    group: "Yoga Programs",        color: "#F7941D", icon: "🧘", title: "Drop-In Yoga",            subtitle: "6 styles · 6 days a week" },
  { id: "virtual",    group: "Yoga Programs",        color: "#6B2D8B", icon: "💻", title: "Virtual Live Yoga",       subtitle: "Home to home · online" },
  { id: "home",       group: "Yoga Programs",        color: "#8DC63F", icon: "🏡", title: "Yoga at Home",            subtitle: "We come to you" },
  { id: "private",    group: "Yoga Programs",        color: "#F7941D", icon: "🌿", title: "Private Yoga Classes",    subtitle: "1-on-1 or max 4 students" },
  // Special Programs
  { id: "ytt-200",    group: "Special Programs",     color: "#6B2D8B", icon: "📜", title: "200hr Yoga Teacher Training", subtitle: "Yoga Alliance RYS 200" },
  { id: "retreat",    group: "Special Programs",     color: "#6B2D8B", icon: "⛰", title: "Yoga Retreat",            subtitle: "Outside Kathmandu Valley" },
  { id: "bootcamp",   group: "Special Programs",     color: "#F7941D", icon: "🔥", title: "Weight Loss Bootcamp",    subtitle: "49-day transformation" },
  { id: "corporate",  group: "Special Programs",     color: "#8DC63F", icon: "💼", title: "Corporate Yoga",          subtitle: "For your team & office" },
  // Therapy & Wellness
  { id: "therapy",    group: "Therapy & Wellness",   color: "#6B2D8B", icon: "🌺", title: "Yoga Therapy",            subtitle: "Lifestyle disease support" },
  { id: "sound",      group: "Therapy & Wellness",   color: "#F7941D", icon: "🎵", title: "Sound Healing Therapy",   subtitle: "Tibetan singing bowls" },
  { id: "diet",       group: "Therapy & Wellness",   color: "#8DC63F", icon: "🥗", title: "Diet Consultation",       subtitle: "Sister clinic — Zumbandu" },
  { id: "reiki",      group: "Therapy & Wellness",   color: "#6B2D8B", icon: "✨", title: "Reiki Healing",           subtitle: "Energy work" },
  // For Specific Groups
  { id: "prenatal",   group: "For Specific Groups",  color: "#F7941D", icon: "🌸", title: "Prenatal & Postnatal",    subtitle: "Before & after birth" },
  { id: "children",   group: "For Specific Groups",  color: "#8DC63F", icon: "🌱", title: "Children's Yoga",         subtitle: "Playful & age-appropriate" },
  { id: "seniors",    group: "For Specific Groups",  color: "#6B2D8B", icon: "🍃", title: "Yoga for Seniors",        subtitle: "Gentle, chair-supported" },
  { id: "school",     group: "For Specific Groups",  color: "#F7941D", icon: "🎒", title: "School Yoga Programs",    subtitle: "Yoga in education" },
  // Workshops & Extras
  { id: "flexibility",group: "Workshops & Extras",   color: "#8DC63F", icon: "🌀", title: "Flexibility Workshop",    subtitle: "Open joints, calm mind" },
  { id: "trekking",   group: "Workshops & Extras",   color: "#6B2D8B", icon: "🏔", title: "Yoga Trekking",           subtitle: "Yoga + Himalayan trails" },
  { id: "hotel",      group: "Workshops & Extras",   color: "#F7941D", icon: "🏨", title: "Yoga at Hotel",           subtitle: "For travellers & retreats" },
  { id: "chair",      group: "Workshops & Extras",   color: "#8DC63F", icon: "💺", title: "Chair Yoga",              subtitle: "For limited mobility" },
  { id: "acupressure",group: "Workshops & Extras",   color: "#6B2D8B", icon: "👐", title: "Acupressure Yoga",        subtitle: "Marma + yoga" },
];

const GROUPS = ["All", "Yoga Programs", "Special Programs", "Therapy & Wellness", "For Specific Groups", "Workshops & Extras"] as const;

// ── 3-D tilt service selector card ───────────────────────────────────────────
function ServiceCard({
  s, selected, onSelect,
}: { s: BookingService; selected: boolean; onSelect: (s: BookingService) => void }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.03)`;
    el.style.boxShadow = `${-x * 24}px ${y * 24}px 48px rgba(42,18,8,0.22), 0 0 0 2px ${s.color}${selected ? "cc" : "66"}, 0 0 28px ${s.color}44`;
    if (shineRef.current) {
      shineRef.current.style.opacity = "1";
      shineRef.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    }
  }, [s.color, selected]);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = selected
      ? "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(-4px) scale(1.015)"
      : "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)";
    el.style.boxShadow = selected
      ? `0 12px 36px ${s.color}44, 0 0 0 2px ${s.color}`
      : "0 4px 18px rgba(42,18,8,0.07)";
    if (shineRef.current) shineRef.current.style.opacity = "0";
  }, [s.color, selected]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onSelect(s)}
      role="button"
      aria-pressed={selected}
      className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${s.color}18 0%, ${s.color}06 100%)`
          : "#FFFFFF",
        border: selected ? `2px solid ${s.color}` : `1.5px solid ${s.color}22`,
        borderTop: selected ? `2px solid ${s.color}` : `3px solid ${s.color}55`,
        boxShadow: selected
          ? `0 12px 36px ${s.color}44, 0 0 0 2px ${s.color}`
          : "0 4px 18px rgba(42,18,8,0.07)",
        transform: selected
          ? "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(-4px) scale(1.015)"
          : "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, background 0.2s ease, border-color 0.2s ease",
        willChange: "transform",
      }}
    >
      {/* Cursor shine */}
      <div ref={shineRef} style={{
        position: "absolute", top: 0, left: 0, width: 260, height: 260,
        marginLeft: -130, marginTop: -130, borderRadius: "50%",
        background: `radial-gradient(circle, ${s.color}28 0%, transparent 60%)`,
        pointerEvents: "none", opacity: 0, transition: "opacity 0.25s ease",
        mixBlendMode: "multiply",
      }} />
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at 100% 0%, ${s.color}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Selected checkmark */}
      {selected && (
        <div style={{
          position: "absolute", top: 10, right: 10, width: 22, height: 22,
          borderRadius: "50%", background: s.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "#fff", fontWeight: 700,
          boxShadow: `0 4px 12px ${s.color}66`,
          animation: "bookCheckIn 0.25s ease",
        }}>✓</div>
      )}

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem", marginBottom: 10,
        background: `linear-gradient(135deg, ${s.color}28, ${s.color}08)`,
        border: `1px solid ${s.color}44`,
        boxShadow: `0 4px 14px ${s.color}22, inset 0 1px 0 rgba(255,255,255,0.6)`,
        transition: "transform 0.25s ease",
      }}>
        <span style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}>{s.icon}</span>
      </div>
      <h3 style={{
        fontFamily: "Cormorant Garamond, serif", fontSize: "1rem",
        fontWeight: 500, color: "#2A1208", marginBottom: 3, lineHeight: 1.25,
      }}>{s.title}</h3>
      <p style={{ fontSize: "0.88rem", color: s.color, fontWeight: 600, letterSpacing: "0.05em" }}>
        {s.subtitle}
      </p>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ step }: { step: number }) {
  const steps = ["Choose Service", "Your Details", "Confirmed"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 40 }}>
      {steps.map((label, i) => {
        const num   = i + 1;
        const done  = step > num;
        const active = step === num;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "clamp(28px, 8vw, 36px)", height: "clamp(28px, 8vw, 36px)", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 14 : "0.85rem", fontWeight: 600,
                background: done
                  ? "linear-gradient(135deg, #8DC63F, #6aaa30)"
                  : active
                  ? "linear-gradient(135deg, #6B2D8B, #9B4DC0)"
                  : "rgba(42,18,8,0.06)",
                color: (done || active) ? "#fff" : "#9A7860",
                boxShadow: active ? "0 8px 20px rgba(107,45,139,0.40)" : done ? "0 4px 12px rgba(141,198,63,0.35)" : "none",
                border: (done || active) ? "none" : "1.5px solid rgba(42,18,8,0.12)",
                transition: "all 0.35s ease",
              }}>
                {done ? "✓" : num}
              </div>
              <span style={{
                fontSize: "clamp(0.6rem, 2.6vw, 1rem)", fontWeight: 600, letterSpacing: "0.06em",
                textTransform: "uppercase", textAlign: "center",
                color: active ? "#6B2D8B" : done ? "#8DC63F" : "#9A7860",
                transition: "color 0.35s ease",
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: "clamp(18px, 7vw, 60px)", height: 2, marginBottom: 20, marginLeft: "clamp(3px, 1.5vw, 6px)", marginRight: "clamp(3px, 1.5vw, 6px)", flexShrink: 0,
                background: done
                  ? "linear-gradient(90deg, #8DC63F, #6aaa30)"
                  : "rgba(42,18,8,0.10)",
                borderRadius: 2,
                transition: "background 0.35s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 — Service selector ─────────────────────────────────────────────────
function Step1({
  selected, onSelect, onNext,
}: { selected: BookingService[]; onSelect: (s: BookingService) => void; onNext: () => void }) {
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const filtered = activeGroup === "All" ? SERVICES : SERVICES.filter(s => s.group === activeGroup);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
          fontWeight: 400, color: "#2A1208", marginBottom: 8 }}>
          What would you like to book?
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#7A5840" }}>
          Select one or more services — then continue
        </p>
      </div>

      {/* Category filter pills */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        {GROUPS.map(g => {
          const isActive = activeGroup === g;
          return (
            <button key={g} onClick={() => setActiveGroup(g)}
              style={{
                padding: "6px 16px", borderRadius: 99, fontSize: "0.92rem",
                fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer",
                border: isActive ? "none" : "1.5px solid rgba(42,18,8,0.14)",
                background: isActive
                  ? "linear-gradient(135deg, #6B2D8B, #F7941D)"
                  : "rgba(255,255,255,0.7)",
                color: isActive ? "#fff" : "#7A5840",
                boxShadow: isActive ? "0 6px 18px rgba(107,45,139,0.30)" : "none",
                backdropFilter: "blur(6px)",
                transition: "all 0.2s ease",
              }}>
              {g}
            </button>
          );
        })}
      </div>

      {/* Service grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        gap: 14,
        marginBottom: 32,
      }}>
        {filtered.map(s => (
          <ServiceCard key={s.id} s={s} selected={selected.some(sel => sel.id === s.id)} onSelect={onSelect} />
        ))}
      </div>

      {/* Selected summary strip */}
      {selected.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
          marginBottom: 20,
        }}>
          {selected.map(s => (
            <div key={s.id} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 99,
              background: `${s.color}18`, border: `1.5px solid ${s.color}55`,
              fontSize: "0.92rem", fontWeight: 600, color: s.color,
              animation: "bookCheckIn 0.2s ease",
            }}>
              <span>{s.icon}</span>
              <span>{s.title}</span>
              <span style={{ opacity: 0.6, fontSize: "0.8rem", cursor: "pointer", marginLeft: 2 }}
                onClick={e => { e.stopPropagation(); onSelect(s); }}>×</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          style={{
            padding: "14px 44px", borderRadius: 99, fontWeight: 600, fontSize: "0.9rem",
            letterSpacing: "0.06em", cursor: selected.length > 0 ? "pointer" : "not-allowed",
            background: selected.length > 0
              ? "linear-gradient(135deg, #6B2D8B, #9B4DC0)"
              : "rgba(42,18,8,0.08)",
            color: selected.length > 0 ? "#fff" : "#9A7860",
            border: "none",
            boxShadow: selected.length > 0 ? "0 10px 28px rgba(107,45,139,0.40)" : "none",
            transition: "all 0.25s ease",
          }}
        >
          {selected.length > 0
            ? `Continue with ${selected.length} service${selected.length > 1 ? "s" : ""} →`
            : "Select a service to continue"}
        </button>
      </div>
    </div>
  );
}

// ── Step 2 — Details form ─────────────────────────────────────────────────────
function Step2({
  services, onBack, onSuccess, prefillMessage = "",
}: { services: BookingService[]; onBack: () => void; onSuccess: () => void; prefillMessage?: string }) {
  const service = services[0]; // primary accent colour comes from first selection
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: prefillMessage });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    el.style.boxShadow = `${-x * 20}px ${y * 20}px 48px rgba(107,45,139,0.14), 0 0 0 1px rgba(107,45,139,0.10)`;
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    }
  }, []);

  const handleLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    el.style.boxShadow = "0 16px 48px rgba(107,45,139,0.12), 0 0 0 1px rgba(107,45,139,0.08)";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:          form.name,
          email:         form.email,
          phone:         form.phone,
          serviceId:     services.map(s => s.id).join(", "),
          serviceTitle:  services.map(s => s.title).join(", "),
          message:       form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); return; }
      onSuccess();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: "0.92rem",
    border: "1.5px solid rgba(107,45,139,0.18)", background: "rgba(255,255,255,0.8)",
    color: "#2A1208", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.92rem", fontWeight: 600,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#7A5840", marginBottom: 7,
  };

  return (
    <div>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 24,
        background: "none", border: "none", cursor: "pointer",
        color: "#9A7860", fontSize: "0.85rem", fontWeight: 500,
      }}>
        ← Back
      </button>

      {/* Service badges — one per selected service */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {services.map(svc => (
          <div key={svc.id} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 18px", borderRadius: 99,
            background: `linear-gradient(135deg, ${svc.color}18, ${svc.color}08)`,
            border: `1.5px solid ${svc.color}44`,
            boxShadow: `0 4px 16px ${svc.color}22`,
          }}>
            <span style={{ fontSize: "1.1rem" }}>{svc.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: svc.color, letterSpacing: "0.06em" }}>
                {svc.title}
              </p>
              <p style={{ margin: 0, fontSize: "1rem", color: "#9A7860" }}>{svc.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          borderRadius: 24,
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          border: "1.5px solid rgba(107,45,139,0.12)",
          boxShadow: "0 16px 48px rgba(107,45,139,0.12), 0 0 0 1px rgba(107,45,139,0.08)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          willChange: "transform",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cursor glow */}
        <div ref={glowRef} style={{
          position: "absolute", top: 0, left: 0, width: 400, height: 400,
          marginLeft: -200, marginTop: -200, borderRadius: "50%",
          background: `radial-gradient(circle, ${service.color}18 0%, transparent 60%)`,
          pointerEvents: "none", opacity: 0, transition: "opacity 0.3s ease",
          mixBlendMode: "multiply",
        }} />
        {/* Top gradient accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${service.color}, #F7941D, ${service.color})`,
          borderRadius: "24px 24px 0 0", pointerEvents: "none",
        }} />

        <form onSubmit={handleSubmit} style={{ position: "relative" }}>
          <h2 style={{
            fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 400, color: "#2A1208", marginBottom: 6, marginTop: 12,
          }}>
            Your details
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#7A5840", marginBottom: 28 }}>
            We'll confirm your booking within 24 hours.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Full Name *</label>
              <input
                required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Namaste, your name..."
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${service.color}22`; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(107,45,139,0.18)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${service.color}22`; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(107,45,139,0.18)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+977..."
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${service.color}22`; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(107,45,139,0.18)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Message / Notes</label>
              <textarea
                rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Any questions, health conditions, or notes for us..."
                style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                onFocus={e => { e.currentTarget.style.borderColor = service.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${service.color}22`; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(107,45,139,0.18)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: 10, marginBottom: 16,
              background: "rgba(204,51,51,0.08)", border: "1px solid rgba(204,51,51,0.25)",
              color: "#CC3333", fontSize: "0.85rem",
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 99, fontWeight: 600,
              fontSize: "0.92rem", letterSpacing: "0.06em", border: "none", cursor: loading ? "wait" : "pointer",
              background: loading ? "rgba(42,18,8,0.08)" : `linear-gradient(135deg, ${service.color}, ${service.color}cc)`,
              color: loading ? "#9A7860" : "#fff",
              boxShadow: loading ? "none" : `0 12px 32px ${service.color}55`,
              transition: "all 0.25s ease",
              position: "relative", overflow: "hidden",
            }}
          >
            <span style={{ position: "relative", zIndex: 2 }}>
              {loading ? (<><Spinner />Sending your booking…</>) : "Confirm Booking →"}
            </span>
            {!loading && (
              <span style={{
                position: "absolute", inset: 0, zIndex: 1,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                transform: "translateX(-100%)",
                animation: "bookCtaShine 3s ease-in-out infinite",
              }} />
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.92rem", color: "#9A7860", marginTop: 14 }}>
            Need a faster reply?{" "}
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              style={{ color: "#6B2D8B", fontWeight: 600 }}>
              Message us on WhatsApp
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Step 3 — Confirmation ─────────────────────────────────────────────────────
function Step3({ services }: { services: BookingService[] }) {
  const primary = services[0];
  return (
    <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
      {/* Animated success ring */}
      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 28px" }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${primary.color} 0%, #8DC63F 60%, transparent 100%)`,
          animation: "bookRingSpin 1.2s ease-out forwards",
          opacity: 0.9,
        }} />
        <div style={{
          position: "absolute", inset: 4, borderRadius: "50%", background: "#F9F5FF",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.2rem",
          animation: "bookCheckBounce 0.5s 0.6s ease backwards",
        }}>✓</div>
      </div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 16px", borderRadius: 99, marginBottom: 20,
        background: "rgba(141,198,63,0.12)", border: "1px solid rgba(141,198,63,0.4)",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8DC63F", boxShadow: "0 0 8px #8DC63F" }} />
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#5A7A20", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Booking Received
        </span>
      </div>

      <h2 style={{
        fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
        fontWeight: 400, color: "#2A1208", marginBottom: 12, lineHeight: 1.2,
      }}>
        We'll be in touch soon 🙏
      </h2>
      <p style={{ fontSize: "1rem", color: "#4A2E1A", maxWidth: 480, margin: "0 auto 14px" }}>
        Your booking request for{" "}
        {services.map((s, i) => (
          <span key={s.id}>
            <strong style={{ color: s.color }}>{s.title}</strong>
            {i < services.length - 2 ? ", " : i < services.length - 1 ? " & " : ""}
          </span>
        ))}{" "}
        has been sent to our team. We'll confirm within 24 hours by email.
      </p>
      <p style={{ fontSize: "0.88rem", color: "#7A5840", maxWidth: 380, margin: "0 auto 36px" }}>
        Check your inbox for a confirmation. Need faster help?
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
          className="cta-lift"
          style={{
            padding: "13px 28px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem",
            textDecoration: "none", color: "#fff",
            background: "linear-gradient(135deg, #6B2D8B, #9B4DC0)",
            boxShadow: "0 10px 28px rgba(107,45,139,0.40)",
          }}>
          Chat on WhatsApp
        </a>
        <Link href="/services" className="cta-lift"
          style={{
            padding: "13px 28px", borderRadius: 99, fontWeight: 600, fontSize: "0.88rem",
            textDecoration: "none", color: "#6B2D8B",
            border: "1.5px solid #6B2D8B",
          }}>
          Explore More Services
        </Link>
      </div>
    </div>
  );
}

// ── Parse ?cls= param (format: "Monday|06:30|Morning Hatha Flow|Arjun Rakhal Magar") ──
function parseClassParam(cls: string | null): { day: string; time: string; name: string; instructor: string } | null {
  if (!cls) return null;
  const parts = cls.split("|");
  if (parts.length < 3) return null;
  return { day: parts[0], time: parts[1], name: parts[2], instructor: parts[3] ?? "" };
}

// ── Inner content (uses useSearchParams — must be inside Suspense) ─────────────
function BookPageInner() {
  const searchParams  = useSearchParams();
  const preServiceId  = searchParams.get("service");
  const clsParam      = searchParams.get("cls");
  const monthParam    = searchParams.get("month");
  const parsedClass   = parseClassParam(clsParam);

  const [step,     setStep]     = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<BookingService[]>([]);

  // Pre-select service; if a specific class is given, jump straight to step 2
  useEffect(() => {
    if (!preServiceId) return;
    const found = SERVICES.find(s => s.id === preServiceId);
    if (!found) return;
    setSelected([found]);
    if (parsedClass || monthParam) setStep(2); // skip service picker when coming from a class card or an intake month
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preServiceId, clsParam, monthParam]);

  function handleSelect(s: BookingService) {
    setSelected(prev =>
      prev.some(p => p.id === s.id) ? prev.filter(p => p.id !== s.id) : [...prev, s]
    );
  }
  function handleNext() { if (selected.length > 0) setStep(2); }
  function handleBack() { setStep(1); }
  function handleSuccess() { setStep(3); }

  return (
    <>
      <StepDots step={step} />

      {/* Intake-month banner (shown when coming from a Teacher Training month card) */}
      {monthParam && !parsedClass && step !== 3 && (
        <div style={{
          maxWidth: 640, margin: "0 auto 24px",
          padding: "12px 20px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(107,45,139,0.08), rgba(247,148,29,0.06))",
          border: "1.5px solid rgba(107,45,139,0.18)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: "1.5rem" }}>🗓</span>
          <div>
            <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#6B2D8B" }}>Selected Intake</p>
            <p style={{ margin: 0, fontSize: "0.92rem", fontWeight: 600, color: "#2A1208" }}>
              200-Hour Yoga Teacher Training
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#7A5840" }}>
              {monthParam} batch
            </p>
          </div>
        </div>
      )}

      {/* Class context banner (shown when coming from schedule page) */}
      {parsedClass && step !== 3 && (
        <div style={{
          maxWidth: 640, margin: "0 auto 24px",
          padding: "12px 20px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(107,45,139,0.08), rgba(247,148,29,0.06))",
          border: "1.5px solid rgba(107,45,139,0.18)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: "1.5rem" }}>🗓</span>
          <div>
            <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#6B2D8B" }}>Selected Class</p>
            <p style={{ margin: 0, fontSize: "0.92rem", fontWeight: 600, color: "#2A1208" }}>
              {parsedClass.name}
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#7A5840" }}>
              {parsedClass.day} · {parsedClass.time}{parsedClass.instructor ? ` · ${parsedClass.instructor}` : ""}
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: step === 1 ? 900 : 640, margin: "0 auto", transition: "max-width 0.4s ease" }}>
        {step === 1 && (
          <Step1 selected={selected} onSelect={handleSelect} onNext={handleNext} />
        )}
        {step === 2 && selected.length > 0 && (
          <Step2 services={selected} onBack={handleBack} onSuccess={handleSuccess} prefillMessage={
            parsedClass
              ? `I'd like to book: ${parsedClass.name} on ${parsedClass.day} at ${parsedClass.time}${parsedClass.instructor ? ` with ${parsedClass.instructor}` : ""}.`
              : monthParam
              ? `I'd like to book the 200-Hour Yoga Teacher Training — ${monthParam} batch.`
              : ""
          } />
        )}
        {step === 3 && selected.length > 0 && (
          <Step3 services={selected} />
        )}
      </div>
    </>
  );
}

// ── Background orbs ───────────────────────────────────────────────────────────
const ORBS = [
  { top: "8%",  left: "4%",  w: 400, h: 400, color: "rgba(107,45,139,0.09)",  dur: 18 },
  { top: "55%", right: "3%", w: 340, h: 340, color: "rgba(247,148,29,0.08)", dur: 22 },
  { top: "30%", left: "45%", w: 260, h: 260, color: "rgba(141,198,63,0.07)", dur: 15 },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <>
      <style>{`
        @keyframes bookCheckIn {
          from { transform: scale(0) rotate(-90deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes bookCtaShine {
          0%, 35% { transform: translateX(-100%); }
          65%     { transform: translateX(100%);  }
          100%    { transform: translateX(100%);  }
        }
        @keyframes bookOrbDrift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(14px, -12px) scale(1.06); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes bookRingSpin {
          from { transform: rotate(-90deg); opacity: 0; }
          to   { transform: rotate(270deg); opacity: 0.9; }
        }
        @keyframes bookCheckBounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bookHeroFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes bookMandalaRot {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes bookPulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-6 overflow-hidden text-center"
        style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 50%, #1a0a2e 100%)" }}>

        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {ORBS.map((o, i) => (
            <div key={i} style={{
              position: "absolute",
              top: o.top, left: (o as { left?: string }).left, right: (o as { right?: string }).right,
              width: o.w, height: o.h, borderRadius: "50%",
              background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
              filter: "blur(50px)",
              animation: `bookOrbDrift ${o.dur}s ease-in-out infinite`,
            }} />
          ))}
        </div>

        {/* Faint rotating mandala */}
        <svg width="480" height="480" viewBox="0 0 480 480" fill="none" style={{
          position: "absolute", top: "50%", left: "50%", opacity: 0.06, pointerEvents: "none",
          animation: "bookMandalaRot 90s linear infinite",
        }}>
          <circle cx="240" cy="240" r="230" stroke="#F7941D" strokeWidth="0.8" />
          <circle cx="240" cy="240" r="170" stroke="#F7941D" strokeWidth="0.8" />
          <circle cx="240" cy="240" r="110" stroke="#F7941D" strokeWidth="0.8" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="240" y1="10" x2="240" y2="470" stroke="#F7941D" strokeWidth="0.4"
              transform={`rotate(${i * 15} 240 240)`} />
          ))}
        </svg>

        <div className="relative max-w-2xl mx-auto">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99, marginBottom: 20,
            background: "rgba(247,148,29,0.15)", border: "1px solid rgba(247,148,29,0.30)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#F7941D",
              boxShadow: "0 0 10px #F7941D", animation: "bookPulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.25em",
              textTransform: "uppercase", color: "#F7941D" }}>Book a Session</span>
          </div>
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 16,
            animation: "bookHeroFloat 6s ease-in-out infinite",
          }}>
            Begin your journey<br />
            <em style={{ color: "#F7941D" }}>with Yogmandu</em>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", maxWidth: 420, margin: "0 auto" }}>
            Choose a service, fill in your details — we'll confirm within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Wizard ───────────────────────────────────────────────────── */}
      <section className="relative py-16 px-6 overflow-hidden" style={{ background: "#F9F5FF", minHeight: "60vh" }}>
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 50% at 80% 20%, rgba(107,45,139,0.05) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-5xl mx-auto">
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: "60px 0", color: "#9A7860" }}>Loading…</div>
          }>
            <BookPageInner />
          </Suspense>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      <section className="py-12 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p style={{ fontSize: "0.8rem", color: "#9A7860", marginBottom: 16,
            letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            Why book with us
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
            {[
              { icon: "📜", label: "Yoga Alliance RYS 200 certified" },
              { icon: "🌍", label: "Teachers from 50+ countries trained" },
              { icon: "🕐", label: "Confirmed within 24 hours" },
              { icon: "💬", label: "WhatsApp support always available" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 99,
                background: "rgba(107,45,139,0.04)", border: "1px solid rgba(107,45,139,0.10)",
              }}>
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.8rem", color: "#4A2E1A", fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
