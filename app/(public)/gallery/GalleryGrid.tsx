"use client";

import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { DBMedia } from "@/lib/publicData";

// ── Static gallery images (fallback when Supabase not configured) ─────────────
const STATIC_PHOTOS = [
  // Sound Healing / Bell
  { id: "b1",  src: "/images/gallery/bell/bowl-1.jpg",           cat: "Sound Healing", title: "Tibetan Singing Bowl",     desc: "Authentic sound healing" },
  { id: "b2",  src: "/images/gallery/bell/bowl-2.jpg",           cat: "Sound Healing", title: "Bowl Session",             desc: "Healing frequencies" },
  { id: "b3",  src: "/images/gallery/bell/bowl-3.jpg",           cat: "Sound Healing", title: "Sound Bath",               desc: "Deep resonance therapy" },
  { id: "b4",  src: "/images/gallery/bell/bowl-4.jpg",           cat: "Sound Healing", title: "Singing Bowl Ritual",      desc: "Ancient tradition" },
  { id: "b5",  src: "/images/gallery/bell/bowl-5.jpg",           cat: "Sound Healing", title: "Bowl Collection",          desc: "Himalayan instruments" },
  { id: "b6",  src: "/images/gallery/bell/bowl-6.jpg",           cat: "Sound Healing", title: "Healing Session",          desc: "Vibration therapy" },
  { id: "b7",  src: "/images/gallery/bell/bowl-7.jpg",           cat: "Sound Healing", title: "Group Sound Bath",         desc: "Collective healing" },
  { id: "b8",  src: "/images/gallery/bell/bowl-8.jpg",           cat: "Sound Healing", title: "Bowl Practice",            desc: "Traditional technique" },
  { id: "br",  src: "/images/gallery/bell/bellrining.jpg",       cat: "Sound Healing", title: "Bell Ringing",             desc: "Sacred ceremony" },
  { id: "ps1", src: "/images/gallery/bell/people-sleeping-1.jpg",cat: "Sound Healing", title: "Yoga Nidra Session",       desc: "Deep yogic rest" },
  { id: "ps2", src: "/images/gallery/bell/people-sleeping-2.jpg",cat: "Sound Healing", title: "Sound Bath Rest",          desc: "Restorative healing" },
  { id: "ps3", src: "/images/gallery/bell/people-sleeping-3.jpg",cat: "Sound Healing", title: "Group Nidra",              desc: "Collective deep rest" },
  // Graduates / Certificates
  { id: "c1",  src: "/images/gallery/certificates/certificate-1.jpg", cat: "Graduates", title: "Graduation Ceremony",    desc: "Certified yoga teachers" },
  { id: "c2",  src: "/images/gallery/certificates/certificate-2.jpg", cat: "Graduates", title: "Certificate Presentation","desc": "Yoga Alliance certified" },
  { id: "c3",  src: "/images/gallery/certificates/certificate-3.jpg", cat: "Graduates", title: "Teacher Training Graduates","desc": "3,000+ trained globally" },
  { id: "c4",  src: "/images/gallery/certificates/certificate-4.jpg", cat: "Graduates", title: "Certification Day",       desc: "50+ countries represented" },
  // Yoga
  { id: "y1",  src: "/images/gallery/yoga/yoga-1.jpg",           cat: "Yoga", title: "Morning Practice",                 desc: "Sunrise Hatha flow" },
  { id: "y2",  src: "/images/gallery/yoga/yoga-2.jpg",           cat: "Yoga", title: "Alignment Class",                  desc: "Hands-on guidance" },
  { id: "y3",  src: "/images/gallery/yoga/yoga-3.jpg",           cat: "Yoga", title: "Ashtanga Series",                  desc: "Primary series practice" },
  { id: "y4",  src: "/images/gallery/yoga/yoga-4.jpg",           cat: "Yoga", title: "Vinyasa Flow",                     desc: "Breath and movement" },
  { id: "y5",  src: "/images/gallery/yoga/yoga-5.jpg",           cat: "Yoga", title: "Group Class",                      desc: "Community practice" },
  { id: "y6",  src: "/images/gallery/yoga/yoga-6.jpg",           cat: "Yoga", title: "Asana Practice",                   desc: "Yogmandu studio" },
  // Nepal
  { id: "n1",  src: "/images/gallery/nepal/nepal-1.png",         cat: "Nepal", title: "Kathmandu Spirit",                desc: "Sacred city of yoga" },
  { id: "n2",  src: "/images/gallery/nepal/nepal-2.png",         cat: "Nepal", title: "Nepal Landscape",                 desc: "Himalayan backdrop" },
];

