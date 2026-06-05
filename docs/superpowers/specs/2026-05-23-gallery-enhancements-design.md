 # Gallery Enhancements — Design Spec
**Date:** 2026-05-23  
**Status:** Approved

---

## Overview

Two enhancements to the existing `/gallery` page:

1. **Category-interleaved shuffle** — ensures the 3 carousel slots always show photos from different categories when "All" is selected, and reshuffles on every page load.
2. **`/gallery/all` page** — a new dedicated page with a masonry grid showing all 40 photos, reachable via a "View All" button on the main gallery page.

---

## Feature 1: Category-Interleaved Shuffle

### Problem
`STATIC_PHOTOS` is ordered by category (all Sound Healing, then Graduates, then Yoga). When viewing "All", any group of 3 consecutive photos shows the same category — making the carousel feel repetitive.

### Solution
On component mount, shuffle photos using **round-robin interleaving**:
1. Split `STATIC_PHOTOS` (or `allPhotos`) into per-category buckets.
2. Shuffle each bucket independently (Fisher-Yates, seeded with `Math.random()` at mount time).
3. Interleave: take one from each bucket in rotation until all buckets are exhausted.
4. Result: every window of 3 contains at most one photo per category.

This shuffle runs **once on component mount** via `useMemo` with a stable random seed computed at mount time (stored in a `useRef`). Re-renders don't reshuffle; only a full page reload does.

**Category filter behaviour:** When the user switches to a specific category (Yoga / Sound Healing / Graduates), the filtered list is the already-shuffled bucket for that category — so order within a category is also randomised per load.

### Affected file
`app/(public)/gallery/GalleryGrid.tsx` — add `shuffleInterleaved()` helper, apply in the `allPhotos` useMemo.

---

## Feature 2: `/gallery/all` Page

### Route
`app/(public)/gallery/all/page.tsx` — server component, same metadata pattern as `gallery/page.tsx`.

### Layout — Masonry Grid
- **Columns:** 4 on desktop (≥1024px), 3 on tablet (≥640px), 2 on mobile.
- **Photo sizing:** natural aspect ratio (no forced 4:3 crop) — each image fills its column width and grows to its natural height. CSS `columns` property handles reflow.
- **Card style:** matches existing `TiltPhotoCard` aesthetics — rounded corners (16px), gradient overlay at bottom, category badge + title caption, 3-D tilt on hover.
- **Lightbox:** reuses the existing `Lightbox` component. Clicking any photo opens it; arrow keys / click outside to navigate and close.
- **No pagination** — all photos visible on scroll.
- **Category filter bar** — same sticky filter bar as the main gallery page (All / Yoga / Sound Healing / Graduates), filters the masonry grid in place without a page reload.
- **Photo count badge** — "40 photos" shown in the filter bar, updates when a category is selected.

### Page header
Minimal — no hero section. A simple heading:
> **All Photos** · *Yogmandu*  
> Short subtext: "Every moment from our classes, ceremonies, and the spirit of Kathmandu."

Back link: `← Back to Gallery` in the top-left of the header, links to `/gallery`.

### "View All" entry point
On `GalleryGrid.tsx`, add a **"View All Photos →"** link below the dot pagination on the main carousel. Styled as a ghost button (outline, matches the site's warm-neutral palette). Only shown when `activeCategory === "All"` to keep it contextually relevant (you can view all photos, not just the filtered subset).

### Data
The `/gallery/all` page calls the same `getMediaItems()` as the main gallery page — it will use DB media if available, otherwise falls back to `STATIC_PHOTOS`. The interleaved shuffle runs client-side (in a `GalleryAllGrid` client component), same logic as Feature 1.

### Affected files
- `app/(public)/gallery/all/page.tsx` — new server component
- `app/(public)/gallery/all/GalleryAllGrid.tsx` — new client component (masonry grid + lightbox + filter)
- `app/(public)/gallery/GalleryGrid.tsx` — add "View All Photos →" link

### Shared code
Extract the following from `GalleryGrid.tsx` into a shared file so both pages use them without duplication:
- `STATIC_PHOTOS` array
- `CATEGORIES` constant
- `CAT_ACCENT` map
- `PhotoItem` type
- `Lightbox` component
- `shuffleInterleaved()` helper (new)

New shared file: `app/(public)/gallery/galleryData.ts` (data/types) and keep `Lightbox` + `TiltPhotoCard` in `GalleryGrid.tsx` OR extract to `app/(public)/gallery/GalleryShared.tsx` if needed by both grids.

---

## Out of Scope
- No changes to the lightbox UI.
- No changes to category labels or photo metadata.
- No infinite scroll or lazy-loading beyond the existing `loading="lazy"` on `<img>`.
- No URL state for the active filter on `/gallery/all` (filter is UI-only state).

---

## Files Changed Summary

| File | Change |
|---|---|
| `app/(public)/gallery/GalleryGrid.tsx` | Add interleaved shuffle; add "View All Photos →" link |
| `app/(public)/gallery/galleryData.ts` | New — shared data, types, helpers |
| `app/(public)/gallery/all/page.tsx` | New — server component |
| `app/(public)/gallery/all/GalleryAllGrid.tsx` | New — masonry client component |
