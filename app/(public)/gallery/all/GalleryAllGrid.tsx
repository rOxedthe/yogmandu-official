"use client";

import { useState, useMemo, useCallback } from "react";
import type { DBGalleryItem } from "@/lib/publicData";
import {
  STATIC_PHOTOS, CATEGORIES, CAT_ACCENT, shuffleInterleaved, toWebpSrc,
  type PhotoItem,
} from "../galleryData";
import { Lightbox } from "../GalleryGrid";

// ── Masonry card — natural aspect ratio, tilt on hover ────────────────────────
function MasonryCard({ photo, onOpen }: { photo: PhotoItem; onOpen: () => void }) {
  const accent = CAT_ACCENT[photo.cat] ?? "#F7941D";

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform   = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.025)`;
    el.style.boxShadow   = `${-x * 14}px ${y * 14}px 36px rgba(0,0,0,0.20), 0 0 0 1.5px ${accent}55`;
    el.style.zIndex      = "2";
  }, [accent]);

  const handleLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)";
    el.style.zIndex    = "1";
  }, []);

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        willChange: "transform",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        background: "#f0ebe4",
        breakInside: "avoid",
        marginBottom: 20,
        display: "block",
      }}
    >
      {/* top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 2, zIndex: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.65,
      }} />

      <picture>
        {toWebpSrc(photo.src) && <source type="image/webp" srcSet={toWebpSrc(photo.src)!} />}
        <img
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          style={{ width: "100%", height: "auto", display: "block" }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
        />
      </picture>

      {/* gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(5,0,18,0.82) 0%, rgba(5,0,18,0.08) 38%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* caption */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "1rem 1.1rem", zIndex: 1,
      }}>
        <span style={{
          display: "inline-block", fontSize: "0.52rem", letterSpacing: "0.26em",
          textTransform: "uppercase", color: accent, background: `${accent}1a`,
          padding: "2px 7px", borderRadius: 99, marginBottom: 5,
        }}>{photo.cat}</span>
        <p style={{
          fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", fontWeight: 400,
          color: "#fff", lineHeight: 1.2, margin: 0,
        }}>{photo.title}</p>
      </div>

      {/* corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 110, height: 110,
        background: `radial-gradient(circle at 100% 0%, ${accent}18 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props { items?: DBGalleryItem[] | null }

export default function GalleryAllGrid({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx,    setLightboxIdx]    = useState<number | null>(null);

  // shuffle once on mount
  const allPhotos = useMemo(() => {
    const base = items && items.length > 0
      ? items.map(it => ({
          id:    it.id,
          src:   it.url,
          cat:   it.category || "Yoga",
          title: it.title || "Photo",
          desc:  "",
        }))
      : STATIC_PHOTOS;
    return shuffleInterleaved(base);
  }, [items]);

  const filtered = useMemo(() =>
    activeCategory === "All" ? allPhotos : allPhotos.filter(p => p.cat === activeCategory),
  [allPhotos, activeCategory]);

  const openLightbox  = useCallback((idx: number) => setLightboxIdx(idx), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevPhoto     = useCallback(() => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextPhoto     = useCallback(() => setLightboxIdx(i => (i !== null && i < filtered.length - 1 ? i + 1 : i)), [filtered.length]);

  return (
    <>
      <style>{`
        .ymall-filter-btn { transition: all 0.22s ease; }
        .ymall-filter-btn:hover { border-color: #c97a18 !important; color: #c97a18 !important; }
        .ymall-masonry {
          columns: 4;
          column-gap: 20px;
        }
        @media (max-width: 1024px) { .ymall-masonry { columns: 3; } }
        @media (max-width: 640px)  { .ymall-masonry { columns: 2; } }
        @media (max-width: 380px)  { .ymall-masonry { columns: 1; } }
        @keyframes ymall-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ymall-card { animation: ymall-in 0.38s ease forwards; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <header style={{
        background: "linear-gradient(155deg, #1a0a2e 0%, #2d1060 50%, #1a0a2e 100%)",
        padding: "6rem 1.5rem 3.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* bg glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "10%", right: "15%", width: 300, height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,45,139,0.4) 0%, transparent 70%)",
            filter: "blur(50px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-20%", left: "5%", width: 260, height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,148,29,0.15) 0%, transparent 70%)",
            filter: "blur(45px)",
          }} />
        </div>

        <div style={{
          maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1,
        }}>
          <a href="/gallery" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)", textDecoration: "none",
            marginBottom: "1.8rem",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#F7941D")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            ← Gallery
          </a>

          <h1 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: 14,
          }}>
            All <em style={{ color: "#F7941D" }}>Photos</em>
          </h1>
          <p style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.75,
            maxWidth: 480,
          }}>
            Every moment from our classes, ceremonies, and the spirit of Kathmandu.
          </p>
        </div>
      </header>

      {/* ── Sticky filter bar ───────────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8e2d9",
        position: "sticky", top: 64, zIndex: 10,
        padding: "0 1.5rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 8,
          flexWrap: "wrap", padding: "0.85rem 0",
        }}>
          {CATEGORIES.map(cat => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                className="ymall-filter-btn"
                onClick={() => { if (activeCategory !== cat) { setActiveCategory(cat); setLightboxIdx(null); } }}
                style={{
                  padding: "0.36rem 1.05rem", borderRadius: 99,
                  fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
                  background: active ? "#F7941D" : "transparent",
                  color:      active ? "#fff"    : "#7a6a58",
                  border:     active ? "1.5px solid #F7941D" : "1.5px solid #d9d0c4",
                }}
              >{cat}</button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#b0a898" }}>
            {filtered.length} photos
          </span>
        </div>
      </div>

      {/* ── Masonry grid ────────────────────────────────────────────────────── */}
      <section style={{ background: "#F9F5F0", padding: "3rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "6rem 0",
              color: "#b0a898", fontSize: "1rem",
            }}>
              No photos in this category yet.
            </div>
          ) : (
            <div className="ymall-masonry">
              {filtered.map((photo, i) => (
                <div
                  key={photo.id}
                  className="ymall-card"
                  style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
                >
                  <MasonryCard photo={photo} onOpen={() => openLightbox(i)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA strip ───────────────────────────────────────────────────────── */}
      <section style={{
        background: "#F9F5F0",
        padding: "4rem 1.5rem",
        textAlign: "center",
        borderTop: "1px solid #ede6dc",
      }}>
        <p style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
          fontWeight: 300,
          color: "#2a1a0a",
          marginBottom: 22,
        }}>
          Come practice with us in <em style={{ color: "#A65808" }}>Kathmandu</em>
        </p>
        <a href="https://wa.me/9779862909469" style={{
          display: "inline-block", padding: "0.8rem 2.2rem",
          borderRadius: 999, background: "#A65808",
          color: "#fff", fontSize: "0.88rem", fontWeight: 500,
          textDecoration: "none", letterSpacing: "0.04em",
        }}>
          Book a Session
        </a>
      </section>

      {lightboxIdx !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
}
