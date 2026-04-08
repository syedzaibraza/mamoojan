import { NextResponse } from "next/server";
import { absoluteWpEndpoint } from "@/app/lib/auth/wordpress";

type ResetPasswordBody = {
  key?: string;
  id?: string | number;
  login?: string;
  password?: string;
};

type WpApiResult = {
  ok: boolean;
  status: number;
  message?: string;
};

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
    const key = body.key?.trim();
    const userId = body.id !== undefined ? String(body.id).trim() : "";
    const login = body.login?.trim() || "";
    const password = body.password;

    if (!key || !password || password.length < 8 || (!userId && !login)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Reset key, login/id, and 8+ char password are required.",
        },
        { status: 400 },
      );
    }

    const endpointCandidates =
      process.env.WP_RESET_PASSWORD_ENDPOINT ||
      "/wp-json/custom/v1/reset-password";
    const username = login;
    const attempts: Array<{
      payload: Record<string, string>;
      contentType: "application/json" | "application/x-www-form-urlencoded";
    }> = [
      {
        contentType: "application/json",
        payload: {
          login: username,
          username,
          user_login: username,
          id: userId,
          user_id: userId,
          key,
          reset_key: key,
          password,
        },
      },
      {
        contentType: "application/json",
        payload: {
          login: username,
          code: key,
          key,
          new_password: password,
          password,
        },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: {
          login: username,
          username,
          user_login: username,
          id: userId,
          user_id: userId,
          key,
          reset_key: key,
          password,
        },
      },
      {
        contentType: "application/x-www-form-urlencoded",
        payload: {
          login: username,
          code: key,
          key,
          new_password: password,
          password,
        },
      },
    ];

    let lastError: WpApiResult | null = null;
    for (const endpoint of endpointCandidates) {
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
        message:
          error instanceof Error ? error.message : "Unable to reset password.",
      },
      { status: 500 },
    );
  }
}
