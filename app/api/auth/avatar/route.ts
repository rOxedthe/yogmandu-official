import { getUserSession } from "@/lib/userAuth";
import { updateUserProfile } from "@/lib/supabaseUsers";
import { getSupabaseAdmin, getStorageBucket } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED  = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const ALL_EXTS = ["jpg", "png", "webp", "gif"];

// Detect real image type by reading the file's magic bytes.
// Returns the canonical extension or null if the bytes don't match a supported image.
function detectImageType(buffer: Buffer): "jpg" | "png" | "webp" | "gif" | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e &&
    buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a &&
    buffer[6] === 0x1a && buffer[7] === 0x0a
  ) return "png";

  // GIF: "GIF87a" or "GIF89a"
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "gif";

  // WebP: "RIFF....WEBP"
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return "webp";

  return null;
}

const EXT_TO_MIME: Record<string, string> = {
  jpg:  "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
};

export async function POST(request: Request) {
  const session = await getUserSession();
  if (!session) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return Response.json({ error: "Invalid request." }, { status: 400 });

  const file = formData.get("avatar");
  if (!(file instanceof File)) return Response.json({ error: "No file provided." }, { status: 400 });

  // Sanity check against client-declared type — cheap filter, but not sufficient.
  if (!ALLOWED.includes(file.type as typeof ALLOWED[number])) {
    return Response.json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Image must be under 5 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify the file's actual bytes match a supported image format.
  const realExt = detectImageType(buffer);
  if (!realExt) {
    return Response.json({ error: "File does not appear to be a valid image." }, { status: 400 });
  }
  const realMime = EXT_TO_MIME[realExt];

  const supabase = getSupabaseAdmin();
  const bucket   = getStorageBucket();

  // Remove any old avatar files with different extensions to avoid leaking storage.
  const stalePaths = ALL_EXTS
    .filter(ext => ext !== realExt)
    .map(ext => `avatars/${session.userId}.${ext}`);
  if (stalePaths.length > 0) {
    await supabase.storage.from(bucket).remove(stalePaths).catch(() => {});
  }

  const path = `avatars/${session.userId}.${realExt}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: realMime,
      upsert: true,
    });

  if (error) return Response.json({ error: "Upload failed: " + error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  // Bust cache by appending a timestamp
  const avatar_url = `${publicUrl}?t=${Date.now()}`;

  const user = await updateUserProfile(session.userId, { avatar_url });
  if (!user) return Response.json({ error: "Failed to save avatar URL." }, { status: 500 });

  return Response.json({ avatar_url });
}