const CATEGORIES = ["All", "Yoga", "Sound Healing", "Graduates", "Nepal"];
const CAT_ACCENT: Record<string, string> = {
  "Yoga":          "#F7941D",
  "Sound Healing": "#6B2D8B",
  "Graduates":     "#8DC63F",
  "Nepal":         "#2980b9",
};

// ── A single photo plane in 3D space ─────────────────────────────────────────
interface PhotoItem { id: string; src: string; cat: string; title: string; desc: string }

function PhotoPlane({
  photo, position, rotation, scale, isSelected, onClick,
}: {
  photo: PhotoItem;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [error, setError]   = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      photo.src,
      (t) => { t.colorSpace = THREE.SRGBColorSpace; setTex(t); },
      undefined,
      () => setError(true),
    );
  }, [photo.src]);

  const targetScale = isSelected ? scale * 2.2 : hovered ? scale * 1.12 : scale;
  const targetZ     = isSelected ? 4 : hovered ? 0.4 : 0;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 5);
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * delta * 5;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, 1]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1.6, 1.1]} />
      {tex && !error ? (
        <meshStandardMaterial map={tex} toneMapped={false} />
      ) : (
        <meshStandardMaterial
          color={error ? "#1a0030" : "#2a0050"}
          emissive={new THREE.Color(CAT_ACCENT[photo.cat] ?? "#6B2D8B")}
          emissiveIntensity={0.15}
        />
      )}

      {/* Glow border when selected/hovered */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.72, 1.22]} />
          <meshBasicMaterial
            color={CAT_ACCENT[photo.cat] ?? "#F7941D"}
            transparent
            opacity={isSelected ? 0.6 : 0.25}
          />
        </mesh>
      )}
    </mesh>
  );
}

