"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight, ThumbsUp, Minus, Plus } from "lucide-react";
import { products, reviews } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export function ProductPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const product = products.find((p) => p.id === id) || products[0];
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [subscription, setSubscription] = useState(false);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "reviews" | "faq">("benefits");

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products.filter((p) => p.id !== product.id && (p.category === product.category || p.healthGoals.some((g) => product.healthGoals.includes(g)))).slice(0, 4);

  const ratingBreakdown = [
    { stars: 5, percent: 68 },
    { stars: 4, percent: 22 },
    { stars: 3, percent: 7 },
    { stars: 2, percent: 2 },
    { stars: 1, percent: 1 },
  ];

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
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px", color: "var(--primary)" }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground mt-4">{product.description}</p>

          {/* Diet Types */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.dietTypes.map((diet) => (
              <span key={diet} className="text-xs px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-200">{diet}</span>
            ))}
          </div>

          {/* Availability */}
          <div className="mt-4">
            {product.inStock ? (
              <span className="text-sm text-primary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> In Stock
                {product.stockCount && product.stockCount <= 5 && <span className="text-destructive ml-2">Only {product.stockCount} left!</span>}
              </span>
            ) : (
              <span className="text-sm text-destructive">Out of Stock</span>
            )}
          </div>

          {/* Subscription Option */}
          <div className="mt-6 p-4 bg-secondary rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={subscription}
                onChange={() => setSubscription(!subscription)}
                className="accent-primary mt-1"
              />
              <div>
                <span className="text-sm" style={{ fontWeight: 500 }}>Subscribe & Save 20%</span>
                <p className="text-xs text-muted-foreground mt-0.5">Auto-deliver every 30 days. Cancel anytime.</p>
                {subscription && (
                  <span className="text-sm text-primary mt-1 inline-block" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                    ${(product.price * 0.8).toFixed(2)}/delivery
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors" aria-label="Decrease quantity"><Minus className="w-4 h-4" /></button>
              <span className="px-4 text-sm min-w-[40px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors" aria-label="Increase quantity"><Plus className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => {
                addToCart(product, quantity, subscription);
                toast.success(`${product.name} added to cart`);
              }}
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
          {(["benefits", "ingredients", "reviews", "faq"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: activeTab === tab ? 600 : 400 }}
            >
              {tab === "benefits" ? "Key Benefits" : tab === "ingredients" ? "Ingredients" : tab === "reviews" ? `Reviews (${product.reviewCount})` : "FAQ"}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "benefits" && (
            <div className="max-w-2xl">
              <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Health Benefits</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "ingredients" && (
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
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "48px", color: "var(--primary)" }}>{product.rating}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
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

              <div className="space-y-6">
                {reviews.map((review) => (
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
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">Verified Purchase</span>
                    </div>
                    <h4 className="mt-3 text-sm" style={{ fontWeight: 500 }}>{review.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                    <button className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground">
                      <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
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
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-8 mb-12">
          <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}