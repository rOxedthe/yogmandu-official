import {
  clearAdminSessionCookie,
  isAdminAuthenticated,
  isAdminPasswordConfigured,
  isSameOriginRequest,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "@/lib/adminAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";

export const dynamic = "force-dynamic";

export async function GET() {
  const passwordConfigured = isAdminPasswordConfigured();
  return Response.json({
    passwordConfigured,
    authenticated: passwordConfigured ? await isAdminAuthenticated() : false,
  });
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return Response.json({ error: "Set ADMIN_PASSWORD before enabling the remote admin." }, { status: 503 });
  }

  // CSRF defence-in-depth: reject cross-origin login attempts.
  if (!(await isSameOriginRequest())) {
    return Response.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }

  // Rate limit: 10 attempts per IP per 15 minutes
  const ip = getClientIp(request);
  const { allowed, remaining, retryAfterMs } = rateLimit(`admin-auth:${ip}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!allowed) {
    return Response.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = String(body?.password ?? "").slice(0, 1000);

  // Turnstile (no-op until TURNSTILE_SECRET is set — see lib/turnstile.ts).
  const turnstile = await verifyTurnstile(body?.turnstileToken, ip);
  if (!turnstile.ok) {
    return Response.json({ error: turnstile.error || "Captcha verification failed." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return Response.json(
      { error: "Invalid admin password.", remaining },
      {
        status: 401,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  await setAdminSessionCookie();
  return Response.json({ authenticated: true });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return Response.json({ authenticated: false });
}
