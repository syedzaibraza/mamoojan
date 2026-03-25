import { CategoryPage } from "../../pages/CategoryPage";
import { mapWooToProduct } from "../../lib/woocommerce/mapWooToProduct";
import type { Product } from "../../data/products";

type WooCategory = { id: number; name: string; slug: string };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return <CategoryPage categoryName="All Products" products={[]} />;
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const perPage = 100;

  // Special virtual category.
  if (slug === "deals") {
    let page = 1;
    let mappedProducts: Product[] = [];

    while (true) {
      const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products`);
      endpoint.searchParams.set("consumer_key", wcKey);
      endpoint.searchParams.set("consumer_secret", wcSecret);
      endpoint.searchParams.set("per_page", String(perPage));
      endpoint.searchParams.set("page", String(page));
      endpoint.searchParams.set("status", "publish");
      endpoint.searchParams.set("on_sale", "true");

      const res = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) break;

      const data = (await res.json()) as unknown[];
      mappedProducts = [...mappedProducts, ...(data as any[]).map(mapWooToProduct)];

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? page);
      if (page >= totalPages) break;
      page += 1;
    }

    return <CategoryPage categoryName="Deals & Promotions" products={mappedProducts} />;
  }

  // Woo product categories are fetched separately so we can resolve slug -> id.
  const categories: WooCategory[] = [];
  {
    let catPage = 1;
    while (true) {
      const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/categories`);
      endpoint.searchParams.set("consumer_key", wcKey);
      endpoint.searchParams.set("consumer_secret", wcSecret);
      endpoint.searchParams.set("per_page", String(perPage));
      endpoint.searchParams.set("page", String(catPage));

      const res = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) break;

      const data = (await res.json()) as WooCategory[];
      categories.push(...data);

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? catPage);
      if (catPage >= totalPages) break;
      catPage += 1;
    }
  }

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name ?? "All Products";
  const categoryId = category?.id;

  if (!categoryId) {
    return <CategoryPage categoryName={categoryName} products={[]} />;
  }

  let page = 1;
  let mappedProducts: Product[] = [];

  while (true) {
    const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products`);
    endpoint.searchParams.set("consumer_key", wcKey);
    endpoint.searchParams.set("consumer_secret", wcSecret);
    endpoint.searchParams.set("per_page", String(perPage));
    endpoint.searchParams.set("page", String(page));
    endpoint.searchParams.set("status", "publish");
    // WooCommerce REST filter expects category ID.
    endpoint.searchParams.set("category", String(categoryId));

    const res = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) break;

    const data = (await res.json()) as unknown[];
    mappedProducts = [...mappedProducts, ...(data as any[]).map(mapWooToProduct)];

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? page);
    if (page >= totalPages) break;
    page += 1;
  }

  return <CategoryPage categoryName={categoryName} products={mappedProducts} />;
}

