import type { Product } from "../data/products";
import { ShopClient } from "./ShopClient";
import { mapWooToProduct } from "../lib/woocommerce/mapWooToProduct";

export const dynamic = "force-dynamic";

type WooImage = { id: number; src: string };

type WooProduct = {
  id: number;
  name: string;
  slug: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  stock_status?: string;
  stock_quantity?: number;
  average_rating?: string;
  rating_count?: number;
  date_created?: string;
  on_sale?: boolean;
  images?: WooImage[];
  categories?: Array<{ id: number; name: string; slug: string }>;
  tags?: Array<{ id: number; name: string; slug: string }>;
  short_description?: string;
  featured?: boolean;
};

export default async function ShopPage() {
  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "28px",
          }}
        >
          Shop
        </h1>
        <p className="text-muted-foreground mt-3">
          WooCommerce credentials are missing on the server.
        </p>
      </div>
    );
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const perPage = 100;
  const requestTimeoutMs = 15_000;

  let page = 1;
  let mappedProducts: Product[] = [];

  while (true) {
    const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products`);
    endpoint.searchParams.set("consumer_key", wcKey);
    endpoint.searchParams.set("consumer_secret", wcSecret);
    endpoint.searchParams.set("per_page", String(perPage));
    endpoint.searchParams.set("page", String(page));
    endpoint.searchParams.set("status", "publish");

    let res: Response;
    try {
      res = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
    } catch {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            Shop
          </h1>
          <p className="text-destructive mt-3">
            Failed to fetch products from WooCommerce (network error).
          </p>
        </div>
      );
    }

    if (!res.ok) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            Shop
          </h1>
          <p className="text-destructive mt-3">
            Failed to fetch products from WooCommerce (HTTP {res.status}).
          </p>
        </div>
      );
    }

    const data = (await res.json()) as WooProduct[];
    mappedProducts = [...mappedProducts, ...data.map(mapWooToProduct)];

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? page);
    if (page >= totalPages) break;
    page += 1;
  }

  return <ShopClient products={mappedProducts} />;
}
