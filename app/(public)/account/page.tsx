"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  nationality: string;
  experience_level: string;
  bio: string;
  avatar_url: string;
  email_verified?: boolean;
  created_at: string;
};

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const EXP_COLOR: Record<string, string> = {
  Beginner: "#8DC63F",
  Intermediate: "#F7941D",
  Advanced: "#6B2D8B",
};

export default function AccountDashboardPage() {
  const router = useRouter();
  const [user, setUser]               = useState<UserProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [loggingOut, setLoggingOut]   = useState(false);
  const [activeTab, setActiveTab]     = useState<"profile" | "password">("profile");

  // Profile edit state
  const [editing, setEditing]         = useState(false);
  const [form, setForm]               = useState({ full_name: "", phone: "", nationality: "", bio: "", experience_level: "Beginner" });
  const [saving, setSaving]           = useState(false);
  const [profileMsg, setProfileMsg]   = useState<{ ok: boolean; text: string } | null>(null);

  // Password state
  const [pwForm, setPwForm]           = useState({ current_password: "", new_password: "", confirm: "" });
  const [pwSaving, setPwSaving]       = useState(false);
  const [pwMsg, setPwMsg]             = useState<{ ok: boolean; text: string } | null>(null);

  // Avatar state
  const avatarInput                   = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview]     = useState<string | null>(null);

  // Verification state
  const [verifyState, setVerifyState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function handleResendVerify() {
    setVerifyState("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      setVerifyState(res.ok ? "sent" : "error");
    } catch {
      setVerifyState("error");
    }
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setForm({
            full_name:        data.user.full_name,
            phone:            data.user.phone,
            nationality:      data.user.nationality,
            bio:              data.user.bio,
            experience_level: data.user.experience_level,
          });
        } else {
          router.replace("/account/login");
        }
      })
      .catch(() => router.replace("/account/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      const res  = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setEditing(false);
        setProfileMsg({ ok: true, text: "Profile updated successfully." });
      } else {
        setProfileMsg({ ok: false, text: data.error || "Update failed." });
      }
    } catch {
      setProfileMsg({ ok: false, text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) {
      setPwMsg({ ok: false, text: "New passwords do not match." });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      const res  = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: pwForm.current_password,
          new_password:     pwForm.new_password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ ok: true, text: "Password changed successfully." });
        setPwForm({ current_password: "", new_password: "", confirm: "" });
      } else {
        setPwMsg({ ok: false, text: data.error || "Failed to change password." });
      }
    } catch {
      setPwMsg({ ok: false, text: "Network error." });
    } finally {
      setPwSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res  = await fetch("/api/auth/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setUser(u => u ? { ...u, avatar_url: data.avatar_url } : u);
        setAvatarPreview(null);
        setProfileMsg({ ok: true, text: "Profile picture updated." });
      } else {
        setAvatarPreview(null);
        setProfileMsg({ ok: false, text: data.error || "Upload failed." });
      }
    } catch {
      setAvatarPreview(null);
      setProfileMsg({ ok: false, text: "Network error during upload." });
    } finally {
      setAvatarUploading(false);
      if (avatarInput.current) avatarInput.current.value = "";
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #fdf8f4, #f5f0fa)", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", color: "#7A5840" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e8ddf5", borderTopColor: "#6B2D8B", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
        Loading…
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return null;

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const expColor    = EXP_COLOR[user.experience_level] || "#6B2D8B";
  const displayAvatar = avatarPreview || (user.avatar_url || null);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf8f4 0%, #f5f0fa 60%, #fff8f0 100%)", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, paddingTop: 96 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 24px 0", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleLogout} disabled={loggingOut} style={{ padding: "8px 18px", border: "1.5px solid rgba(107,45,139,0.3)", borderRadius: 10, background: "transparent", color: "#6B2D8B", fontSize: 13, fontWeight: 500, cursor: loggingOut ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 24px 0" }}>

        {/* Email verification banner */}
        {user.email_verified === false && (
          <div style={{
            background: "linear-gradient(135deg, #fff4e0, #fff8e7)",
            border: "1px solid rgba(247,148,29,0.3)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 20,
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(247,148,29,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7941D" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2A1208" }}>Confirm your email address</div>
              <div style={{ fontSize: 12, color: "#7A5840", marginTop: 2 }}>
                We sent a verification link to <strong>{user.email}</strong>. Check your inbox.
              </div>
            </div>
            <button onClick={handleResendVerify} disabled={verifyState === "sending" || verifyState === "sent"} style={{
              padding: "8px 16px",
              border: "1.5px solid rgba(247,148,29,0.5)",
              borderRadius: 8,
              background: verifyState === "sent" ? "rgba(141,198,63,0.15)" : "transparent",
              color: verifyState === "sent" ? "#6A9A20" : "#B0731A",
              fontSize: 12, fontWeight: 500,
              cursor: verifyState === "sending" || verifyState === "sent" ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {verifyState === "sending" ? "Sending…" :
               verifyState === "sent"    ? "Email sent ✓" :
               verifyState === "error"   ? "Try again"  :
                                           "Resend email"}
            </button>
          </div>
        )}

        {/* Profile hero */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "32px", boxShadow: "0 4px 32px rgba(107,45,139,0.09)", border: "1px solid rgba(107,45,139,0.08)", marginBottom: 24, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(107,45,139,0.2)", background: "linear-gradient(135deg, #f0e8ff, #fff3e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 600, color: "#6B2D8B", cursor: "pointer", position: "relative" }}
              onClick={() => avatarInput.current?.click()}
            >
              {displayAvatar ? (
                <img src={displayAvatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user.full_name.charAt(0).toUpperCase()
              )}
              {avatarUploading && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(107,45,139,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                </div>
              )}
            </div>
            <button
              onClick={() => avatarInput.current?.click()}
              title="Change photo"
              style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#6B2D8B", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
            <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleAvatarChange} style={{ display: "none" }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208" }}>
                {user.full_name}
              </h1>
              <span style={{ padding: "3px 12px", borderRadius: 20, background: expColor + "18", color: expColor, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
                {user.experience_level}
              </span>
            </div>
            <p style={{ margin: "2px 0 8px", fontSize: 13, color: "#9A7860" }}>Member since {memberSince}</p>
            {user.bio && <p style={{ margin: 0, fontSize: 14, color: "#5C3317", lineHeight: 1.6, maxWidth: 480 }}>{user.bio}</p>}
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9A7860" }}>📷 Click photo to change · Max 5 MB · JPEG/PNG/WebP</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["profile", "password"] as const).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setProfileMsg(null); setPwMsg(null); }} style={{ padding: "9px 22px", borderRadius: 10, border: activeTab === tab ? "none" : "1.5px solid rgba(107,45,139,0.2)", background: activeTab === tab ? "#6B2D8B" : "transparent", color: activeTab === tab ? "#fff" : "#6B2D8B", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
              {tab === "profile" ? "Edit Profile" : "Change Password"}
            </button>
          ))}
        </div>

        {/* ── Profile tab ── */}
        {activeTab === "profile" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 32px rgba(107,45,139,0.09)", border: "1px solid rgba(107,45,139,0.08)", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#2A1208" }}>Profile details</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{ padding: "8px 18px", border: "1.5px solid rgba(107,45,139,0.3)", borderRadius: 10, background: "transparent", color: "#6B2D8B", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Edit
                </button>
              )}
            </div>

            {profileMsg && (
              <div style={{ background: profileMsg.ok ? "#f0fff4" : "#fff5f5", border: `1px solid ${profileMsg.ok ? "#a8e6c0" : "#ffcccc"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: profileMsg.ok ? "#1a6035" : "#c0392b" }}>
                {profileMsg.text}
              </div>
            )}

            {editing ? (
              <form onSubmit={handleProfileSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Full name *</label>
                    <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required minLength={2} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+977 …" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nationality</label>
                    <input type="text" value={form.nationality} onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Bio <span style={{ color: "#9A7860", fontWeight: 400 }}>(max 500 chars)</span></label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={500} rows={3} placeholder="Tell us about your yoga journey…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                    <div style={{ textAlign: "right", fontSize: 11, color: "#9A7860", marginTop: 4 }}>{form.bio.length}/500</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Experience level</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {LEVELS.map(level => (
                        <button key={level} type="button" onClick={() => setForm(f => ({ ...f, experience_level: level }))} style={{ flex: 1, padding: "10px", border: form.experience_level === level ? "2px solid #6B2D8B" : "1.5px solid #e8ddf5", borderRadius: 10, background: form.experience_level === level ? "rgba(107,45,139,0.08)" : "#fafafa", color: form.experience_level === level ? "#6B2D8B" : "#7A5840", fontSize: 13, fontWeight: form.experience_level === level ? 600 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button type="button" onClick={() => { setEditing(false); setForm({ full_name: user.full_name, phone: user.phone, nationality: user.nationality, bio: user.bio, experience_level: user.experience_level }); setProfileMsg(null); }} style={btnSecondary}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
                {[
                  { label: "Full name",    value: user.full_name },
                  { label: "Email",        value: user.email },
                  { label: "Phone",        value: user.phone || "—" },
                  { label: "Nationality",  value: user.nationality || "—" },
                  { label: "Experience",   value: user.experience_level },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "#9A7860", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "#2A1208", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
                {user.bio && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: 11, color: "#9A7860", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Bio</div>
                    <div style={{ fontSize: 14, color: "#4A2E1A", lineHeight: 1.6 }}>{user.bio}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Password tab ── */}
        {activeTab === "password" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", boxShadow: "0 4px 32px rgba(107,45,139,0.09)", border: "1px solid rgba(107,45,139,0.08)", marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 20, fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#2A1208" }}>Change password</h2>

            {pwMsg && (
              <div style={{ background: pwMsg.ok ? "#f0fff4" : "#fff5f5", border: `1px solid ${pwMsg.ok ? "#a8e6c0" : "#ffcccc"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: pwMsg.ok ? "#1a6035" : "#c0392b" }}>
                {pwMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSave}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
                <div>
                  <label style={labelStyle}>Current password</label>
                  <PasswordInput value={pwForm.current_password} onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))} required placeholder="Your current password" />
                </div>
                <div>
                  <label style={labelStyle}>New password</label>
                  <PasswordInput value={pwForm.new_password} onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))} required minLength={8} placeholder="At least 8 characters" />
                </div>
                <div>
                  <label style={labelStyle}>Confirm new password</label>
                  <PasswordInput value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required placeholder="Repeat new password" style={{ borderColor: pwForm.confirm && pwForm.confirm !== pwForm.new_password ? "#ffaaaa" : "" }} />
                  {pwForm.confirm && pwForm.confirm !== pwForm.new_password && (
                    <div style={{ fontSize: 12, color: "#c0392b", marginTop: 4 }}>Passwords do not match</div>
                  )}
                </div>
                <button type="submit" disabled={pwSaving} style={{ ...btnPrimary, opacity: pwSaving ? 0.6 : 1, alignSelf: "flex-start" }}>
                  {pwSaving ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { title: "Class Schedule",       href: "/class-schedule",          icon: "🗓", color: "#6B2D8B" },
            { title: "Yoga Teacher Training", href: "/yoga-teacher-training",   icon: "🎓", color: "#F7941D" },
            { title: "Sound Healing",         href: "/sound-healing-therapy",   icon: "🎵", color: "#8DC63F" },
            { title: "Contact Us",            href: "/contact",                 icon: "💬", color: "#5C3317" },
          ].map(card => (
            <Link key={card.title} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "20px 18px", border: "1px solid rgba(107,45,139,0.08)", boxShadow: "0 2px 12px rgba(107,45,139,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(107,45,139,0.14)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(107,45,139,0.06)"; }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: card.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{card.title}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* WhatsApp */}
        <div style={{ background: "linear-gradient(135deg, #6B2D8B08, #F7941D08)", border: "1px solid rgba(107,45,139,0.12)", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#2A1208", marginBottom: 6 }}>Need help or want to book a class?</div>
            <div style={{ fontSize: 13, color: "#7A5840" }}>Our team is available on WhatsApp — typically responds within minutes.</div>
          </div>
          <a href="https://wa.me/9779851089897" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "#25D366", color: "#fff", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 500, boxShadow: "0 4px 16px rgba(37,211,102,0.35)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.847L.057 23.943l6.235-1.453A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.577-.5-5.075-1.374l-.362-.217-3.754.875.944-3.655-.237-.378A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 500, color: "#4A2E1A", marginBottom: 7,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 16px", border: "1.5px solid #e8ddf5", borderRadius: 10,
  fontSize: 14, color: "#2A1208", background: "#fafafa", outline: "none",
  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  padding: "12px 24px", background: "linear-gradient(135deg, #6B2D8B, #8B3DAB)",
  border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 500,
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(107,45,139,0.3)",
};
const btnSecondary: React.CSSProperties = {
  padding: "12px 20px", border: "1.5px solid rgba(107,45,139,0.25)", borderRadius: 12,
  background: "transparent", color: "#6B2D8B", fontSize: 14, fontWeight: 500,
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
};
