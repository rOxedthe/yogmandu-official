"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavUser = { full_name: string; avatar_url: string } | null;

const DEFAULT_CONFIG = {
  services: [
    { href: "/class-schedule",        label: "Class Schedule",          icon: "🗓", desc: "Weekly yoga class timetable" },
    { href: "/yoga-teacher-training", label: "200hr Teacher Training",  icon: "🧘", desc: "Yoga Alliance RYS 200 certified" },
    { href: "/yoga-teacher-training", label: "300hr Advanced Training", icon: "⭐", desc: "Yoga Alliance RYS 300 certified" },
    { href: "/yoga-teacher-training", label: "500hr Master Training",   icon: "🏆", desc: "Yoga Alliance RYS 500 certified" },
    { href: "/sound-healing-therapy#sessions",      label: "Sound Healing Sessions", icon: "🎵", desc: "Individual & group sessions" },
    { href: "/sound-healing-therapy#certification", label: "Sound Healing Cert.",    icon: "📜", desc: "Level I & II certification" },
    { href: "/services",              label: "All Services",            icon: "✨", desc: "Yoga, retreats, therapy, corporate & more" },
  ],
  leftLinks:    [{ href: "/about", label: "About" }, { href: "/gallery", label: "Gallery" }],
  rightLinks:   [{ href: "/blog", label: "Blog" }, { href: "/contact", label: "Contact" }],
  youtubeUrl:   "https://www.youtube.com/@yogmandu",
  tagline:      "Yoga & Sound Healing · Nepal",
  bookNowLabel: "Book Now",
  bookNowHref:  "/book",
};