// ── Caption overlay (HTML) for selected photo ─────────────────────────────────
function Caption({ photo, onClose }: { photo: PhotoItem; onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        background: "rgba(10,0,20,0.88)", backdropFilter: "blur(16px)",
        border: `1px solid ${CAT_ACCENT[photo.cat] ?? "#6B2D8B"}55`,
        borderRadius: 20, padding: "1.5rem 2rem", textAlign: "center",
        maxWidth: 380, width: "calc(100% - 3rem)", zIndex: 20,
        animation: "captionUp 0.3s ease",
      }}
    >
      <style>{`@keyframes captionUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: CAT_ACCENT[photo.cat] ?? "#F7941D", marginBottom: 6 }}>{photo.cat}</p>
      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", fontWeight: 300, color: "#fff", marginBottom: 6 }}>{photo.title}</p>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>{photo.desc}</p>
      <button onClick={onClose} style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}>
        Click anywhere to close ✕
      </button>
    </div>
  );
}

// ── 3-D Scene ─────────────────────────────────────────────────────────────────
function Scene({ photos, selected, setSelected }: {
  photos: PhotoItem[];
  selected: PhotoItem | null;
  setSelected: (p: PhotoItem | null) => void;
}) {
  const { camera } = useThree();
  const groupRef   = useRef<THREE.Group>(null!);
  const autoRotate = useRef(true);

  // Position each photo in a scattered 3-D cloud
  const layout = useMemo(() => {
    return photos.map((_, i) => {
      const angle  = (i / photos.length) * Math.PI * 2;
      const radius = 4.5 + (i % 3) * 1.2;
      const ySpread = ((i % 5) - 2) * 1.4;
      const zDepth  = ((i % 4) - 1.5) * 1.8;
      const rx = ((i % 3) - 1) * 0.12;
      const ry = Math.sin(i) * 0.18;
      return {
        position: [Math.cos(angle) * radius, ySpread, zDepth] as [number, number, number],
        rotation: [rx, ry, 0] as [number, number, number],
        scale:    0.85 + (i % 3) * 0.08,
      };
    });
  }, [photos.length]);

  // Gently auto-rotate when idle
  useFrame((_, delta) => {
    if (autoRotate.current && groupRef.current && !selected) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={() => { if (selected) { setSelected(null); autoRotate.current = true; } }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#6B2D8B" />
      <pointLight position={[5, 3, -3]}  intensity={0.3} color="#F7941D" />

      {photos.map((photo, i) => (
        <PhotoPlane
          key={photo.id}
          photo={photo}
          position={layout[i].position}
          rotation={layout[i].rotation}
          scale={layout[i].scale}
          isSelected={selected?.id === photo.id}
          onClick={() => {
            setSelected(selected?.id === photo.id ? null : photo);
            autoRotate.current = false;
          }}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={14}
        autoRotate={false}
        onStart={() => { autoRotate.current = false; }}
      />
    </group>
  );
}

// ── No-WebGL fallback ─────────────────────────────────────────────────────────
function FlatGrid({ photos }: { photos: PhotoItem[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", padding: "2rem 1.5rem" }}>
      {photos.map((p) => (
        <div key={p.id} style={{ borderRadius: "1rem", overflow: "hidden", background: "#1a0030" }}>
          <img src={p.src} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div style={{ padding: "0.75rem 1rem" }}>
            <p style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 500 }}>{p.title}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface GalleryGridProps { media?: DBMedia[] | null }

export default function GalleryGrid({ media }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected]             = useState<PhotoItem | null>(null);
  const [webglOk, setWebglOk]               = useState(true);

  // Merge DB media with static photos
  const allPhotos: PhotoItem[] = useMemo(() => {
    if (media && media.length > 0) {
      return media.map((m) => ({
        id:    m.id,
        src:   m.url,
        cat:   "Yoga",
        title: m.caption || "Photo",
        desc:  "",
      }));
    }
    return STATIC_PHOTOS;
  }, [media]);

  const filtered = activeCategory === "All"
    ? allPhotos
    : allPhotos.filter((p) => p.cat === activeCategory);

  // WebGL detection
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl") || c.getContext("webgl2") || c.getContext("experimental-webgl"));
      setWebglOk(ok);
    } catch { setWebglOk(false); }
  }, []);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0d0010 0%, #1a0030 60%, #0a001a 100%)", padding: "9rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#8DC63F", marginBottom: 20 }}>Visual Journey</p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 300, color: "#FFFFFF", lineHeight: 1.05, marginBottom: 20 }}>
            Life at <em style={{ color: "#F7941D" }}>Yogmandu</em>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: 480, lineHeight: 1.75 }}>
            Drag to explore · Click a photo to focus · Scroll to zoom
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{ background: "#0d0010", padding: "0 1.5rem", position: "sticky", top: 64, zIndex: 10, borderBottom: "1px solid rgba(107,45,139,0.2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap", padding: "1rem 0" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelected(null); }}
              style={{
                padding: "0.45rem 1.1rem", borderRadius: "3rem",
                fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
                transition: "all 0.25s ease",
                background: activeCategory === cat ? "#F7941D" : "transparent",
                color: activeCategory === cat ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                border: activeCategory === cat ? "1.5px solid #F7941D" : "1.5px solid rgba(255,255,255,0.15)",
              }}
            >
              {cat}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", alignSelf: "center" }}>
            {filtered.length} photos
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <section style={{ background: "linear-gradient(180deg, #0d0010 0%, #1a0030 100%)", position: "relative", height: "75vh", minHeight: 500 }}>
        {webglOk ? (
          <>
            <Canvas
              camera={{ position: [0, 0, 10], fov: 55 }}
              style={{ cursor: "grab" }}
              gl={{ antialias: true, alpha: true }}
            >
              <fog attach="fog" args={["#0d0010", 12, 22]} />
              <Suspense fallback={null}>
                <Scene photos={filtered} selected={selected} setSelected={setSelected} />
              </Suspense>
            </Canvas>

            {selected && <Caption photo={selected} onClose={() => setSelected(null)} />}

            {/* Hint */}
            {!selected && (
              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                  drag · scroll to zoom · click a photo
                </p>
              </div>
            )}
          </>
        ) : (
          <FlatGrid photos={filtered} />
        )}
      </section>

      {/* CTA */}
      <section style={{ background: "#0d0010", padding: "4rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(107,45,139,0.2)" }}>
        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 300, color: "#FFFFFF", marginBottom: 20 }}>
          Come practice with us in <em style={{ color: "#F7941D" }}>Kathmandu</em>
        </p>
        <a href="https://wa.me/9779862909469" style={{ display: "inline-block", padding: "0.85rem 2.2rem", borderRadius: 999, background: "#F7941D", color: "#fff", fontSize: "0.9rem", fontWeight: 500, textDecoration: "none" }}>
          Book a Session
        </a>
      </section>
    </>
  );
}
