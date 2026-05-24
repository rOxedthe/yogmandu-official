"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid password.");
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPassword("");
        inputRef.current?.focus();
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
      background: "linear-gradient(135deg, #0d0010 0%, #1a0030 40%, #0a001a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow orbs */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "15%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,45,139,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,148,29,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
      </div>

      <div style={{
        width: "100%", maxWidth: 420, padding: "0 24px",
        position: "relative", zIndex: 1,
      }}>
        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "48px 40px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: shake ? "adminShake 0.5s ease" : "none",
        }}>
          {/* Logo / icon */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #6B2D8B, #F7941D)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 8px 32px rgba(107,45,139,0.5)",
            }}>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path d="M17 4C17 4 10 9 10 17C10 21.4 13.1 25.1 17 26.5C20.9 25.1 24 21.4 24 17C24 9 17 4 17 4Z" fill="rgba(255,255,255,0.9)"/>
                <circle cx="17" cy="17" r="3" fill="rgba(247,148,29,0.8)"/>
              </svg>
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 26,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.02em",
            }}>
              Yogmandu Admin
            </h1>
            <p style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Restricted Access
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}>
                Admin Password
              </label>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.06)",
                  border: error
                    ? "1px solid rgba(255,80,80,0.6)"
                    : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  transition: "border-color 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: "border-box",
                }}
                onFocus={e => {
                  if (!error) e.target.style.borderColor = "rgba(107,45,139,0.7)";
                }}
                onBlur={e => {
                  if (!error) e.target.style.borderColor = "rgba(255,255,255,0.12)";
                }}
              />
            </div>

            {error && (
              <div style={{
                background: "rgba(255,80,80,0.1)",
                border: "1px solid rgba(255,80,80,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#ff9090",
                lineHeight: 1.4,
              }}>
                {error}
                {remaining !== null && remaining > 0 && (
                  <span style={{ opacity: 0.7, display: "block", marginTop: 2 }}>
                    {remaining} attempt{remaining !== 1 ? "s" : ""} remaining
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: "100%",
                padding: "14px",
                background: loading || !password
                  ? "rgba(107,45,139,0.3)"
                  : "linear-gradient(135deg, #6B2D8B 0%, #8B3DAB 100%)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                cursor: loading || !password ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.03em",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: loading || !password
                  ? "none"
                  : "0 8px 24px rgba(107,45,139,0.4)",
              }}
            >
              {loading ? "Verifying…" : "Sign In"}
            </button>
          </form>

          <p style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
          }}>
            Yogmandu · Mid-Baneshwor, Kathmandu
          </p>
        </div>

        {/* Back to site link */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/" style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.3)",
            textDecoration: "none",
          }}>
            ← Back to website
          </a>
        </div>
      </div>

      <style>{`
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #1a0030 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}
