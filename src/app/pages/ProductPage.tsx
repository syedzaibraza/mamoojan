"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight, ThumbsUp, Minus, Plus } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { reviews as staticReviews } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { useCartStore } from "../store/cartStore";
import { toast } from "sonner";
import type { Product } from "../data/products";

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  helpful: number;
  verified?: boolean;
};

export function ProductPage({
  product,
  relatedProducts,
  productReviews,
}: {
  product: Product;
  relatedProducts: Product[];
  productReviews?: ProductReview[];
}) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "additional-info" | "reviews" | "faq">("description");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const variationAttributes = product.attributes?.filter((a) => a.variation) ?? [];
  const hasVariations = (product.variations?.length ?? 0) > 0 && variationAttributes.length > 0;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hasVariations) return;

    // Prefer a concrete variation as the initial selection to avoid "invalid" combinations.
    const first = product.variations?.find((v) => v.inStock) ?? product.variations?.[0];
    if (!first) return;

    const initial: Record<string, string> = {};
    for (const a of variationAttributes) {
      const key = a.name.trim().toLowerCase();
      if (!key) continue;
      const fromVariation = first.attributes[key];
      if (fromVariation) initial[key] = fromVariation;
      else if (a.options.length === 1) initial[key] = a.options[0]!;
    }
    setSelectedOptions(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedVariation = useMemo(() => {
    if (!hasVariations) return undefined;
    const requiredKeys = variationAttributes
      .map((a) => a.name.trim().toLowerCase())
      .filter(Boolean);
    if (requiredKeys.some((k) => !selectedOptions[k])) return undefined;

    return product.variations?.find((v) =>
      requiredKeys.every((k) => v.attributes[k] === selectedOptions[k]),
    );
  }, [hasVariations, product.variations, selectedOptions, variationAttributes]);

  const displayPrice = selectedVariation?.price ?? product.price;
  const displayOriginalPrice = selectedVariation?.originalPrice ?? product.originalPrice;
  const displayImage = selectedVariation?.image ?? product.image;
  const displayInStock = selectedVariation ? selectedVariation.inStock : product.inStock;
  const displayStockCount = selectedVariation?.stockCount ?? product.stockCount;
  const displayRating = product.rating ?? product.average_rating ?? 0;

  const discount = displayOriginalPrice
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  const safeRelatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const displayReviews: ProductReview[] =
    productReviews ?? staticReviews.map((r) => ({ ...r, verified: true }));
  const galleryImages = useMemo(() => {
    const all = [...(product.images ?? []), displayImage].filter(Boolean) as string[];
    return Array.from(new Set(all));
  }, [product.images, displayImage]);
  const lightboxSlides = useMemo(
    () => galleryImages.map((src) => ({ src })),
    [galleryImages],
  );
  const [activeImage, setActiveImage] = useState(displayImage);

  useEffect(() => {
    setActiveImage(displayImage);
  }, [displayImage, product.id]);

  const ratingBreakdown = useMemo(() => {
    const total = displayReviews.length;
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = displayReviews.filter((r) => r.rating === stars).length;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return { stars, percent };
    });
  }, [displayReviews]);

  const faqs = [
    { q: `What are the benefits of ${product.name}?`, a: product.benefits.join(". ") + "." },
    { q: "How should I take this supplement?", a: product.dosage },
    { q: "Are there any side effects?", a: "This supplement is generally well-tolerated. Consult your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, or taking medications." },
    { q: "Is this product third-party tested?", a: "Yes, all our products undergo rigorous third-party testing for purity, potency, and safety. We are GMP certified and committed to the highest quality standards." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/category/${product.category.toLowerCase().replace(/[& ]/g, (m) => m === "&" ? "" : "-").replace("--", "-")}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <div>
          <div className="relative rounded-xl overflow-hidden bg-secondary aspect-square">
            <button
              type="button"
              onClick={() => {
                const idx = Math.max(0, galleryImages.indexOf(activeImage));
                setZoomIndex(idx);
                setIsZoomOpen(true);
              }}
              className="block w-full h-full text-left"
              aria-label="Zoom product image"
            >
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </button>
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                Save {discount}%
              </span>
            )}
            {product.labels.length > 0 && (
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                {product.labels.map((label) => (
                  <span key={label} className={`text-xs px-2 py-1 rounded-full ${label === "Best Seller" ? "bg-primary text-white" : label === "Sale" ? "bg-accent text-white" : label === "New" ? "bg-blue-500 text-white" : "bg-green-100 text-green-700"}`}>
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {galleryImages.map((img, idx) => {
                const isActive = img === activeImage;
                return (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(img);
                      setZoomIndex(idx);
                    }}
                    className={`rounded-lg overflow-hidden border ${isActive ? "border-primary" : "border-border"}`}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <Link href="/brands" className="text-sm text-primary hover:underline">{product.brand}</Link>
              <h1 className="mt-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Save to wishlist"><Heart className="w-5 h-5" /></button>
              <button className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Share product"><Share2 className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(displayRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm">{displayRating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "var(--primary)" }}>
              ${displayPrice.toFixed(2)}
            </span>
            {displayOriginalPrice && (
              <span className="text-lg text-muted-foreground line-through">${displayOriginalPrice.toFixed(2)}</span>
            )}
          </div>

          <div
            className="text-muted-foreground mt-4"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />

          {/* Diet Types */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.dietTypes.map((diet) => (
              <span key={diet} className="text-xs px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-200">{diet}</span>
            ))}
          </div>

          {/* Availability */}
          <div className="mt-4">
            {displayInStock ? (
              <span className="text-sm text-primary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> In Stock
                {displayStockCount && displayStockCount <= 5 && <span className="text-destructive ml-2">Only {displayStockCount} left!</span>}
              </span>
            ) : (
              <span className="text-sm text-destructive">Out of Stock</span>
            )}
          </div>

          {/* Variations */}
          {hasVariations && (
            <div className="mt-6 space-y-4">
              {variationAttributes.map((attr) => {
                const key = attr.name.trim().toLowerCase();
                const selected = selectedOptions[key] ?? "";
                return (
                  <div key={key}>
                    <p className="text-sm mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                      {attr.name} {selected ? <span className="text-muted-foreground" style={{ fontWeight: 400 }}>({selected})</span> : null}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map((opt) => {
                        const active = selected === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedOptions((prev) => ({ ...prev, [key]: opt }))}
                            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${active
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/40"
                              }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {Object.keys(selectedOptions).length > 0 && !selectedVariation && (
                <p className="text-sm text-destructive">This combination is not available. Please choose different options.</p>
              )}
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors" aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
              <span className="px-4 text-sm min-w-[40px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors" aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => {
                if (hasVariations && !selectedVariation) {
                  toast.error("Please select options before adding to cart");
                  return;
                }
                addToCart(product, {
                  quantity,
                  variation: selectedVariation
                    ? {
                      id: selectedVariation.id,
                      price: selectedVariation.price,
                      image: selectedVariation.image,
                      attributes: selectedVariation.attributes,
                    }
                    : undefined,
                });
                toast.success(`${product.name} added to cart`);
              }}
              disabled={!displayInStock || (hasVariations && !selectedVariation)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Truck className="w-4 h-4 text-primary shrink-0" /> Free Shipping $49+</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><RotateCcw className="w-4 h-4 text-primary shrink-0" /> 30-Day Returns</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Shield className="w-4 h-4 text-primary shrink-0" /> Quality Guaranteed</div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-border pt-8 mb-12">
        <div className="flex gap-0 border-b border-border overflow-x-auto">
          {(["description", "additional-info", "reviews", "faq"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: activeTab === tab ? 600 : 400 }}
            >
              {tab === "description" ? "Description" : tab === "additional-info" ? "Additional Info" : tab === "reviews" ? `Reviews (${product.reviewCount})` : "FAQ"}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="max-w-full">
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {activeTab === "additional-info" && (
            <div className="max-w-2xl">
              <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Full Ingredient List</h3>
              <p className="text-muted-foreground mb-4">{product.ingredients}</p>
              <div className="bg-secondary p-4 rounded-lg">
                <h4 className="text-sm mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Suggested Dosage</h4>
                <p className="text-sm text-muted-foreground">{product.dosage}</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="bg-secondary p-6 rounded-xl text-center">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "48px", color: "var(--primary)" }}>{displayRating}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(displayRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{product.reviewCount.toLocaleString()} reviews</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Rating Breakdown</h4>
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-16">{item.stars} Stars</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.percent}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {displayReviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center">
                  <p className="text-base" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                    No reviews yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to share your experience with this product.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">{review.author[0]}</div>
                          <div>
                            <p className="text-sm" style={{ fontWeight: 500 }}>{review.author}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        {review.verified !== false && (
                          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Verified Purchase</span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: review.text }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="max-w-2xl space-y-4">
              <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Frequently Asked Questions</h3>
              {faqs.map((faq, i) => (
                <details key={i} className="border border-border rounded-lg group">
                  <summary className="p-4 cursor-pointer text-sm list-none flex items-center justify-between" style={{ fontWeight: 500 }}>
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {safeRelatedProducts.length > 0 && (
        <section className="border-t border-border pt-8 mb-12">
          <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {safeRelatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Lightbox
        open={isZoomOpen}
        close={() => setIsZoomOpen(false)}
        index={zoomIndex}
        slides={lightboxSlides}
      />
    </div>
  );
}