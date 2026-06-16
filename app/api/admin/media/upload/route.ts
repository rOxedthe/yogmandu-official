import { requireAdminSession } from "@/lib/adminAuth";
import { getStorageBucket, getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { optimizeImage } from "@/lib/imageOptimize";
import { validateImageUpload } from "@/lib/uploadValidation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const caption = String(formData.get("caption") || "Uploaded image");
  const usedBy = String(formData.get("usedBy") || "");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing image file." }, { status: 400 });
  }

  const validationError = validateImageUpload(file);
  if (validationError) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const bucket = getStorageBucket();

  // Compress to WebP before storing — keeps Supabase usage low and the site fast.
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const fallbackExt = file.name.split(".").pop() || "jpg";
  const optimized = await optimizeImage(inputBuffer, file.type, fallbackExt);
  const path = `admin/${Date.now()}-${crypto.randomUUID()}.${optimized.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, optimized.buffer, {
      cacheControl: "31536000",
      contentType: optimized.contentType,
      upsert: false,
    });

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
  const item = {
    id: crypto.randomUUID(),
    url: publicUrlData.publicUrl,
    path,
    caption,
    usedBy,
    createdAt: new Date().toISOString(),
  };

  const { error: insertError } = await supabase.from("yogmandu_media").insert({
    id: item.id,
    url: item.url,
    caption,
    used_by: usedBy,
    data: item,
  });

  if (insertError) return Response.json({ error: insertError.message }, { status: 500 });

  return Response.json({ data: item });
}
