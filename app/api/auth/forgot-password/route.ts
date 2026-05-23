import { getUserByEmail } from "@/lib/supabaseUsers";
import { createPasswordReset } from "@/lib/passwordResets";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yogmandu.com";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`forgot:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);

  const captcha = await verifyTurnstile(body?.captchaToken, ip);
  if (!captcha.ok) return Response.json({ error: captcha.error }, { status: 400 });

  const email = String(body?.email ?? "").toLowerCase().trim();

  // Always respond with success to avoid revealing whether an account exists.
  // Only send the email if the user actually exists.
  if (email && EMAIL_RE.test(email)) {
    try {
      const user = await getUserByEmail(email);
      if (user) {
        const token = await createPasswordReset(user.id);
        const resetUrl = `${SITE_URL}/account/reset-password?token=${token}`;
        await sendPasswordResetEmail({
          to:       user.email,
          fullName: user.full_name,
          resetUrl,
        });
      }
    } catch (err) {
      console.error("[forgot-password]", err);
      // Still return ok — never leak details.
    }
  }

  return Response.json({ ok: true });
}
