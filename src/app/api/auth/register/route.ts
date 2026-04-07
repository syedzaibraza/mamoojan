import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/app/lib/auth/session";
import { getWordPressBaseUrl, getWooCredentials } from "@/app/lib/auth/wordpress";

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

type WooCustomerCreateResponse = {
  id: number;
  email: string;
};

type JwtLoginResponse = {
  token?: string;
  message?: string;
};

function makeUsernameFromEmail(email: string) {
  const [local] = email.split("@");
  const clean = (local || "user").replace(/[^a-zA-Z0-9._-]/g, "");
  const suffix = Math.floor(Math.random() * 10000);
  return `${clean || "user"}_${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;
    const firstName = body.firstName?.trim() || "";
    const lastName = body.lastName?.trim() || "";
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!firstName || !lastName || !email || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "First name, last name, email, and 8+ char password are required." },
        { status: 400 },
      );
    }

    const { wcKey, wcSecret } = getWooCredentials();
    const wpBase = getWordPressBaseUrl();

    const createCustomerUrl = new URL(`${wpBase}/wp-json/wc/v3/customers`);
    createCustomerUrl.searchParams.set("consumer_key", wcKey);
    createCustomerUrl.searchParams.set("consumer_secret", wcSecret);

    const createRes = await fetch(createCustomerUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        username: makeUsernameFromEmail(email),
        password,
      }),
    });

    const createData = (await createRes.json().catch(() => ({}))) as WooCustomerCreateResponse & {
      message?: string;
      code?: string;
      data?: { status?: number };
    };

    if (!createRes.ok) {
      const message =
        createData?.message ||
        (createData?.code === "registration-error-email-exists"
          ? "An account with this email already exists."
          : "Registration failed.");
      return NextResponse.json({ ok: false, message }, { status: createRes.status || 400 });
    }

    const loginRes = await fetch(`${wpBase}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username: email, password }),
      cache: "no-store",
    });
    const loginData = (await loginRes.json().catch(() => ({}))) as JwtLoginResponse;

    const response = NextResponse.json({
      ok: true,
      customerId: createData.id,
      email: createData.email || email,
    });

    if (loginRes.ok && loginData.token) {
      response.cookies.set(AUTH_COOKIE_NAME, loginData.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Registration failed.",
      },
      { status: 500 },
    );
  }
}
