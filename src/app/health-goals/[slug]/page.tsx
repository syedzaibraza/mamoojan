import { HealthGoalPage } from "../../pages/HealthGoalPage";
import { mapWooToProduct } from "../../lib/woocommerce/mapWooToProduct";
import type { Product } from "../../data/products";

export default async function Page() {
  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return <HealthGoalPage products={[]} />;
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const perPage = 100;

  let page = 1;
  let mappedProducts: Product[] = [];

  while (true) {
    const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products`);
    endpoint.searchParams.set("consumer_key", wcKey);
    endpoint.searchParams.set("consumer_secret", wcSecret);
    endpoint.searchParams.set("per_page", String(perPage));
    endpoint.searchParams.set("page", String(page));
    endpoint.searchParams.set("status", "publish");

    const res = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) break;

    const data = (await res.json()) as any[];
    mappedProducts = [...mappedProducts, ...data.map((p) => mapWooToProduct(p))];

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? page);
    if (page >= totalPages) break;
    page += 1;
  }

  return <HealthGoalPage products={mappedProducts} />;
}

