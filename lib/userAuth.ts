import { scrypt, randomBytes, timingSafeEqual, createHmac } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";

const scryptAsync = promisify(scrypt);
const USER_COOKIE = "yogmandu_user_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set (or is too short). Generate one with `openssl rand -hex 32` and set it in your environment."
    );
  }
  // Dev only: stable per-process fallback so sessions survive HMR reloads.
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-insecure-session-secret-do-not-use-in-prod";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const hashBuffer = Buffer.from(hash, "hex");
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(hashBuffer, derived);
  } catch {
    return false;
  }
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function createSessionValue(userId: string): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `user.${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function parseUserSession(value: string | undefined): { userId: string } | null {
  if (!value) return null;
  const dotIndex3 = value.lastIndexOf(".");
  if (dotIndex3 < 0) return null;
  const payload = value.slice(0, dotIndex3);
  const signature = value.slice(dotIndex3 + 1);
  const parts = payload.split(".");
  if (parts.length < 3 || parts[0] !== "user") return null;
  const userId = parts[1];
  const expiresAt = Number(parts[2]);
  if (!userId || isNaN(expiresAt) || expiresAt < Date.now()) return null;
  try {
    const expected = sign(payload);
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return { userId };
}

export async function setUserSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_COOKIE, createSessionValue(userId), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearUserSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
}

export async function getUserSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  return parseUserSession(cookieStore.get(USER_COOKIE)?.value);
}
