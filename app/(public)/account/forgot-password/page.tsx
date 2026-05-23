"use client";
import { useState } from "react";
import Link from "next/link";
import Turnstile from "@/components/Turnstile";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, captchaToken }),
      });
      setDone(true);
    } catch {
      // Same UX either way — never reveal whether the email exists.
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={logoRow}>
              <div style={logoBubble}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M13 2C13 2 7 7 7 13C7 16.9 9.8 20.1 13 21.2C16.2 20.1 19 16.9 19 13C19 7 13 2 13 2Z" fill="white"/>
                  <circle cx="13" cy="13" r="2.5" fill="rgba(247,148,29,0.9)"/>
                </svg>
              </div>
              <span style={brandText}>Yogmandu</span>
            </div>
          </Link>
          <h1 style={headlineStyle}>Reset your password</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A5840" }}>
            Enter your email and we'll send a reset link.
          </p>
        </div>

        <div style={cardStyle}>
          {done ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={successBubble}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", margin: "0 0 8px", color: "#2A1208" }}>Check your inbox</h2>
              <p style={{ fontSize: 14, color: "#5C3D2E", margin: 0, lineHeight: 1.7 }}>
                If an account exists for <strong>{email}</strong>, you'll receive a reset link within a few minutes. The link expires in 1 hour.
              </p>
              <p style={{ fontSize: 12, color: "#9A7860", marginTop: 18 }}>
                Don't see it? Check your spam folder or try again.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  autoFocus
                  style={inputStyle}
                />
              </div>
              <Turnstile onVerify={setCaptchaToken} action="forgot-password" />

              <button type="submit" disabled={loading} style={{ ...primaryButton, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f0e8f8", textAlign: "center", fontSize: 14, color: "#7A5840" }}>
            Remembered it?{" "}
            <Link href="/account/login" style={{ color: "#6B2D8B", fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: "#9A7860", textDecoration: "none" }}>← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(160deg, #fdf8f4 0%, #f5f0fa 50%, #fff8f0 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'DM Sans', sans-serif",
  padding: "40px 20px",
  paddingTop: "104px",
};
const logoRow: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 };
const logoBubble: React.CSSProperties = {
  width: 48, height: 48, borderRadius: "50%",
  background: "linear-gradient(135deg, #6B2D8B, #F7941D)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 4px 16px rgba(107,45,139,0.35)",
};
const brandText: React.CSSProperties = {
  fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208",
};
const headlineStyle: React.CSSProperties = {
  margin: 0, fontSize: 28, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208",
};
const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 20, padding: "36px 32px",
  boxShadow: "0 4px 40px rgba(107,45,139,0.1), 0 1px 4px rgba(0,0,0,0.06)",
  border: "1px solid rgba(107,45,139,0.08)",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#4A2E1A", marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", border: "1.5px solid #e8ddf5", borderRadius: 10,
  fontSize: 14, color: "#2A1208", background: "#fafafa", outline: "none",
  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};
const primaryButton: React.CSSProperties = {
  width: "100%", padding: "14px",
  background: "linear-gradient(135deg, #6B2D8B 0%, #8B3DAB 100%)",
  border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 500,
  fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(107,45,139,0.35)",
};
const successBubble: React.CSSProperties = {
  width: 64, height: 64, borderRadius: "50%",
  background: "linear-gradient(135deg, #6B2D8B, #8DC63F)",
  display: "flex", alignItems: "center", justifyContent: "center",
  margin: "0 auto 20px",
  boxShadow: "0 8px 24px rgba(107,45,139,0.3)",
};
