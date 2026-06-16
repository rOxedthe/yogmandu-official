// Shared guard for admin image uploads. Even though the upload routes are
// admin-only, an unbounded `await file.arrayBuffer()` is a memory-exhaustion /
// runaway-storage-cost risk, and an unvalidated MIME lets non-images (notably
// SVG, which can carry inline JavaScript) reach the public bucket. We cap size
// and allow only raster image types — SVG is deliberately excluded.

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/** Returns an error message if the upload is invalid, or null if it's OK. */
export function validateImageUpload(file: File): string | null {
  if (file.size === 0) return "File is empty.";
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB).`;
  }
  const type = (file.type || "").toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    return "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or AVIF image.";
  }
  return null;
}
