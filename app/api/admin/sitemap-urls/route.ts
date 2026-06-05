import { requireAdminSession } from "@/lib/adminAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { sanitizeDeep } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

// Routes already covered by app/sitemap.ts — adding them as "custom" would duplicate.
const RESERVED_PATHS = new Set([
  "/",
  "/yoga-teacher-training",
  "/sound-healing-therapy",
  "/class-schedule",
  "/services",
  "/about",
  "/contact",
  "/gallery",
  "/blog",
  "/privacy",
  "/terms",
]);

const CHANGE_FREQUENCIES = new Set([
  "always", "hourly", "daily", "weekly", "monthly", "yearly", "never",
]);

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) return authError;
  if (!isSupabaseConfigured) return Response.json({ data: [], configured: false });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("yogmandu_sitemap_urls")
    .select("id, path, priority, change_frequency, created_at")
    .order("created_at", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ data, configured: true });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const body = sanitizeDeep(await request.json().catch(() => ({}))) as Record<string, unknown>;

  // path: required, same-site, must start with "/", no absolute/external URLs
  let path = String(body?.path ?? "").trim();
  if (!path) return Response.json({ error: "Path is required." }, { status: 400 });
  if (path.length > 512) return Response.json({ error: "Path is too long." }, { status: 400 });
  if (path.includes("://") || path.startsWith("//")) {
    return Response.json({ error: "Enter a same-site path only (e.g. /yoga-for-beginners), not a full URL." }, { status: 400 });
  }
  if (!path.startsWith("/")) path = `/${path}`;
  // Normalise trailing slash (except root, which is reserved anyway)
  if (path.length > 1 && path.endsWith("/")) path = path.replace(/\/+$/, "");

  if (RESERVED_PATHS.has(path) || path.startsWith("/blog/")) {
    return Response.json(
      { error: "That page is already in the sitemap automatically — no need to add it." },
      { status: 409 }
    );
  }

  // priority: optional, clamp 0.0–1.0, default 0.5
  let priority = 0.5;
  if (body?.priority !== undefined && body?.priority !== null && body?.priority !== "") {
    const n = Number(body.priority);
    if (Number.isFinite(n)) priority = Math.min(1, Math.max(0, Math.round(n * 10) / 10));
  }

  // changeFrequency: optional enum, default "monthly"
  let changeFrequency = String(body?.changeFrequency ?? "monthly").trim().toLowerCase();
  if (!CHANGE_FREQUENCIES.has(changeFrequency)) changeFrequency = "monthly";

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("yogmandu_sitemap_urls")
    .insert({ path, priority, change_frequency: changeFrequency })
    .select("id, path, priority, change_frequency, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json({ error: "That path is already in the list." }, { status: 409 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ data });
}

export async function DELETE(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;
  if (!isSupabaseConfigured) {
    return Response.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  let id = url.searchParams.get("id") ?? "";
  if (!id) {
    const body = await request.json().catch(() => ({}));
    id = String(body?.id ?? "");
  }
  if (!id) return Response.json({ error: "id is required." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("yogmandu_sitemap_urls").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
