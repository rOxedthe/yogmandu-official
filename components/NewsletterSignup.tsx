"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail]     = useState("");
  const [state, setState]     = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setMessage("");
    try {
      const res  = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("ok");
        setMessage(data.alreadySubscribed ? "You're already on the list 🙏" : "Thanks for joining the journey 🙏");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "Subscription failed.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <p style={{ fontSize: "0.95rem", color: "#7A5840", marginBottom: 10, lineHeight: 1.5 }}>
        Get class schedules, retreat updates and yoga reflections — once a month, no spam.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 4,
          background: "#FFFFFF",
          border: "1.5px solid rgba(107,45,139,0.18)",
          borderRadius: 999,
          maxWidth: 380,
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={state === "loading" || state === "ok"}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "8px 14px",
            fontSize: "0.85rem",
            background: "transparent",
            color: "#2A1208",
            fontFamily: "'DM Sans', sans-serif",
          }}
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "ok"}
          style={{
            border: "none",
            background: state === "ok"
              ? "#8DC63F"
              : "linear-gradient(135deg, #6B2D8B, #F7941D)",
            color: "#fff",
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: state === "loading" || state === "ok" ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {state === "loading" ? "…" : state === "ok" ? "Subscribed ✓" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          style={{
            marginTop: 10,
            fontSize: "0.92rem",
            color: state === "ok" ? "#6A9A20" : "#c0392b",
          }}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
