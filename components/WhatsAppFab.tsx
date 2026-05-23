"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PHONE = "9779862909469";
const MESSAGE = "Hi Yogmandu, I'd like to know more about your programs.";

// Don't show on these route prefixes — would clash with their own chrome.
const HIDDEN_ON = ["/admin", "/account"];

export default function WhatsAppFab() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Fade in after the page has had a moment to settle (~1.2s).
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  if (HIDDEN_ON.some(prefix => pathname.startsWith(prefix))) return null;

  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: expanded ? "14px 22px 14px 18px" : "14px",
        background: "#25D366",
        color: "#fff",
        borderRadius: 999,
        textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.847L.057 23.943l6.235-1.453A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.577-.5-5.075-1.374l-.362-.217-3.754.875.944-3.655-.237-.378A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
      </svg>
      <span
        style={{
          maxWidth: expanded ? 200 : 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
          transition: "max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        Chat on WhatsApp
      </span>
      {/* Pulsing ring — only visible when collapsed */}
      {!expanded && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            background: "#25D366",
            opacity: 0.4,
            animation: "wa-pulse 2s ease-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.4; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
