import { NextResponse } from "next/server";
import { getAuthToken } from "@/app/lib/auth/session";

type WpCurrentUser = {
  id: number;
  email?: string;
};

type WpOrder = {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  line_items?: Array<{ quantity?: number }>;
  billing?: { email?: string };
};

function getWooEnv() {
  const wcUrl = process.env.WC_URL?.replace(/\/$/, "");
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;
  if (!wcUrl || !wcKey || !wcSecret) {
    throw new Error("Missing WooCommerce environment variables.");
  }
  return { wcUrl, wcKey, wcSecret };
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

async function requestJson<T>(url: URL) {
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as T | null;
  if (!res.ok || !data) {
    throw new Error("Failed to fetch orders.");
  }
  return data;
}

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { wcUrl, wcKey, wcSecret } = getWooEnv();
    const wpUser = await getWordPressMe(wcUrl, token);
    const userEmail = wpUser?.email?.trim().toLowerCase();
    if (!wpUser?.id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const byCustomerUrl = new URL(`${wcUrl}/wp-json/wc/v3/orders`);
    byCustomerUrl.searchParams.set("consumer_key", wcKey);
    byCustomerUrl.searchParams.set("consumer_secret", wcSecret);
    byCustomerUrl.searchParams.set("customer", String(wpUser.id));
    byCustomerUrl.searchParams.set("per_page", "20");

    const byEmailUrl = new URL(`${wcUrl}/wp-json/wc/v3/orders`);
    byEmailUrl.searchParams.set("consumer_key", wcKey);
    byEmailUrl.searchParams.set("consumer_secret", wcSecret);
    byEmailUrl.searchParams.set("per_page", "20");
    if (userEmail) {
      byEmailUrl.searchParams.set("search", userEmail);
    }

    const [ordersByCustomer, ordersByEmailSearch] = await Promise.all([
      requestJson<WpOrder[]>(byCustomerUrl),
      userEmail ? requestJson<WpOrder[]>(byEmailUrl) : Promise.resolve([] as WpOrder[]),
    ]);

    const ordersByEmail = userEmail
      ? ordersByEmailSearch.filter(
          (order) => (order.billing?.email || "").trim().toLowerCase() === userEmail,
        )
      : [];

    const mergedOrders = [...ordersByCustomer, ...ordersByEmail];
    const dedupedOrders = Array.from(
      new Map(mergedOrders.map((order) => [order.id, order])).values(),
    );
    dedupedOrders.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
    );

    return NextResponse.json({
      ok: true,
      orders: dedupedOrders.map((order) => ({
        id: order.id,
        number: order.number,
        dateCreated: order.date_created,
        status: order.status,
        total: Number(order.total || 0),
        items: order.line_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to load orders.",
      },
      { status: 500 },
    );
  }
}
