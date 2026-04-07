import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "mj_auth_token";

type JwtPayload = {
  exp?: number;
  user_email?: string;
  [key: string]: unknown;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
}

export async function getAuthEmailFromToken() {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload?.user_email || typeof payload.user_email !== "string") return null;
  if (payload.exp && Date.now() >= payload.exp * 1000) return null;

  return payload.user_email;
}
