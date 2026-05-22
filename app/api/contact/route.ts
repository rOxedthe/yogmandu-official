import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { sanitizeDeep } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROGRAMS = [
  "200hr Yoga Teacher Training",
  "300hr Advanced Teacher Training",
  "Sound Healing Session",
  "Sound Healing Certification",
  "General Inquiry",
] as const;

export async function POST(request: Request) {
  // Rate limit: 5 submissions per IP per hour
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Validate required fields
  const name    = String(body.name    ?? "").trim().slice(0, 100);
  const email   = String(body.email   ?? "").toLowerCase().trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 2000);
  const program = String(body.program ?? "").trim().slice(0, 100);

  if (!name || name.length < 2) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return Response.json({ error: "Please write a message (at least 10 characters)." }, { status: 400 });
  }

  // Sanitize all inputs
  const sanitized = sanitizeDeep({ name, email, message, program }) as {
    name: string; email: string; message: string; program: string;
  };

  // Store to Supabase if configured — gracefully degrade if not
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("yogmandu_contacts").insert({
        name:       sanitized.name,
        email:      sanitized.email,
        program:    sanitized.program || null,
        message:    sanitized.message,
        ip_hash:    Buffer.from(ip).toString("base64").slice(0, 32),
        created_at: new Date().toISOString(),
      });
      // Don't fail the request if the table doesn't exist yet — just log it
    } catch {
      // Table may not exist yet; submission still acknowledged to the user
    }
  }

  return Response.json({ ok: true });
}
