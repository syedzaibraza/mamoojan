import { NextResponse } from "next/server";
import { getAuthToken } from "@/app/lib/auth/session";
import { getWordPressBaseUrl } from "@/app/lib/auth/wordpress";

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

type WpMe = {
  id: number;
  email?: string;
};

type JwtLoginResponse = {
  token?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ChangePasswordBody;
    const currentPassword = body.currentPassword || "";
    const newPassword = body.newPassword || "";

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, message: "Current password and 8+ character new password are required." },
        { status: 400 },
      );
    }

    const wpBase = getWordPressBaseUrl();

    // Identify current user from bearer token.
    const meRes = await fetch(`${wpBase}/wp-json/wp/v2/users/me?context=edit`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    const me = (await meRes.json().catch(() => null)) as WpMe | null;
    if (!meRes.ok || !me?.id || !me.email) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    // Verify current password by attempting JWT login with current credentials.
    const verifyRes = await fetch(`${wpBase}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username: me.email, password: currentPassword }),
      cache: "no-store",
    });
    const verifyData = (await verifyRes.json().catch(() => ({}))) as JwtLoginResponse;
    if (!verifyRes.ok || !verifyData.token) {
      return NextResponse.json(
        { ok: false, message: "Current password is incorrect." },
        { status: 400 },
      );
    }

    const updateRes = await fetch(`${wpBase}/wp-json/wp/v2/users/${me.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
      cache: "no-store",
    });

    const updateData = (await updateRes.json().catch(() => ({}))) as { message?: string };
    if (!updateRes.ok) {
      return NextResponse.json(
        { ok: false, message: updateData.message || "Unable to change password." },
        { status: updateRes.status || 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to change password.",
      },
      { status: 500 },
    );
  }
}
