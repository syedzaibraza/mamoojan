import type { Product } from "../data/products";
import { ShopClient } from "./ShopClient";

export const dynamic = "force-dynamic";

type WooCategory = { id: number; name: string; slug: string };
type WooTag = { id: number; name: string; slug: string };
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
  categories?: WooCategory[];
  tags?: WooTag[];
  short_description?: string;
};

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function toPriceNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapWooToProduct(p: WooProduct): Product {
  const categories = p.categories ?? [];
  const tags = p.tags ?? [];

  const firstCategory = categories[0]?.name ?? "Uncategorized";
  const brand = tags[0]?.name ?? firstCategory;

  const createdAt = p.date_created ? new Date(p.date_created) : undefined;
  const isNew =
    createdAt && Number.isFinite(createdAt.getTime())
      ? Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30
      : false;

  const labelSet = new Set<string>();
  const tagBlob = tags.map((t) => t.name).join(" ");
  if (p.on_sale || (p.sale_price != null && Number(p.sale_price) > 0)) labelSet.add("Sale");
  if (/(best[-\\s_]?seller|bestseller)/i.test(tagBlob)) labelSet.add("Best Seller");
  if (isNew) labelSet.add("New");

  const knownDietTypes = [
    "Natural",
    "Vegetarian",
    "Eco-Friendly",
    "Reusable",
    "Herbal",
    "Liquid Formula",
    "Easy to Take",
    "Himalayan",
    "No Artificial Colors",
    "Organic",
    "Chemical-Free",
    "BPA-Free",
    "BPA free",
    "Eco Paper",
    "Multi-Pack",
    "Indoor/Outdoor",
  ];
  const dietTypes = tags
    .map((t) => t.name)
    .filter((name) => knownDietTypes.some((d) => d.toLowerCase() === name.toLowerCase()))
    .slice(0, 4);

  const short = p.short_description ? stripHtml(p.short_description) : "";

  const price = toPriceNumber(p.price ?? p.regular_price, 0);
  const regularPrice = p.regular_price ? toPriceNumber(p.regular_price, 0) : undefined;
  const salePrice = p.sale_price ? toPriceNumber(p.sale_price, 0) : undefined;

  const inStock =
    p.stock_status === "instock" || (typeof p.stock_quantity === "number" ? p.stock_quantity > 0 : false);
  const stockCount = typeof p.stock_quantity === "number" ? p.stock_quantity : undefined;

  const rating = p.average_rating ? Number(p.average_rating) : 4.5;
  const reviewCount = p.rating_count ?? 0;

  return {
    id: String(p.id),
    name: p.name,
    brand,
    category: firstCategory,
    price,
    originalPrice:
      regularPrice && salePrice && salePrice > 0 && regularPrice > salePrice ? regularPrice : undefined,
    rating: Number.isFinite(rating) ? rating : 4.5,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    image: p.images?.[0]?.src ?? "/Mamoojan-Logo.png",
    labels: Array.from(labelSet),
    healthGoals: [],
    dietTypes,
    description: short || p.name,
    short_description: short || p.name,
    benefits: short
      ? short
          .split(". ")
          .slice(0, 4)
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    ingredients: "",
    dosage: "",
    inStock,
    stockCount,
  };
}

function categoryNameToSlug(categoryName: string) {
  return categoryName
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function ShopPage() {
  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Shop</h1>
        <p className="text-muted-foreground mt-3">WooCommerce credentials are missing on the server.</p>
      </div>
    );
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const perPage = 100;
  const requestTimeoutMs = 15_000;

  let page = 1;
  let mappedProducts: Product[] = [];

  // Fetch Woo categories once for the filter sidebar.
  // We derive a slug from category name (same normalization logic used by ShopClient).
  type WooCategory = { id: number; name: string; slug: string; parent?: number };
  let mappedCategories: Array<{ name: string; slug: string }> = [];
  {
    let catPage = 1;
    let allCats: WooCategory[] = [];
    while (true) {
      const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/categories`);
      endpoint.searchParams.set("consumer_key", wcKey);
      endpoint.searchParams.set("consumer_secret", wcSecret);
      endpoint.searchParams.set("per_page", String(perPage));
      endpoint.searchParams.set("page", String(catPage));

      let res: Response;
      try {
        res = await fetch(endpoint.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(requestTimeoutMs),
        });
      } catch {
        // Network/SSL/DNS issues should not take the whole Shop page down.
        break;
      }

      if (!res.ok) break;

      const data = (await res.json()) as WooCategory[];
      allCats = [...allCats, ...data];

      const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? catPage);
      if (catPage >= totalPages) break;
      catPage += 1;
    }

    mappedCategories = allCats.map((c) => ({
      name: c.name,
      slug: categoryNameToSlug(c.name),
    }));
  }

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
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Shop</h1>
          <p className="text-destructive mt-3">Failed to fetch products from WooCommerce (network error).</p>
        </div>
      );
    }

    if (!res.ok) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Shop</h1>
          <p className="text-destructive mt-3">Failed to fetch products from WooCommerce (HTTP {res.status}).</p>
        </div>
      );
    }

    const data = (await res.json()) as WooProduct[];
    mappedProducts = [...mappedProducts, ...data.map(mapWooToProduct)];

    const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? page);
    if (page >= totalPages) break;
    page += 1;
  }

  return <ShopClient products={mappedProducts} categories={mappedCategories} />;
}
