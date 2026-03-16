import { useState, useMemo } from "react";
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products, brands, categories } from "../data/products";

const dietOptions = ["Natural", "Vegetarian", "Eco-Friendly", "Reusable", "Herbal"];
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

export function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");

  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || (slug === "deals" ? "Deals & Promotions" : "All Products");

  const filteredProducts = useMemo(() => {
    let result = slug === "deals"
      ? products.filter((p) => p.originalPrice)
      : slug
      ? products.filter((p) => p.category.toLowerCase().replace(/[& ]/g, (m) => (m === "&" ? "" : "-")).replace("--", "-") === slug || true)
      : products;

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (selectedDiets.length > 0) {
      result = result.filter((p) => selectedDiets.some((d) => p.dietTypes.includes(d)));
    }
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => Number(b.id) - Number(a.id)); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return result;
  }, [slug, selectedBrands, selectedDiets, selectedPriceRange, minRating, sortBy]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedDiets([]);
    setSelectedPriceRange(null);
    setMinRating(0);
  };

  const activeFilterCount = selectedBrands.length + selectedDiets.length + (selectedPriceRange !== null ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) => prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-foreground">{categoryName}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px" }}>{categoryName}</h1>
        <p className="text-muted-foreground mt-2">
          Discover our selection of {categoryName.toLowerCase()}. Authentic products trusted by families everywhere.
        </p>
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
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
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
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:bg-transparent lg:p-0" : "hidden"} lg:block lg:w-64 shrink-0`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Filters</h3>
            <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-accent hover:underline mb-4">
              Clear all filters ({activeFilterCount})
            </button>
          )}

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map((range, i) => (
                <label key={range.label} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === i}
                    onChange={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                    className="accent-primary"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Brand</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-primary rounded"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Diet Type */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Diet Type</h4>
            <div className="space-y-2">
              {dietOptions.map((diet) => (
                <label key={diet} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={selectedDiets.includes(diet)}
                    onChange={() => toggleDiet(diet)}
                    className="accent-primary rounded"
                  />
                  {diet}
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Rating</h4>
            <div className="space-y-2">
              {[4, 3, 2].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                    className="accent-primary"
                  />
                  {rating}+ Stars & Up
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => setFiltersOpen(false)} className="lg:hidden w-full py-3 bg-primary text-white rounded-lg text-sm mt-4">
            Show {filteredProducts.length} Results
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-primary hover:underline text-sm">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}