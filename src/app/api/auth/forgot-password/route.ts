import { NextResponse } from "next/server";
import {
  absoluteWpEndpoint,
  getWordPressBaseUrl,
  getWooCredentials,
} from "@/app/lib/auth/wordpress";

type ForgotPasswordBody = {
  email?: string;
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
  raw?: unknown;
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

async function sendForgotRequest(
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
    raw: data,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordBody;
    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "Email is required." },
        { status: 400 },
      );
    }

    const endpoint =
      process.env.WP_FORGOT_PASSWORD_ENDPOINT ||
      "/wp-json/custom/v1/customer-reset-password";
    const username = (await getWpUsernameByEmail(email)) || email;
    const attempts: Array<{
      payload: Record<string, string>;
      contentType: "application/json" | "application/x-www-form-urlencoded";
    }> = [
      {
        contentType: "application/json",
        payload: { email, user_email: email, username, user_login: username },
      },
      { contentType: "application/json", payload: { login: username } },
      { contentType: "application/json", payload: { user_login: username } },
      { contentType: "application/json", payload: { email } },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: { email, user_email: email, username, user_login: username },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: { login: username },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: { user_login: username },
      },
      { contentType: "application/x-www-form-urlencoded", payload: { email } },
    ];

    let lastError: WpApiResult | null = null;
    for (const attempt of attempts) {
      const result = await sendForgotRequest(
        endpoint,
        attempt.payload,
        attempt.contentType,
      );
      if (result.ok) {
        return NextResponse.json({
          ok: true,
          message:
            "If an account exists, reset instructions were sent to your email.",
        });
      }
      lastError = result;
    }

    return NextResponse.json(
      {
        ok: false,
        message:
          lastError?.message ||
          "Unable to send reset email. Please verify the WordPress reset endpoint settings.",
      },
      { status: lastError?.status || 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unable to process request.",
      },
      { status: 500 },
    );
  }
}
