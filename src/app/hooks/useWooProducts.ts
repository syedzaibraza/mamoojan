"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "../data/products";

type WooProductsResponse = {
  page?: number;
  total_pages?: number;
  products?: Product[];
};

async function fetchWooProducts(): Promise<Product[]> {
  const firstRes = await fetch("/api/woocommerce/products?per_page=100&page=1");
  if (!firstRes.ok) throw new Error("Failed to fetch products.");
  const firstData = (await firstRes.json()) as WooProductsResponse;

  const totalPages = firstData.total_pages ?? 1;
  let allProducts = firstData.products ?? [];

  for (let p = 2; p <= totalPages; p += 1) {
    const res = await fetch(`/api/woocommerce/products?per_page=100&page=${p}`);
    if (!res.ok) throw new Error("Failed to fetch products.");
    const data = (await res.json()) as WooProductsResponse;
    allProducts = [...allProducts, ...(data.products ?? [])];
  }

  return allProducts;
}

export function useWooProducts() {
  return useQuery({
    queryKey: ["woo-products"],
    queryFn: fetchWooProducts,
    staleTime: 5 * 60 * 1000,
  });
}
