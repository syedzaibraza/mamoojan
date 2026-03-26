import { ProductPage } from "../../pages/ProductPage";
import type { ProductReview } from "../../pages/ProductPage";
import { mapWooToProduct } from "../../lib/woocommerce/mapWooToProduct";
import type { Product } from "../../data/products";

type WooProductLike = {
  average_rating: number;
  id: number;
  type?: string;
  description?: string;
  short_description?: string;
  images?: Array<{ src?: string }>;
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

type WooReviewLike = {
  id: number;
  reviewer?: string;
  review?: string;
  rating?: number;
  date_created?: string;
  verified?: boolean;
};

function createEmptyProduct(id: string): Product {
  return {
    id,
    name: "",
    brand: "",
    price: 0,
    average_rating: 0,
    reviewCount: 0,
    image: "/Mamoojan-Logo.png",
    category: "",
    healthGoals: [],
    labels: [],
    dietTypes: [],
    description: "",
    short_description: "",
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
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} productReviews={[]} />;
  }

  const wcUrl = wcUrlRaw.replace(/\/$/, "");
  const productIdNum = Number(id);

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
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} productReviews={[]} />;
  }

  if (!productRes.ok) {
    return <ProductPage product={createEmptyProduct(id)} relatedProducts={[]} productReviews={[]} />;
  }

  const wooProduct = (await productRes.json()) as any as WooProductLike;
  const mappedAttributes =
    wooProduct.attributes?.map((a) => ({
      name: a.name,
      variation: Boolean(a.variation),
      options: Array.isArray(a.options) ? a.options : [],
    })) ?? [];

  const variationAttributes = mappedAttributes.filter((a) => a.variation);
  let mappedVariations: NonNullable<Product["variations"]> = [];

  if ((wooProduct.type ?? "") === "variable" || variationAttributes.length > 0) {
    const variationsEndpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/${productIdNum}/variations`);
    variationsEndpoint.searchParams.set("consumer_key", wcKey);
    variationsEndpoint.searchParams.set("consumer_secret", wcSecret);
    variationsEndpoint.searchParams.set("per_page", "100");
    variationsEndpoint.searchParams.set("page", "1");

    try {
      const variationsRes = await fetch(variationsEndpoint.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });

      if (variationsRes.ok) {
        const variationRows = (await variationsRes.json()) as WooVariationLike[];
        mappedVariations = variationRows.map((v) => {
          const parsedPrice = Number(v.price ?? v.sale_price ?? v.regular_price ?? 0);
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
            price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
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
      mappedVariations = [];
    }
  }

  const product: Product = {
    ...mapWooToProduct(wooProduct as any),
    description: wooProduct.description ?? "",
    average_rating: wooProduct.average_rating ?? 0,
    short_description: wooProduct.short_description ?? "",
    images: (wooProduct.images ?? [])
      .map((img) => img.src)
      .filter((src): src is string => Boolean(src)),
    attributes: mappedAttributes,
    variations: mappedVariations,
  };

  let productReviews: ProductReview[] = [];
  const reviewsEndpoint = new URL(`${wcUrl}/wp-json/wc/v3/products/reviews`);
  reviewsEndpoint.searchParams.set("consumer_key", wcKey);
  reviewsEndpoint.searchParams.set("consumer_secret", wcSecret);
  reviewsEndpoint.searchParams.set("product", String(productIdNum));
  reviewsEndpoint.searchParams.set("per_page", "20");
  reviewsEndpoint.searchParams.set("page", "1");

  try {
    const reviewsRes = await fetch(reviewsEndpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });

    if (reviewsRes.ok) {
      const rows = (await reviewsRes.json()) as WooReviewLike[];
      productReviews = rows.map((r) => {
        const reviewText = (r.review ?? "").trim();
        const firstSentence = reviewText.split(". ").find(Boolean) ?? "Customer review";
        const title = firstSentence.length > 90 ? `${firstSentence.slice(0, 87)}...` : firstSentence;

        return {
          id: String(r.id),
          author: r.reviewer?.trim() || "Verified Customer",
          rating: Number.isFinite(r.rating) ? Number(r.rating) : 5,
          date: r.date_created
            ? new Date(r.date_created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "",
          title,
          text: reviewText || "No review text provided.",
          helpful: 0,
          verified: r.verified !== false,
        };
      });
    }
  } catch {
    productReviews = [];
  }

  return <ProductPage product={product} relatedProducts={[]} productReviews={productReviews} />;
}

