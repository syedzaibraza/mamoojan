import { ProductPage } from "../../pages/ProductPage";
import { mapWooToProduct } from "../../lib/woocommerce/mapWooToProduct";
import type { Product } from "../../data/products";

type WooProductLike = {
  id: number;
  categories?: Array<{ id: number; name: string; slug: string }>;
  type?: string;
  attributes?: Array<{ name: string; variation?: boolean; options?: string[] }>;
};

type WooVariationLike = {
  id: number;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  stock_status?: string;
  stock_quantity?: number;
  image?: { src?: string };
  attributes?: Array<{ name: string; option: string }>;
};

function createEmptyProduct(id: string): Product {
  return {
    id,
    name: "",
    brand: "",
    price: 0,
    rating: 0,
    reviewCount: 0,
    image: "/Mamoojan-Logo.png",
    category: "",
    healthGoals: [],
    labels: [],
    dietTypes: [],
    description: "",
    benefits: [],
    ingredients: "",
    dosage: "",
    inStock: false,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const wcUrlRaw = process.env.WC_URL;
  const wcKey = process.env.WC_KEY;
  const wcSecret = process.env.WC_SECRET;
  const requestTimeoutMs = 15_000;

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} />;
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const productIdNum = Number(id);

  // Fetch single product.
  const productEndpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/${productIdNum}`);
  productEndpoint.searchParams.set("consumer_key", wcKey);
  productEndpoint.searchParams.set("consumer_secret", wcSecret);

  let productRes: Response;
  try {
    productRes = await fetch(productEndpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} />;
  }

  if (!productRes.ok) {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} />;
  }

  const wooProduct = (await productRes.json()) as any as WooProductLike;
  const baseProduct = mapWooToProduct(wooProduct as any);

  const attributes =
    wooProduct.attributes?.map((a) => ({
      name: a.name,
      variation: Boolean(a.variation),
      options: Array.isArray(a.options) ? a.options : [],
    })) ?? [];

  const variationAttributes = attributes.filter((a) => a.variation);

  let variations: NonNullable<Product["variations"]> = [];
  if ((wooProduct.type ?? "") === "variable" || variationAttributes.length > 0) {
    const variationsEndpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/${productIdNum}/variations`);
    variationsEndpoint.searchParams.set("consumer_key", wcKey);
    variationsEndpoint.searchParams.set("consumer_secret", wcSecret);
    variationsEndpoint.searchParams.set("per_page", "100");
    variationsEndpoint.searchParams.set("page", "1");

    try {
      const res = await fetch(variationsEndpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
      if (res.ok) {
        const data = (await res.json()) as WooVariationLike[];
        variations = data.map((v) => {
          const price = Number(v.price ?? v.sale_price ?? v.regular_price ?? 0);
          const regular = v.regular_price ? Number(v.regular_price) : undefined;
          const sale = v.sale_price ? Number(v.sale_price) : undefined;
          const inStock =
            v.stock_status === "instock" ||
            (typeof v.stock_quantity === "number" ? v.stock_quantity > 0 : false);
          const stockCount = typeof v.stock_quantity === "number" ? v.stock_quantity : undefined;

          const attrRecord: Record<string, string> = {};
          for (const a of v.attributes ?? []) {
            const key = (a.name ?? "").trim().toLowerCase();
            if (!key) continue;
            attrRecord[key] = a.option;
          }

          return {
            id: String(v.id),
            price: Number.isFinite(price) ? price : 0,
            originalPrice:
              regular && sale && sale > 0 && regular > sale ? regular : undefined,
            inStock,
            stockCount,
            image: v.image?.src,
            attributes: attrRecord,
          };
        });
      }
    } catch {
      // No variations available (network issue); keep product usable.
      variations = [];
    }
  }

  const product: Product = {
    ...baseProduct,
    attributes: variationAttributes,
    variations,
  };
  console.log('product', product);
  console.log('wooProduct', wooProduct);
  console.log('baseProduct', baseProduct);

  // Fetch a few related products from the first Woo category.
  const firstCategoryId = wooProduct.categories?.[0]?.id;
  let relatedProducts: Product[] = [];
  if (firstCategoryId) {
    const endpoint = new URL(`${wcUrl}/wp-json/wc/v3/products`);
    endpoint.searchParams.set("consumer_key", wcKey);
    endpoint.searchParams.set("consumer_secret", wcSecret);
    endpoint.searchParams.set("per_page", "4");
    endpoint.searchParams.set("page", "1");
    endpoint.searchParams.set("status", "publish");
    endpoint.searchParams.set("category", String(firstCategoryId));

    let res: Response;
    try {
      res = await fetch(endpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
    } catch {
      res = new Response(null, { status: 599 });
    }

    if (res.ok) {
      const data = (await res.json()) as any[];
      relatedProducts = data.map((p) => mapWooToProduct(p as any));
    }
  }

  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}

