import { NextResponse } from "next/server";
import { chargeCardToken, toAuthorizeNetAmount } from "@/app/lib/payments/authorizenet";
import { createWooOrder, markWooOrderFailed, markWooOrderPaid } from "@/app/lib/woocommerce/orders";

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
    state?: string;
    postcode: string;
    country: string;
  };
  shipping?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
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
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: CheckoutRequestBody) {
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
    });

    try {
      const paymentResult = await chargeCardToken({
        amount: toAuthorizeNetAmount(payload.cart.total),
        opaqueData: payload.opaqueData,
        invoiceNumber: order.number,
        customerEmail: payload.billing.email,
        orderDescription: `Woo order #${order.number}`,
      });

      if (!paymentResult.approved || !paymentResult.transactionId) {
        await markWooOrderFailed(order.id, paymentResult.rawMessage || "Payment declined.");
        return NextResponse.json(
          { ok: false, orderId: order.id, message: paymentResult.rawMessage || "Payment failed." },
          { status: 402 },
        );
      }

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
      await markWooOrderFailed(
        order.id,
        paymentError instanceof Error ? paymentError.message : "Payment processing failed.",
      );
      return NextResponse.json(
        {
          ok: false,
          orderId: order.id,
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
