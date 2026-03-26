import Link from "next/link";
import { ChevronRight, Star, Award } from "lucide-react";
import { brands } from "../data/products";
import type { Product } from "../data/products";

const brandDescriptions: Record<string, string> = {
  "MamooJan": "MamooJan brings traditional products, authentic snacks, and everyday essentials to families around the world. Founded in 2017, we connect cultures through familiar flavors and quality products.",
  "Focus N Rulz": "Focus N Rulz specializes in premium herbal supplements, particularly Himalayan Shilajit products. Distributed in the USA through MamooJan, bringing ancient wellness to modern life.",
};

const brandCertifications: Record<string, string[]> = {
  "MamooJan": ["Family Owned", "USA Based", "Quality Assured", "Est. 2017"],
  "Focus N Rulz": ["Natural Ingredients", "Traditional Formulas", "Quality Tested", "USA Distribution"],
};

function getBrandDetails(allProducts: Product[]) {
  return brands.map((brand) => {
    const brandProducts = allProducts.filter((p) => p.brand === brand);
    const avgRating =
      brandProducts.length > 0
        ? brandProducts.reduce((a, p) => a + (p.rating ?? p.average_rating ?? 0), 0) / brandProducts.length
        : 0;

    return {
      name: brand,
      products: brandProducts,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: brandProducts.reduce((a, p) => a + p.reviewCount, 0),
      description: brandDescriptions[brand] || `Quality products from ${brand}.`,
      certifications: brandCertifications[brand] || ["Quality Assured"],
    };
  });
}

export function BrandPage({ products }: { products: Product[] }) {
  const brandDetails = getBrandDetails(products);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Brands</span>
      </nav>

      <div className="text-center mb-10">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px" }}>Our Brands</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">We bring you authentic products from trusted brands that connect families and promote traditional wellness.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {brandDetails.map((brand) => (
          <div key={brand.name} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px" }}>{brand.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(brand.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{brand.avgRating} ({brand.totalReviews.toLocaleString()} reviews)</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{brand.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {brand.certifications.map((cert) => (
                <span key={cert} className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded border border-gray-200">{cert}</span>
              ))}
            </div>

            {brand.products.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Top Products</p>
                <div className="flex gap-2 overflow-x-auto">
                  {brand.products.slice(0, 3).map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`} className="shrink-0 flex items-center gap-2 p-2 bg-secondary rounded-lg hover:bg-secondary/80">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                      <span className="text-xs">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
