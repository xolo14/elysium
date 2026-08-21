import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "elysium_admin";

function adminSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  return secret;
}

export function createAdminToken() {
  return createHmac("sha256", adminSecret()).update("elysium-admin-session").digest("hex");
}

export function isValidAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = createAdminToken();
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function verifyAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  if (password.length !== configured.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(configured));
}
