import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_auth";

const getSecret = () => {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SECRET or ADMIN_PASSWORD must be set");
  }
  return secret;
};

export function signToken(payload: string) {
  const secret = getSecret();
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}|${sig}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return false;
  const [payload, sig] = token.split("|");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function setAdminCookie() {
  const cookieStore = cookies();
  const token = signToken("admin");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export function isAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
