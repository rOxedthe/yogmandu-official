"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Reject anything that isn't an internal, single-leading-slash path.
// Blocks open-redirect via `?from=//evil.com` or `?from=https://evil.com`.
function safeRedirect(target: string | null): string {
  if (!target) return "/account";
  if (!target.startsWith("/")) return "/account";
  if (target.startsWith("//")) return "/account";
  if (target.startsWith("/\\")) return "/account";
  return target;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = safeRedirect(searchParams.get("from"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
        if (typeof data.remaining === "number") setRemaining(data.remaining);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdf8f4 0%, #f5f0fa 50%, #fff8f0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "40px 20px",
      paddingTop: "104px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #6B2D8B, #F7941D)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(107,45,139,0.35)" }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M13 2C13 2 7 7 7 13C7 16.9 9.8 20.1 13 21.2C16.2 20.1 19 16.9 19 13C19 7 13 2 13 2Z" fill="white"/>
                  <circle cx="13" cy="13" r="2.5" fill="rgba(247,148,29,0.9)"/>
                </svg>
              </div>
              <span style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208" }}>Yogmandu</span>
            </div>
          </Link>
          <h1 style={{ margin: 0, fontSize: 28, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208" }}>Welcome back</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A5840" }}>Sign in to your student account</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 40px rgba(107,45,139,0.1), 0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(107,45,139,0.08)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required autoFocus style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#c0392b", lineHeight: 1.5 }}>
                {error}
                {remaining !== null && remaining > 0 && <span style={{ display: "block", opacity: 0.7, marginTop: 2 }}>{remaining} attempt{remaining !== 1 ? "s" : ""} remaining</span>}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "rgba(107,45,139,0.5)" : "linear-gradient(135deg, #6B2D8B 0%, #8B3DAB 100%)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.02em", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(107,45,139,0.35)", transition: "all 0.2s" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f0e8f8", textAlign: "center", fontSize: 14, color: "#7A5840" }}>
            Don&apos;t have an account?{" "}
            <Link href="/account/register" style={{ color: "#6B2D8B", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: "#9A7860", textDecoration: "none" }}>← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#4A2E1A", marginBottom: 7, letterSpacing: "0.01em" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 16px", border: "1.5px solid #e8ddf5", borderRadius: 10, fontSize: 14, color: "#2A1208", background: "#fafafa", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" };

export default function AccountLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
