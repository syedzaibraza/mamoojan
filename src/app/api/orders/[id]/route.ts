import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const wcUrl = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrl || !wcKey || !wcSecret) {
    return NextResponse.json(
      { error: "WooCommerce configuration missing" },
      { status: 500 },
    );
  }

  const orderId = params.id;
  const url = `${wcUrl}/wp-json/wc/v3/orders/${orderId}?consumer_key=${wcKey}&consumer_secret=${wcSecret}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
