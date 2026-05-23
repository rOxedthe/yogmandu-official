import { consumePasswordReset } from "@/lib/passwordResets";
import { hashPassword } from "@/lib/userAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`reset:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const token       = String(body?.token        ?? "");
  const newPassword = String(body?.new_password ?? "").slice(0, 1000);

  if (!token) {
    return Response.json({ error: "Reset token is required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const consumed = await consumePasswordReset(token);
  if (!consumed) {
    return Response.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const newHash = await hashPassword(newPassword);
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("yogmandu_users")
    .update({ password_hash: newHash, updated_at: new Date().toISOString() })
    .eq("id", consumed.userId);

  if (error) {
    return Response.json({ error: "Failed to update password." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
