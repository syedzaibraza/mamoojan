import { NextResponse } from "next/server";
import { chargeCardToken, toAuthorizeNetAmount } from "@/app/lib/payments/authorizenet";
import { createWooCustomer, createWooOrder, markWooOrderPaid } from "@/app/lib/woocommerce/orders";

type CheckoutRequestBody = {
  opaqueData: {
    dataDescriptor: string;
    dataValue: string;
  };
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  cart: {
    items: Array<{
      lineId: string;
      productId: number;
      variationId?: number;
      quantity: number;
      unitPrice: number;
      name: string;
    }>;
    shippingTotal: number;
    couponCode?: string;
    discountPercent?: number;
    total: number;
  };
  customerNote?: string;
  createAccount?: boolean;
  accountPassword?: string;
};

function buildAuthorizeNetInvoiceNumber() {
  // Authorize.net invoiceNumber max length is 20 characters.
  // Example output: HD-250330-123456 (15 chars)
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `HD-${yy}${mm}${dd}-${random}`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: CheckoutRequestBody) {
  const allowedCountries = new Set(["USA", "US", "UNITED STATES", "UNITED STATES OF AMERICA"]);

  if (!payload?.opaqueData?.dataDescriptor || !payload?.opaqueData?.dataValue) {
    throw new Error("Missing secure payment token.");
  }
  if (!isNonEmptyString(payload.billing.firstName) || !isNonEmptyString(payload.billing.lastName)) {
    throw new Error("Billing name is required.");
  }
  if (!isNonEmptyString(payload.billing.email) || !payload.billing.email.includes("@")) {
    throw new Error("A valid billing email is required.");
  }
  if (!isNonEmptyString(payload.billing.phone)) {
    throw new Error("A valid billing phone number is required.");
  }
  if (!isNonEmptyString(payload.billing.state)) {
    throw new Error("Billing state is required.");
  }
  const billingCountry = payload.billing.country?.trim().toUpperCase();
  if (!billingCountry || !allowedCountries.has(billingCountry)) {
    throw new Error("We currently deliver only within USA.");
  }
  if (payload.shipping) {
    const shippingCountry = payload.shipping.country?.trim().toUpperCase();
    if (!shippingCountry || !allowedCountries.has(shippingCountry)) {
      throw new Error("We currently deliver only within USA.");
    }
  }
  if (!Array.isArray(payload.cart?.items) || payload.cart.items.length === 0) {
    throw new Error("Cart cannot be empty.");
  }
  for (const item of payload.cart.items) {
    if (!Number.isFinite(item.productId) || item.productId <= 0) {
      throw new Error("Invalid product in cart.");
    }
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
      throw new Error("Invalid quantity in cart.");
    }
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      throw new Error("Invalid item price in cart.");
    }
  }
  if (!Number.isFinite(payload.cart.total) || payload.cart.total <= 0) {
    throw new Error("Invalid checkout total.");
  }
  if (payload.createAccount) {
    if (!isNonEmptyString(payload.accountPassword) || payload.accountPassword.length < 8) {
      throw new Error("Account password must be at least 8 characters.");
    }
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutRequestBody;
    validatePayload(payload);

    const shipping = payload.shipping ?? {
      firstName: payload.billing.firstName,
      lastName: payload.billing.lastName,
      address1: payload.billing.address1,
      address2: payload.billing.address2,
      city: payload.billing.city,
      state: payload.billing.state,
      postcode: payload.billing.postcode,
      country: payload.billing.country,
    };

    try {
      const paymentResult = await chargeCardToken({
        amount: toAuthorizeNetAmount(payload.cart.total),
        opaqueData: payload.opaqueData,
        invoiceNumber: buildAuthorizeNetInvoiceNumber(),
        customerEmail: payload.billing.email,
        orderDescription: "Headless WooCommerce checkout",
      });

      if (!paymentResult.approved || !paymentResult.transactionId) {
        return NextResponse.json(
          { ok: false, message: paymentResult.rawMessage || "Payment failed." },
          { status: 402 },
        );
      }

      let customerId: number | undefined;
      if (payload.createAccount) {
        try {
          const customer = await createWooCustomer({
            email: payload.billing.email.trim().toLowerCase(),
            password: payload.accountPassword!,
            firstName: payload.billing.firstName.trim(),
            lastName: payload.billing.lastName.trim(),
          });
          customerId = customer.id;
        } catch {
          // If customer already exists, proceed as guest checkout instead of failing payment.
          customerId = undefined;
        }
      }

      const order = await createWooOrder({
        billing: payload.billing,
        shipping: {
          ...shipping,
          email: payload.billing.email,
          phone: payload.billing.phone,
        },
        items: payload.cart.items.map((item) => ({
          productId: item.productId,
          variationId: item.variationId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          name: item.name,
        })),
        shippingTotal: payload.cart.shippingTotal || 0,
        couponLines: payload.cart.couponCode ? [{ code: payload.cart.couponCode }] : [],
        customerNote: payload.customerNote,
        customerId,
      });

      await markWooOrderPaid(
        order.id,
        paymentResult.transactionId,
        `Authorize.net payment captured. Transaction ID: ${paymentResult.transactionId}`,
      );

      return NextResponse.json({
        ok: true,
        orderId: order.id,
        orderNumber: order.number,
        transactionId: paymentResult.transactionId,
        message: "Payment successful.",
      });
    } catch (paymentError) {
      return NextResponse.json(
        {
          ok: false,
          message: paymentError instanceof Error ? paymentError.message : "Payment processing failed.",
        },
        { status: 402 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Invalid request.",
      },
      { status: 400 },
    );
  }
}
