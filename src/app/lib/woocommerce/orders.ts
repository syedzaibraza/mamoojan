type CheckoutAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type CheckoutLineItem = {
  productId: number;
  variationId?: number;
  quantity: number;
  unitPrice: number;
  name: string;
};

type CheckoutCoupon = {
  code: string;
};

type CreateWooOrderInput = {
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  items: CheckoutLineItem[];
  shippingTotal: number;
  couponLines?: CheckoutCoupon[];
  customerNote?: string;
  customerId?: number;
};

export type WooOrder = {
  id: number;
  number: string;
  status: string;
  total: string;
};

type WooCustomer = {
  id: number;
  email: string;
};

function wcBaseUrl() {
  const wcUrl = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;
  if (!wcUrl || !wcKey || !wcSecret) {
    throw new Error("Missing WC_URL, WC_KEY, or WC_SECRET.");
  }
  return {
    base: wcUrl.replace(/\/$/, ""),
    key: wcKey,
    secret: wcSecret,
  };
}

function toMoney(value: number): string {
  return value.toFixed(2);
}

async function wooRequest<T>(
  method: "POST" | "PUT",
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { base, key, secret } = wcBaseUrl();
  const url = new URL(`${base}/wp-json/wc/v3${path}`);
  url.searchParams.set("consumer_key", key);
  url.searchParams.set("consumer_secret", secret);

  const response = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
    data?: { message?: string };
  };
  if (!response.ok) {
    const message = data?.message || data?.data?.message || "WooCommerce API request failed.";
    throw new Error(message);
  }
  return data as T;
}

export async function createWooOrder(input: CreateWooOrderInput): Promise<WooOrder> {
  const lineItems = input.items.map((item) => ({
    product_id: item.productId,
    variation_id: item.variationId || undefined,
    quantity: item.quantity,
    subtotal: toMoney(item.unitPrice * item.quantity),
    total: toMoney(item.unitPrice * item.quantity),
    name: item.name,
  }));

  return wooRequest<WooOrder>("POST", "/orders", {
    status: "pending",
    set_paid: false,
    payment_method:
      process.env.AUTHORIZE_NET_PAYMENT_METHOD_ID ||
      process.env.AUTHNET_PAYMENT_METHOD_ID ||
      "authorize_net_headless",
    payment_method_title:
      process.env.AUTHORIZE_NET_PAYMENT_METHOD_TITLE ||
      process.env.AUTHNET_PAYMENT_METHOD_TITLE ||
      "Credit Card (Authorize.net)",
    customer_id: input.customerId,
    billing: {
      first_name: input.billing.firstName,
      last_name: input.billing.lastName,
      email: input.billing.email,
      phone: input.billing.phone || "",
      address_1: input.billing.address1,
      address_2: input.billing.address2 || "",
      city: input.billing.city,
      state: input.billing.state,
      postcode: input.billing.postcode,
      country: input.billing.country,
    },
    shipping: {
      first_name: input.shipping.firstName,
      last_name: input.shipping.lastName,
      address_1: input.shipping.address1,
      address_2: input.shipping.address2 || "",
      city: input.shipping.city,
      state: input.shipping.state,
      postcode: input.shipping.postcode,
      country: input.shipping.country,
    },
    line_items: lineItems,
    shipping_lines: input.shippingTotal
      ? [{ method_id: "flat_rate", method_title: "Shipping", total: toMoney(input.shippingTotal) }]
      : [],
    coupon_lines: input.couponLines?.map((coupon) => ({ code: coupon.code })) ?? [],
    customer_note: input.customerNote || "",
  });
}

export async function createWooCustomer(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}): Promise<WooCustomer> {
  return wooRequest<WooCustomer>("POST", "/customers", {
    email: input.email,
    password: input.password,
    first_name: input.firstName,
    last_name: input.lastName,
    username: input.username || input.email.split("@")[0],
  });
}

export async function markWooOrderPaid(orderId: number, transactionId: string, note?: string) {
  const order = await wooRequest<WooOrder>("PUT", `/orders/${orderId}`, {
    status: "processing",
    set_paid: true,
    transaction_id: transactionId,
    meta_data: [{ key: "_authorize_net_transaction_id", value: transactionId }],
  });
  if (note) {
    await addWooOrderNote(orderId, note, false);
  }
  return order;
}

export async function markWooOrderFailed(orderId: number, note: string) {
  const order = await wooRequest<WooOrder>("PUT", `/orders/${orderId}`, {
    status: "failed",
    set_paid: false,
  });
  await addWooOrderNote(orderId, note, false);
  return order;
}

export async function addWooOrderNote(orderId: number, note: string, customerNote = false) {
  return wooRequest("POST", `/orders/${orderId}/notes`, {
    note,
    customer_note: customerNote,
  });
}
