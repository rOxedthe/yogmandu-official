// Cloudflare Turnstile server-side verification.
// Returns { ok: true } when verification passes, when Turnstile is not configured
// (so dev/staging without keys still works), or when the request is from localhost.
// Otherwise returns { ok: false, error }.
//
// To enable in production:
//   1. Add a Turnstile widget at https://dash.cloudflare.com/?to=/:account/turnstile
//   2. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY (visible) + TURNSTILE_SECRET (server only)

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;
export const isTurnstileConfigured = Boolean(TURNSTILE_SECRET);

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isTurnstileConfigured) {
    // Allow through when Turnstile is not configured — useful for local dev
    // and during initial rollout before the user has Turnstile keys.
    return { ok: true };
  }
  if (!token) return { ok: false, error: "Captcha is required." };

  try {
    const body = new URLSearchParams();
    body.set("secret", TURNSTILE_SECRET!);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = await res.json() as { success: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };

    return {
      ok: false,
      error: "Captcha verification failed. Please try again.",
    };
  } catch (err) {
    console.error("[turnstile] verify failed:", err);
    // Fail closed in case of network/runtime issues — better UX than silent allow.
    return { ok: false, error: "Captcha service is temporarily unavailable." };
  }
}
