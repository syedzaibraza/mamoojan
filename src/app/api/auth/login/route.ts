import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/app/lib/auth/session";
import { getWordPressBaseUrl } from "@/app/lib/auth/wordpress";

type JwtLoginResponse = {
  token?: string;
  user_email?: string;
  user_display_name?: string;
  message?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    const endpoint = `${getWordPressBaseUrl()}/wp-json/jwt-auth/v1/token`;
    const wpRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username: email, password }),
      cache: "no-store",
    });

    const data = (await wpRes.json().catch(() => ({}))) as JwtLoginResponse;
    if (!wpRes.ok || !data.token) {
      const errorMessage =
        wpRes.status === 404
          ? "JWT auth endpoint not found. Enable a WordPress JWT auth plugin."
          : data.message || "Invalid email or password.";
      return NextResponse.json({ ok: false, message: errorMessage }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      user: {
        email: data.user_email || email,
        name: data.user_display_name || "",
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Login failed.",
      },
      { status: 500 },
    );
  }
}
