"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "yogmandu_consent_v1";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    yogmanduOpenConsent?: () => void;
  }
}

function applyConsent(value: ConsentValue) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage:         value,
    ad_user_data:       value,
    ad_personalization: value,
    analytics_storage:  value,
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "granted") {
      applyConsent("granted");
    } else if (!saved) {
      setVisible(true);
    }

    window.yogmanduOpenConsent = () => setVisible(true);
    return () => { delete window.yogmanduOpenConsent; };
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    applyConsent("granted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, "denied");
    applyConsent("denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position:   "fixed",
        bottom:     16,
        left:       16,
        right:      16,
        maxWidth:   480,
        margin:     "0 auto",
        zIndex:     9999,
        background: "#FFFFFF",
        color:      "#2A1208",
        border:     "1px solid rgba(107,45,139,0.18)",
        borderRadius: 14,
        boxShadow:  "0 16px 48px rgba(42,18,8,0.18)",
        padding:    "1.1rem 1.2rem",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
      }}>
        <span style={{
          width: 28, height: 2, background: "linear-gradient(90deg, #6B2D8B, #F7941D)", borderRadius: 2,
        }} />
        <p style={{
          fontSize: "0.95rem", letterSpacing: "0.26em", textTransform: "uppercase",
          color: "#6B2D8B", fontWeight: 500, margin: 0,
        }}>Privacy</p>
      </div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize:   "1.25rem",
        fontWeight: 400,
        margin:     "0 0 8px",
        color:      "#2A1208",
        lineHeight: 1.25,
      }}>
        We value your privacy
      </h2>
      <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#5C3D2E", margin: "0 0 16px" }}>
        We use cookies to understand how visitors use our site and improve your experience. See our{" "}
        <Link href="/privacy" style={{ color: "#6B2D8B", textDecoration: "underline" }}>privacy policy</Link>.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={accept}
          style={{
            flex:       "1 1 auto",
            border:     "none",
            background: "linear-gradient(135deg, #6B2D8B, #F7941D)",
            color:      "#fff",
            padding:    "9px 18px",
            borderRadius: 999,
            fontSize:   "1rem",
            fontWeight: 500,
            cursor:     "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Accept all
        </button>
        <button
          onClick={reject}
          style={{
            flex:       "1 1 auto",
            border:     "1.5px solid rgba(107,45,139,0.3)",
            background: "transparent",
            color:      "#6B2D8B",
            padding:    "9px 18px",
            borderRadius: 999,
            fontSize:   "1rem",
            fontWeight: 500,
            cursor:     "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Reject non-essential
        </button>
      </div>
    </div>
  );
}
