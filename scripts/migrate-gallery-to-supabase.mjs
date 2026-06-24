// One-time migration: load the 50 built-in static gallery photos into the
// Supabase `yogmandu_gallery_items` table so they become admin-editable.
//
// Mirrors app/api/admin/gallery/upload/route.ts exactly (storage path shape,
// WebP encoding, row columns + `data` jsonb). Uploads the pre-generated .webp
// sibling when present, otherwise encodes the JPG with sharp.
//
// SAFETY: aborts if the table already has rows, so it can never duplicate.
//
// Run:  node --env-file=.env.local scripts/migrate-gallery-to-supabase.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY          = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET       = process.env.SUPABASE_STORAGE_BUCKET || "yogmandu-media";

if (!SUPABASE_URL || !KEY) {
  console.error("✗ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Use --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Mirrors STATIC_PHOTOS order/titles/categories in app/(public)/gallery/galleryData.ts
const photos = [];
for (let i = 1; i <= 12; i++) photos.push({ src: `/images/gallery/yoga/yoga-${i}.jpg`,                 title: `Yoga Practice ${i}`,        cat: "Yoga" });
for (let i = 1; i <= 16; i++) photos.push({ src: `/images/gallery/bell/bowl-${i}.jpg`,                 title: `Singing Bowl ${i}`,         cat: "Sound Healing" });
photos.push({ src: "/images/gallery/bell/bellrining.jpg",        title: "Bell Ringing",     cat: "Sound Healing" });
photos.push({ src: "/images/gallery/bell/people-sleeping-1.jpg", title: "Group Sound Bath", cat: "Sound Healing" });
photos.push({ src: "/images/gallery/bell/people-sleeping-2.jpg", title: "Deep Relaxation",  cat: "Sound Healing" });
photos.push({ src: "/images/gallery/bell/people-sleeping-3.jpg", title: "Sound Therapy",    cat: "Sound Healing" });
for (let i = 1; i <= 8;  i++) photos.push({ src: `/images/gallery/certificates/certificate-${i}.jpg`,  title: `Certificate ${i}`,          cat: "Certificates" });
for (let i = 1; i <= 10; i++) photos.push({ src: `/images/gallery/graduation/graduation-${i}.jpg`,     title: `Graduation Ceremony ${i}`,  cat: "Graduation" });

// Abort if the table is not empty — prevents duplicate inserts.
const { count, error: countErr } = await supabase
  .from("yogmandu_gallery_items")
  .select("id", { count: "exact", head: true });
if (countErr) { console.error("✗ count error:", countErr.message); process.exit(1); }
if ((count ?? 0) > 0) {
  console.error(`✗ Table already has ${count} row(s) — aborting so we don't duplicate. Clear it first if you really want to re-migrate.`);
  process.exit(1);
}

const PUBLIC = join(process.cwd(), "public");
let order = 0;

for (const p of photos) {
  const webpRel = p.src.replace(/\.(jpe?g|png)$/i, ".webp");
  let buffer;
  try {
    buffer = await readFile(join(PUBLIC, webpRel));          // pre-optimized sibling
  } catch {
    const original = await readFile(join(PUBLIC, p.src));    // fall back to encoding
    buffer = await sharp(original, { failOn: "none" })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  const path = `gallery/${Date.now()}-${randomUUID()}.webp`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { cacheControl: "31536000", contentType: "image/webp", upsert: false });
  if (upErr) { console.error(`✗ upload ${p.src}:`, upErr.message); process.exit(1); }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const item = {
    id:           randomUUID(),
    url:          pub.publicUrl,
    path,
    title:        p.title,
    category:     p.cat,
    displayOrder: order,
    createdAt:    new Date().toISOString(),
  };

  const { error: insErr } = await supabase.from("yogmandu_gallery_items").insert({
    id:            item.id,
    url:           item.url,
    path:          item.path,
    title:         item.title,
    category:      item.category,
    display_order: item.displayOrder,
    data:          item,
  });
  if (insErr) { console.error(`✗ insert ${p.src}:`, insErr.message); process.exit(1); }

  order++;
  console.log(`✓ [${String(order).padStart(2, "0")}/50] ${p.cat} — ${p.title}`);
}

console.log(`\n✓ Done. Inserted ${order} gallery rows into Supabase.`);
