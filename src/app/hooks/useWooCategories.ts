"use client";

import { useQuery } from "@tanstack/react-query";

type WooCategory = { id: number; name: string; slug: string; parent: number };
type NavSubcategory = { name: string; slug: string };
type NavItem =
  | { key: string; name: string; type: "deals"; subcategories: NavSubcategory[] }
  | { key: string; name: string; type: "brands"; subcategories: NavSubcategory[] }
  | { key: string; name: string; type: "woo"; slug: string; subcategories: NavSubcategory[] };

type CategoryResponse = {
  categories?: WooCategory[];
  total_pages?: number;
};

export type ShopCategory = { name: string; slug: string };

async function fetchWooCategories(): Promise<WooCategory[]> {
  const firstRes = await fetch("/api/woocommerce/categories?per_page=100&page=1");
  if (!firstRes.ok) throw new Error("Failed to fetch categories.");
  const firstData = (await firstRes.json()) as CategoryResponse;

  const totalPages = firstData.total_pages ?? 1;
  let allCategories = firstData.categories ?? [];

  for (let p = 2; p <= totalPages; p += 1) {
    const res = await fetch(`/api/woocommerce/categories?per_page=100&page=${p}`);
    if (!res.ok) throw new Error("Failed to fetch categories.");
    const data = (await res.json()) as CategoryResponse;
    allCategories = [...allCategories, ...(data.categories ?? [])];
  }

  return allCategories;
}

function toNavItems(allCategories: WooCategory[]): NavItem[] {
  const topLevel = allCategories.filter((c) => !c.parent);
  const childrenByParent = new Map<number, WooCategory[]>();

  for (const category of allCategories) {
    if (!category.parent) continue;
    const list = childrenByParent.get(category.parent) ?? [];
    list.push(category);
    childrenByParent.set(category.parent, list);
  }

  const wooItems: NavItem[] = topLevel.map((category) => ({
    key: `woo-${category.id}`,
    name: category.name,
    type: "woo",
    slug: category.slug,
    subcategories: (childrenByParent.get(category.id) ?? []).map((sub) => ({
      name: sub.name,
      slug: sub.slug,
    })),
  }));

  return [
    ...wooItems,
    { key: "brands", name: "Brands", type: "brands", subcategories: [] },
    { key: "deals", name: "Deals", type: "deals", subcategories: [] },
  ];
}

export function useWooCategories() {
  return useQuery({
    queryKey: ["woo-categories"],
    queryFn: fetchWooCategories,
    select: (allCategories) => ({
      allCategories,
      navItems: toNavItems(allCategories),
      shopCategories: allCategories.map((c) => ({ name: c.name, slug: c.slug })) as ShopCategory[],
    }),
  });
}
