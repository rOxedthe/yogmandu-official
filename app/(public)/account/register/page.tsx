"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function AccountRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    nationality: "",
    experience_level: "Beginner",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("success");
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 1800);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fdf8f4 0%, #f5f0fa 50%, #fff8f0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #6B2D8B, #8DC63F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(107,45,139,0.35)",
          }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path d="M10 19L16 25L28 13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: 32,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#2A1208", margin: "0 0 10px",
          }}>
            Welcome to Yogmandu!
          </h2>
          <p style={{ color: "#7A5840", fontSize: 15 }}>
            Your account is ready. Taking you to your dashboard…
          </p>
        </div>
      </div>
    );
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
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #6B2D8B, #F7941D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(107,45,139,0.35)",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C12 2 6 7 6 12C6 15.3 8.7 18.1 12 19C15.3 18.1 18 15.3 18 12C18 7 12 2 12 2Z" fill="white"/>
                  <circle cx="12" cy="12" r="2.2" fill="rgba(247,148,29,0.9)"/>
                </svg>
              </div>
              <span style={{
                fontSize: 20,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 600,
                color: "#2A1208",
              }}>Yogmandu</span>
            </div>
          </Link>
          <h1 style={{
            margin: 0,
            fontSize: 28,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600,
            color: "#2A1208",
          }}>
            Create your account
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#7A5840" }}>
            Join our community of yoga practitioners
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 4px 40px rgba(107,45,139,0.1), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(107,45,139,0.08)",
        }}>
          <form onSubmit={handleSubmit}>
            {/* Full name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full name *</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => update("full_name", e.target.value)}
                placeholder="Your full name"
                required
                autoFocus
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email address *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                placeholder="you@email.com"
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password *</label>
              <PasswordInput
                value={form.password}
                onChange={e => update("password", e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>

            {/* Phone + Nationality row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  placeholder="+977 …"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Nationality</label>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={e => update("nationality", e.target.value)}
                  placeholder="e.g. Nepali"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Experience level */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Yoga experience</label>
              <div style={{ display: "flex", gap: 10 }}>
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => update("experience_level", level)}
                    style={{
                      flex: 1,
                      padding: "10px 6px",
                      border: form.experience_level === level
                        ? "2px solid #6B2D8B"
                        : "1.5px solid #e8ddf5",
                      borderRadius: 10,
                      background: form.experience_level === level
                        ? "rgba(107,45,139,0.08)"
                        : "#fafafa",
                      color: form.experience_level === level ? "#6B2D8B" : "#7A5840",
                      fontSize: 13,
                      fontWeight: form.experience_level === level ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                background: "#fff5f5",
                border: "1px solid #ffcccc",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 18,
                fontSize: 13,
                color: "#c0392b",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "rgba(107,45,139,0.5)"
                  : "linear-gradient(135deg, #6B2D8B 0%, #8B3DAB 100%)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 6px 20px rgba(107,45,139,0.35)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p style={{ fontSize: 11, color: "#9A7860", textAlign: "center", marginTop: 14 }}>
              By registering you agree to our{" "}
              <Link href="/terms" style={{ color: "#6B2D8B", textDecoration: "underline" }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "#6B2D8B", textDecoration: "underline" }}>
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <div style={{
            marginTop: 20,
            paddingTop: 20,
            borderTop: "1px solid #f0e8f8",
            textAlign: "center",
            fontSize: 14,
            color: "#7A5840",
          }}>
            Already have an account?{" "}
            <Link href="/account/login" style={{ color: "#6B2D8B", fontWeight: 500, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: "#9A7860", textDecoration: "none" }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#4A2E1A",
  marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1.5px solid #e8ddf5",
  borderRadius: 10,
  fontSize: 14,
  color: "#2A1208",
  background: "#fafafa",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
