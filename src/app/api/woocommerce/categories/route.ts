import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count?: number;
};

type WooCategoryResponse = {
  page: number;
  per_page: number;
  total: number | undefined;
  total_pages: number | undefined;
  categories: WooCategory[];
};

function toInt(value: string | null, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export async function GET(req: Request): Promise<NextResponse<WooCategoryResponse> | Response> {
  const url = new URL(req.url);
  const perPage = Math.min(Math.max(toInt(url.searchParams.get("per_page"), 100), 1), 100);
  const page = Math.max(toInt(url.searchParams.get("page"), 1), 1);

  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return NextResponse.json(
      {
        page,
        per_page: perPage,
        total: undefined,
        total_pages: undefined,
        categories: [],
        error: "Missing WooCommerce environment variables",
        required: ["WC_URL", "WC_KEY", "WC_SECRET"],
      } as unknown as WooCategoryResponse,
      { status: 500 }
    );
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/categories`);
  endpoint.searchParams.set("consumer_key", wcKey);
  endpoint.searchParams.set("consumer_secret", wcSecret);
  endpoint.searchParams.set("per_page", String(perPage));
  endpoint.searchParams.set("page", String(page));

  const res = await fetch(endpoint.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json(
      {
        page,
        per_page: perPage,
        total: undefined,
        total_pages: undefined,
        categories: [],
        error: "Failed to fetch WooCommerce categories",
        status: res.status,
        details: text || undefined,
      } as unknown as WooCategoryResponse,
      { status: res.status }
    );
  }

  const total = res.headers.get("X-WP-Total");
  const totalPages = res.headers.get("X-WP-TotalPages");

  const data = (await res.json()) as Array<{
    id: number;
    name: string;
    slug: string;
    parent: number;
    count?: number;
  }>;

  const categories: WooCategory[] = data.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parent: c.parent,
    count: c.count,
  }));

  return NextResponse.json({
    page,
    per_page: perPage,
    total: total ? Number(total) : undefined,
    total_pages: totalPages ? Number(totalPages) : undefined,
    categories,
  });
}

