"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../data/products";

const priceRanges = [
  { label: "Under $15", min: 0, max: 15 },
  { label: "$15 - $25", min: 15, max: 25 },
  { label: "$25 - $40", min: 25, max: 40 },
  { label: "Over $40", min: 40, max: 999 },
];

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
];

function categoryNameToSlug(categoryName: string) {
  // Match the slug conversion logic used across the site.
  // WooCommerce category names sometimes include trailing spaces or odd formatting,
  // so we normalize aggressively to keep filters reliable.
  return categoryName
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type ShopCategory = { name: string; slug: string };

export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: ShopCategory[];
}) {

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity");
  const pageSize = 12;
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const slug = categoryNameToSlug(p.category);
        return selectedCategories.includes(slug);
      });
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [products, selectedCategories, selectedPriceRange, sortBy]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [products, selectedCategories, selectedPriceRange, sortBy]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
  };

  const activeFilterCount =
    selectedCategories.length + (selectedPriceRange !== null ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold">
          Shop
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`${filtersOpen
            ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
            : "hidden"
            } lg:block lg:w-64 shrink-0`}
        >
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Filters</h3>
            <button onClick={() => setFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-accent hover:underline mb-4">
              Clear all filters ({activeFilterCount})
            </button>
          )}

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Categories
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat.slug);
                return (
                  <label
                    key={cat.slug}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedCategories((prev) =>
                          prev.includes(cat.slug) ? prev.filter((s) => s !== cat.slug) : [...prev, cat.slug]
                        )
                      }
                      className="accent-primary rounded"
                    />
                    {cat.name}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Price Range
            </h4>
            <div className="space-y-2">
              {priceRanges.map((range, i) => (
                <label
                  key={range.label}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
                >
                  <input
                    type="radio"
                    name="shop-price"
                    checked={selectedPriceRange === i}
                    onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                    className="accent-primary"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => setFiltersOpen(false)}
            className="lg:hidden w-full py-3 bg-primary text-white rounded-lg text-sm mt-4"
          >
            Show {filteredProducts.length} Results
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-primary hover:underline text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {visibleProducts.length < filteredProducts.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() =>
                      setVisibleCount((count) =>
                        Math.min(filteredProducts.length, count + pageSize)
                      )
                    }
                    className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

