import type { Product } from "../../data/products";
import { healthGoals as healthGoalDefs } from "../../data/products";

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

export function mapWooToProduct(p: WooProduct): Product {
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

  // Map WooCommerce tags onto the app's existing health goal slugs/names.
  const knownHealthGoalNames = new Set(healthGoalDefs.map((g) => g.name.toLowerCase()));
  const healthGoalsFromTags = tags
    .map((t) => t.name)
    .filter((name) => knownHealthGoalNames.has(name.toLowerCase()))
    .slice(0, 4);

  const short = p.short_description ? stripHtml(p.short_description) : "";

  const price = toPriceNumber(p.price ?? p.regular_price, 0);
  const regularPrice = p.regular_price ? toPriceNumber(p.regular_price, 0) : undefined;
  const salePrice = p.sale_price ? toPriceNumber(p.sale_price, 0) : undefined;

  const inStock =
    p.stock_status === "instock" ||
    (typeof p.stock_quantity === "number" ? p.stock_quantity > 0 : false);
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
    healthGoals: healthGoalsFromTags,
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

