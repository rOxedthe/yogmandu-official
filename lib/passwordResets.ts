import { getSupabaseAdmin } from "./supabaseAdmin";
import { generateToken, hashToken } from "./tokens";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export type PasswordResetRecord = {
  id: string;
  user_id: string;
  expires_at: string;
  used_at: string | null;
};

export async function createPasswordReset(userId: string): Promise<string> {
  const { token, hash } = generateToken();
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();

  const supabase = getSupabaseAdmin();
  // Invalidate previous unused tokens for this user — keeps the table tidy
  // and ensures only the latest link works.
  await supabase
    .from("yogmandu_password_resets")
    .update({ used_at: new Date().toISOString() })
    .is("used_at", null)
    .eq("user_id", userId);

  const { error } = await supabase.from("yogmandu_password_resets").insert({
    user_id:    userId,
    token_hash: hash,
    expires_at: expiresAt,
  });
  if (error) throw new Error("Failed to create password reset.");

  return token;
}

export async function consumePasswordReset(token: string): Promise<{ userId: string } | null> {
  if (!token || token.length < 32) return null;
  const hash = hashToken(token);
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("yogmandu_password_resets")
    .select("id, user_id, expires_at, used_at")
    .eq("token_hash", hash)
    .single();

  if (!data) return null;
  if (data.used_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Mark used
  const { error: updateErr } = await supabase
    .from("yogmandu_password_resets")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id)
    .is("used_at", null);
  if (updateErr) return null;

  return { userId: data.user_id };
}
