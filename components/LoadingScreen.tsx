"use client";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => setVisible(false), 2200);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF6F0",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div style={{ position: "relative", width: 120, height: 120 }}>
        {/* Outer ring — div border, GPU composited */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1.5px solid rgba(247,148,29,0.15)",
          borderTopColor: "#F7941D",
          animation: "ls-spin 1.8s linear infinite",
          willChange: "transform",
        }} />
        {/* Inner ring — counter-spin */}
        <div style={{
          position: "absolute",
          inset: 12,
          borderRadius: "50%",
          border: "1px solid rgba(107,45,139,0.12)",
          borderBottomColor: "#6B2D8B",
          animation: "ls-spin 2.6s linear infinite reverse",
          willChange: "transform",
        }} />

        {/* Logo in center */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img src="/logo.png" alt="Yogmandu" width={180} height={72} fetchPriority="high" decoding="async" style={{ height: 72, width: "auto", objectFit: "contain" }} />
        </div>
      </div>

      {/* Brand name */}
      <div style={{ marginTop: 20, textAlign: "center", animation: "ls-fadein 0.7s ease 0.2s both" }}>
        <p style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "1.6rem",
          fontWeight: 300,
          letterSpacing: "0.04em",
          color: "#2A1208",
        }}>
          <span style={{ color: "#F7941D" }}>Yog</span>
          <span style={{ color: "#6B2D8B" }}>mandu</span>
        </p>
        <p style={{
          fontSize: "0.95rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(42,18,8,0.35)",
          marginTop: 4,
        }}>
          Yoga &amp; Sound Healing · Nepal
        </p>
      </div>

      <style>{`
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ls-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
