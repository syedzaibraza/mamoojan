import { NextResponse } from "next/server";
import { getAuthToken } from "@/app/lib/auth/session";

type WpCurrentUser = {
  id: number;
  email?: string;
  name?: string;
  slug?: string;
};

function getWpBaseUrl() {
  const wcUrl = process.env.WC_URL;
  if (!wcUrl) {
    throw new Error("Missing WC_URL environment variable.");
  }
  return wcUrl.replace(/\/$/, "");
}

async function getWordPressMe(baseUrl: string, token: string) {
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/users/me?context=edit`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const user = (await res.json().catch(() => null)) as WpCurrentUser | null;
  return user;
}

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const wpUser = await getWordPressMe(getWpBaseUrl(), token);
    if (!wpUser) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const fullName = (wpUser.name || "").trim();
    const [firstName = "", ...rest] = fullName ? fullName.split(" ") : [];
    const lastName = rest.join(" ");

    return NextResponse.json({
      ok: true,
      customer: {
        id: wpUser.id,
        name: fullName || wpUser.slug || "Customer",
        firstName,
        lastName,
        email: (wpUser.email || "").trim().toLowerCase(),
        phone: "",
        address1: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      },
      orders: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to load account details.",
      },
      { status: 500 },
    );
  }
}
