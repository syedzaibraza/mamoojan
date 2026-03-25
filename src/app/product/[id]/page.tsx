import { ProductPage } from "../../pages/ProductPage";
import { mapWooToProduct } from "../../lib/woocommerce/mapWooToProduct";
import type { Product } from "../../data/products";

type WooProductLike = {
  id: number;
  categories?: Array<{ id: number; name: string; slug: string }>;
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

  if (!wcUrlRaw || !wcKey || !wcSecret) {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} />;
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const productIdNum = Number(id);

  // Fetch single product.
  const productEndpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/${productIdNum}`);
  productEndpoint.searchParams.set("consumer_key", wcKey);
  productEndpoint.searchParams.set("consumer_secret", wcSecret);

  const productRes = await fetch(productEndpoint.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!productRes.ok) {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} />;
  }

  const wooProduct = (await productRes.json()) as any as WooProductLike;
  const product = mapWooToProduct(wooProduct as any);

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

    const res = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = (await res.json()) as any[];
      relatedProducts = data.map((p) => mapWooToProduct(p as any));
    }
  }

  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}

