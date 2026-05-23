import { hashPassword, setUserSessionCookie } from "@/lib/userAuth";
import { createUser } from "@/lib/supabaseUsers";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return Response.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  const { email, password, full_name, phone, nationality, experience_level } = body;

  if (!email || !EMAIL_RE.test(String(email))) {
    return Response.json({ error: "Valid email is required." }, { status: 400 });
  }
  if (!password || String(password).length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!full_name || String(full_name).trim().length < 2) {
    return Response.json({ error: "Full name is required." }, { status: 400 });
  }

  try {
    const password_hash = await hashPassword(String(password));
    const user = await createUser({
      email: String(email),
      password_hash,
      full_name: String(full_name).trim().slice(0, 100),
      phone: String(phone ?? "").slice(0, 20),
      nationality: String(nationality ?? "").slice(0, 80),
      experience_level: ["Beginner", "Intermediate", "Advanced"].includes(experience_level)
        ? experience_level
        : "Beginner",
    });

    // Fire-and-forget welcome email. Don't fail registration if email isn't configured.
    sendWelcomeEmail({
      to:       user.email,
      fullName: user.full_name,
    }).catch(err => console.error("[register] welcome email failed:", err));

    await setUserSessionCookie(user.id);
    return Response.json({ user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
