import { NextResponse } from "next/server";
import {
  absoluteWpEndpoint,
  getWordPressBaseUrl,
  getWooCredentials,
} from "@/app/lib/auth/wordpress";

type ResetPasswordBody = {
  email?: string;
  key?: string;
  password?: string;
};

type WooCustomer = {
  id: number;
  email?: string;
  username?: string;
};

type WpApiResult = {
  ok: boolean;
  status: number;
  message?: string;
};

async function getWpUsernameByEmail(email: string) {
  const wpBase = getWordPressBaseUrl();
  const { wcKey, wcSecret } = getWooCredentials();

  const url = new URL(`${wpBase}/wp-json/wc/v3/customers`);
  url.searchParams.set("consumer_key", wcKey);
  url.searchParams.set("consumer_secret", wcSecret);
  url.searchParams.set("email", email);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const customers = (await res.json().catch(() => [])) as WooCustomer[];
  return customers[0]?.username || null;
}

async function sendResetRequest(
  endpoint: string,
  payload: Record<string, string>,
  contentType: "application/json" | "application/x-www-form-urlencoded",
): Promise<WpApiResult> {
  const body =
    contentType === "application/json"
      ? JSON.stringify(payload)
      : new URLSearchParams(payload).toString();

  const wpRes = await fetch(absoluteWpEndpoint(endpoint), {
    method: "POST",
    headers: { "Content-Type": contentType, Accept: "application/json" },
    body,
    cache: "no-store",
  });

  const data = (await wpRes.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    code?: string;
  };

  return {
    ok: wpRes.ok,
    status: wpRes.status,
    message: data.message || data.error || data.code,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBody;
    const email = body.email?.trim().toLowerCase();
    const key = body.key?.trim();
    const password = body.password;

    if (!email || !key || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Email, reset key, and 8+ char password are required." },
        { status: 400 },
      );
    }

    const endpoint =
      process.env.WP_RESET_PASSWORD_ENDPOINT || "/wp-json/bdpwr/v1/set-password";
    const username = (await getWpUsernameByEmail(email)) || email;
    const attempts: Array<{
      payload: Record<string, string>;
      contentType: "application/json" | "application/x-www-form-urlencoded";
    }> = [
      {
        contentType: "application/json",
        payload: {
          email,
          user_email: email,
          username,
          user_login: username,
          key,
          reset_key: key,
          password,
        },
      },
      {
        contentType: "application/json",
        payload: { login: username, code: key, key, new_password: password, password },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: {
          email,
          user_email: email,
          username,
          user_login: username,
          key,
          reset_key: key,
          password,
        },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: { login: username, code: key, key, new_password: password, password },
      },
    ];

    let lastError: WpApiResult | null = null;
    for (const attempt of attempts) {
      const result = await sendResetRequest(
        endpoint,
        attempt.payload,
        attempt.contentType,
      );
      if (result.ok) {
        return NextResponse.json({
          ok: true,
          message: "Password reset successful. You can now sign in.",
        });
      }
      lastError = result;
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          lastError?.message ||
          "Unable to reset password. Please verify reset endpoint field requirements.",
      },
      { status: lastError?.status || 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to reset password.",
      },
      { status: 500 },
    );
  }
}
