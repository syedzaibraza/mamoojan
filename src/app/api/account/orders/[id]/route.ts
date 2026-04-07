import { NextResponse } from "next/server";
import { getAuthToken } from "@/app/lib/auth/session";

type WpCurrentUser = { id: number; email?: string };

type WpOrderDetail = {
  id: number;
  number: string;
  date_created: string;
  status: string;
  total: string;
  subtotal?: string;
  shipping_total?: string;
  discount_total?: string;
  payment_method_title?: string;
  line_items?: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    subtotal?: string;
  }>;
  billing?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  customer_id?: number;
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
  return (await res.json().catch(() => null)) as WpCurrentUser | null;
}

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const orderId = Number(id);
    if (!Number.isFinite(orderId) || orderId <= 0) {
      return NextResponse.json({ ok: false, message: "Invalid order id." }, { status: 400 });
    }

    const { wcUrl, wcKey, wcSecret } = getWooEnv();
    const wpUser = await getWordPressMe(wcUrl, token);
    if (!wpUser?.id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const orderUrl = new URL(`${wcUrl}/wp-json/wc/v3/orders/${orderId}`);
    orderUrl.searchParams.set("consumer_key", wcKey);
    orderUrl.searchParams.set("consumer_secret", wcSecret);

    const res = await fetch(orderUrl.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const order = (await res.json().catch(() => null)) as WpOrderDetail | null;
    if (!res.ok || !order) {
      return NextResponse.json({ ok: false, message: "Order not found." }, { status: res.status || 404 });
    }

    const billingEmail = (order.billing?.email || "").trim().toLowerCase();
    const userEmail = (wpUser.email || "").trim().toLowerCase();
    const isCustomerOwner = order.customer_id === wpUser.id;
    const isBillingEmailMatch = Boolean(userEmail) && billingEmail === userEmail;

    if (!isCustomerOwner && !isBillingEmailMatch) {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        number: order.number,
        dateCreated: order.date_created,
        status: order.status,
        total: Number(order.total || 0),
        subtotal: Number(order.subtotal || 0),
        shippingTotal: Number(order.shipping_total || 0),
        discountTotal: Number(order.discount_total || 0),
        paymentMethodTitle: order.payment_method_title || "",
        lineItems: (order.line_items || []).map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          total: Number(item.total || 0),
          subtotal: Number(item.subtotal || 0),
        })),
        billing: {
          name: `${order.billing?.first_name || ""} ${order.billing?.last_name || ""}`.trim(),
          email: order.billing?.email || "",
          phone: order.billing?.phone || "",
          address1: order.billing?.address_1 || "",
          city: order.billing?.city || "",
          state: order.billing?.state || "",
          postcode: order.billing?.postcode || "",
          country: order.billing?.country || "",
        },
        shipping: {
          name: `${order.shipping?.first_name || ""} ${order.shipping?.last_name || ""}`.trim(),
          address1: order.shipping?.address_1 || "",
          city: order.shipping?.city || "",
          state: order.shipping?.state || "",
          postcode: order.shipping?.postcode || "",
          country: order.shipping?.country || "",
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load order." },
      { status: 500 },
    );
  }
}