export default function Nav() {
  const [cfg, setCfg]               = useState(DEFAULT_CONFIG);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [navUser, setNavUser]       = useState<NavUser>(undefined as unknown as NavUser);
  const pathname  = usePathname();
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.nav) setCfg(prev => ({ ...prev, ...data.nav })); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : { user: null })
      .then(data => setNavUser(data.user ? { full_name: data.user.full_name, avatar_url: data.user.avatar_url } : null))
      .catch(() => setNavUser(null));
  }, [pathname]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setServicesOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const navBg = {
    background: "#FFFFFF",
    borderBottom: scrolled ? "1px solid rgba(247,148,29,0.25)" : "1px solid rgba(107,45,139,0.1)",
    boxShadow: scrolled ? "0 4px 24px rgba(42,18,8,0.08)" : "none",
  };

  const activeColor = (href: string) => (pathname === href ? "#F7941D" : "#2A1208");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={navBg}>
      <nav className="max-w-7xl mx-auto px-6 py-3">

        {/* ── Desktop: 3-column ── */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>

          {/* Left */}
          <ul className="flex items-center gap-6 text-sm font-light">
            <li ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  color: servicesOpen ? "#F7941D" : "#2A1208",
                  fontSize: "0.875rem", fontWeight: 400,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "2px 0", transition: "color 0.2s",
                }}
              >
                Services
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                  style={{ transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {servicesOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 14px)", left: "-8px",
                  width: 295, background: "#FFFFFF",
                  border: "1px solid rgba(107,45,139,0.14)", borderRadius: "1rem",
                  boxShadow: "0 20px 60px rgba(42,18,8,0.14), 0 4px 16px rgba(107,45,139,0.08)",
                  padding: "0.6rem", zIndex: 200,
                }}>
                  <div style={{
                    position: "absolute", top: -6, left: 24, width: 12, height: 12,
                    background: "#FFFFFF", border: "1px solid rgba(107,45,139,0.14)",
                    transform: "rotate(45deg)", borderBottom: "none", borderRight: "none",
                  }} />
                  {cfg.services.map((s) => (
                    <Link key={s.label} href={s.href} onClick={() => setServicesOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.6rem 0.8rem",
                        borderRadius: "0.6rem", textDecoration: "none", transition: "background 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(247,148,29,0.07)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: "1.05rem", lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: "1rem", fontWeight: 500, color: "#2A1208", lineHeight: 1.2 }}>{s.label}</div>
                        <div style={{ fontSize: "0.85rem", color: "#7A5840", marginTop: 2 }}>{s.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {cfg.leftLinks.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} style={{
                  color: activeColor(l.href), fontWeight: 400,
                  borderBottom: pathname === l.href ? "1.5px solid rgba(247,148,29,0.6)" : "1.5px solid transparent",
                  paddingBottom: "2px", transition: "color 0.2s",
                }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#6B2D8B")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = activeColor(l.href))}
                >{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Center logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none", justifyContent: "center", padding: "0 2rem" }}>
            <picture>
              <source srcSet="/logo-sm-opt.webp" type="image/webp" />
              <img src="/logo-sm.png" alt="Yogmandu" width={120} height={48} fetchPriority="high" decoding="async" style={{ height: 48, width: "auto", objectFit: "contain" }} />
            </picture>
            <span style={{ fontSize: "0.95rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A5840", whiteSpace: "nowrap" }}>
              {cfg.tagline}
            </span>
          </Link>

          {/* Right */}
          <ul className="flex items-center gap-6 text-sm font-light justify-end">
            {cfg.rightLinks.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} style={{
                  color: activeColor(l.href), fontWeight: 400,
                  borderBottom: pathname === l.href ? "1.5px solid rgba(247,148,29,0.6)" : "1.5px solid transparent",
                  paddingBottom: "2px", transition: "color 0.2s",
                }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#6B2D8B")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = activeColor(l.href))}
                >{l.label}</Link>
              </li>
            ))}

            {/* Account / Login */}
            <li>
              {navUser === (undefined as unknown as NavUser) ? null : navUser ? (
                <Link href="/account" title={navUser.full_name} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                    border: "2px solid rgba(107,45,139,0.35)",
                    background: "linear-gradient(135deg, #f0e8ff, #fff3e0)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600, color: "#6B2D8B",
                  }}>
                    {navUser.avatar_url
                      ? <img src={navUser.avatar_url} alt={navUser.full_name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : navUser.full_name.charAt(0).toUpperCase()
                    }
                  </div>
                </Link>
              ) : (
                <Link href="/account/login" style={{
                  fontSize: "0.875rem", color: "#6B2D8B", fontWeight: 500,
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 5,
                  border: "1.5px solid rgba(107,45,139,0.3)", borderRadius: 20,
                  padding: "4px 14px", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(107,45,139,0.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Login
                </Link>
              )}
            </li>

            <li>
              <a href={cfg.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Yogmandu on YouTube"
                style={{ color: "#7A5840", display: "flex", alignItems: "center", transition: "color 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#FF0000")}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#7A5840")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </li>

            <li>
              <Link href={cfg.bookNowHref} className="cta-lift px-5 py-2 rounded-full text-sm font-medium"
                style={{ background: "#A65808", color: "#fff", boxShadow: "0 4px 14px rgba(247,148,29,0.35)" }}>
                {cfg.bookNowLabel}
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <picture>
              <source srcSet="/logo-sm-opt.webp" type="image/webp" />
              <img src="/logo-sm.png" alt="Yogmandu" width={100} height={40} decoding="async" style={{ height: 40, width: "auto", objectFit: "contain" }} />
            </picture>
          </Link>
          <button className="flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span className={`block w-6 h-px transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "#2A1208" }} />
            <span className={`block w-6 h-px transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}       style={{ background: "#2A1208" }} />
            <span className={`block w-6 h-px transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "#2A1208" }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(247,148,29,0.12)" }}>
          <div style={{ paddingTop: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(42,18,8,0.07)" }}>
            <p style={{ fontSize: "0.95rem", letterSpacing: "0.24em", textTransform: "uppercase",
              color: "#F7941D", marginBottom: 8, fontWeight: 500 }}>Services</p>
            {cfg.services.map((s) => (
              <Link key={s.label} href={s.href} className="block py-2.5"
                style={{ color: pathname === s.href ? "#F7941D" : "#2A1208", fontSize: "0.9rem",
                  textDecoration: "none", fontWeight: 400 }}
                onClick={() => setMobileOpen(false)}>
                {s.icon} {s.label}
              </Link>
            ))}
          </div>

          {[...cfg.leftLinks, ...cfg.rightLinks].map((l) => (
            <Link key={l.href + l.label} href={l.href} className="block py-3"
              style={{ borderBottom: "1px solid rgba(42,18,8,0.06)",
                color: pathname === l.href ? "#F7941D" : "#2A1208", fontWeight: 400 }}
              onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}

          {/* Mobile: account or login */}
          {navUser ? (
            <Link href="/account" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3"
              style={{ borderBottom: "1px solid rgba(42,18,8,0.06)", textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(107,45,139,0.3)", background: "linear-gradient(135deg,#f0e8ff,#fff3e0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#6B2D8B", flexShrink: 0 }}>
                {navUser.avatar_url
                  ? <img src={navUser.avatar_url} alt={navUser.full_name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : navUser.full_name.charAt(0).toUpperCase()
                }
              </div>
              <span style={{ color: "#2A1208", fontSize: "0.9rem" }}>My Account</span>
            </Link>
          ) : (
            <Link href="/account/login" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3"
              style={{ borderBottom: "1px solid rgba(42,18,8,0.06)", color: "#6B2D8B", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Login / Register
            </Link>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <a href={cfg.youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="cta-lift flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
              style={{ background: "#FF0000", color: "#fff" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
            <Link href={cfg.bookNowHref} className="cta-lift flex-1 text-center py-2.5 rounded-full font-medium"
              style={{ background: "#A65808", color: "#fff" }} onClick={() => setMobileOpen(false)}>
              {cfg.bookNowLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
