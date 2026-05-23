"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/account/login"), 2500);
      } else {
        setError(data.error || "Reset failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={pageStyle}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#2A1208", margin: "0 0 12px", fontSize: 22 }}>
              Invalid link
            </h2>
            <p style={{ fontSize: 14, color: "#5C3D2E", lineHeight: 1.7, margin: 0 }}>
              This reset link is missing or malformed. Please{" "}
              <Link href="/account/forgot-password" style={{ color: "#6B2D8B" }}>request a new one</Link>.
            </p>
          </div>
        </div>
      </div>
    );
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
          <h1 style={headlineStyle}>Choose a new password</h1>
        </div>

        <div style={cardStyle}>
          {done ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={successBubble}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", margin: "0 0 8px", color: "#2A1208" }}>Password updated</h2>
              <p style={{ fontSize: 14, color: "#5C3D2E", margin: 0 }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>New password</label>
                <PasswordInput required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoFocus />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Confirm new password</label>
                <PasswordInput required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={{ borderColor: confirm && confirm !== password ? "#ffaaaa" : "#e8ddf5" }} />
              </div>

              {error && (
                <div style={errorBox}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{ ...primaryButton, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f0e8f8", textAlign: "center", fontSize: 14, color: "#7A5840" }}>
            <Link href="/account/login" style={{ color: "#6B2D8B", fontWeight: 500, textDecoration: "none" }}>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={pageStyle}><div>Loading…</div></div>}>
      <ResetPasswordForm />
    </Suspense>
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
const errorBox: React.CSSProperties = {
  background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 10,
  padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c0392b",
};
const successBubble: React.CSSProperties = {
  width: 64, height: 64, borderRadius: "50%",
  background: "linear-gradient(135deg, #6B2D8B, #8DC63F)",
  display: "flex", alignItems: "center", justifyContent: "center",
  margin: "0 auto 20px",
  boxShadow: "0 8px 24px rgba(107,45,139,0.3)",
};
