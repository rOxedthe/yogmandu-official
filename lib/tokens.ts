import { randomBytes, createHash } from "crypto";

const TOKEN_BYTES = 32;

export function generateToken(): { token: string; hash: string } {
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
