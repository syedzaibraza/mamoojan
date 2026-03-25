"use client";

import Link from "next/link";
import { Leaf, Heart, Zap, Home, Globe, ArrowRight, CheckCircle, Star, Award, Lock, Truck, Tag, ChevronRight, Package } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { products, blogPosts, categories } from "../data/products";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

const themeIcons: Record<string, React.ReactNode> = {
  "Traditional Wellness": <Leaf className="w-6 h-6" />,
  "Family & Culture": <Heart className="w-6 h-6" />,
  "Energy & Vitality": <Zap className="w-6 h-6" />,
  "Everyday Lifestyle": <Home className="w-6 h-6" />,
  "Cultural Connection": <Globe className="w-6 h-6" />,
};

const themes = [
  { name: "Traditional Wellness", slug: "traditional-wellness", color: "bg-stone-50 text-stone-700 border-stone-200" },
  { name: "Family & Culture", slug: "family-culture", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Energy & Vitality", slug: "energy-vitality", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { name: "Everyday Lifestyle", slug: "everyday-lifestyle", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { name: "Cultural Connection", slug: "cultural-connection", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

const categoryImages = [
  { name: "Herbal Supplements", slug: "herbal-supplements", image: "https://images.unsplash.com/photo-1704597435621-ff7026f124fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYmFsJTIwcHJvZHVjdHMlMjBkaXNwbGF5JTIwbWluaW1hbHxlbnwxfHx8fDE3NzMwODc0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Snacks & Food", slug: "snacks-food", image: "https://images.unsplash.com/photo-1770124129809-fe1fe6b7c23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMG1hbmdvJTIwZnJ1aXQlMjBzbmFja3N8ZW58MXx8fHwxNzczMDg3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Personal Care", slug: "personal-care-wellness", image: "https://images.unsplash.com/photo-1570586790173-a031eec3f21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjB0b25ndWUlMjBzY3JhcGVyJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzczMDg3NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Lifestyle", slug: "lifestyle-products", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMHN0YWlubGVzcyUyMHN0ZWVsfGVufDF8fHx8MTc3MzA3MjM4MHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { name: "Celebrations", slug: "celebration-items", image: "https://images.unsplash.com/photo-1763879537802-18dd4a76b3c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhcnR5JTIwZmxhZ3MlMjBkZWNvcmF0aW9uJTIwYnVudGluZ3xlbnwxfHx8fDE3NzMwODc0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export function HomePage() {
  const [email, setEmail] = useState("");
  const bestSellers = products.filter((p) => p.labels.includes("Best Seller"));
  const dealProducts = products.filter((p) => p.originalPrice);

  return (
    <div>
      {/* Section 1: Hero Banner */}
      <section className="relative bg-gradient-to-br from-stone-50 via-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-primary/5 text-primary rounded-full text-sm mb-4">
                Est. 2017 &mdash; Trusted by Families Everywhere
              </span>
              <h1 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.2 }}>
                Connecting <span className="text-accent">Families</span> Around The <span className="text-accent">World</span>
              </h1>
              <p className="text-muted-foreground mb-8 max-w-lg" style={{ fontSize: "18px" }}>
                Traditional products, herbal supplements, authentic snacks, and everyday essentials — bringing the flavors and traditions of home to your doorstep.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
                {/* <Link
                  href="/category/snacks-food"
                  className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  Explore Products
                </Link> */}
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" /> Authentic Products</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" /> Fast Shipping</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-primary" /> Family Owned</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1710186012216-9b2cf2a800bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwZmFtaWx5JTIwZ2F0aGVyaW5nJTIwZm9vZHxlbnwxfHx8fDE3NzMwODc0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Connecting families with traditional products"
                className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm">4.7/5 Average Rating</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Loved by families since 2017</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Shop by Theme */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Shop by Theme</h2>
            <p className="text-muted-foreground mt-2">Find products that match your lifestyle and values</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {themes.map((theme) => (
              <Link
                key={theme.name}
                href={`/health-goals/${theme.slug}`}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border ${theme.color} hover:shadow-md transition-all duration-300 group`}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {themeIcons[theme.name]}
                </div>
                <span className="text-xs text-center" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{theme.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Featured Categories */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Shop by Category</h2>
            <Link href="/category/herbal-supplements" className="text-primary text-sm flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryImages.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${cat.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px" }}>{cat.name}</h3>
                  <span className="text-white/80 text-sm">Shop Now &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Best Selling Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Best Sellers</h2>
              <p className="text-muted-foreground mt-1">Our most loved products, trusted by families</p>
            </div>
            <Link href="/category/herbal-supplements" className="text-primary text-sm flex items-center gap-1 hover:underline hidden md:flex">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Deals and Promotions */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-stone-50 via-stone-100 to-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-accent text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>LIMITED TIME</span>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Deals & Promotions</h2>
              <p className="text-muted-foreground mt-1">Save on authentic products</p>
            </div>
            <Link href="/category/deals" className="text-accent text-sm flex items-center gap-1 hover:underline hidden md:flex">
              All Deals <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Promo banners */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary text-white p-6 rounded-xl">
              <p className="text-sm opacity-80">Bundle Deal</p>
              <h3 className="mt-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px" }}>Buy 2 Get 1 Free</h3>
              <p className="text-sm opacity-80 mt-2">On all herbal supplements</p>
              <Link href="/category/herbal-supplements" className="inline-block mt-4 px-4 py-2 bg-white text-primary rounded-lg text-sm hover:bg-white/90">Shop Now</Link>
            </div>
            <div className="bg-accent text-white p-6 rounded-xl">
              <p className="text-sm opacity-80">Family Pack</p>
              <h3 className="mt-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px" }}>Save Up to 30%</h3>
              <p className="text-sm opacity-80 mt-2">On snacks & food bundles</p>
              <Link href="/category/snacks-food" className="inline-block mt-4 px-4 py-2 bg-white text-accent rounded-lg text-sm hover:bg-white/90">Shop Now</Link>
            </div>
            <div className="bg-gradient-to-br from-stone-700 to-stone-900 text-white p-6 rounded-xl">
              <p className="text-sm opacity-80">New Arrivals</p>
              <h3 className="mt-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "22px" }}>10% Off First Order</h3>
              <p className="text-sm opacity-80 mt-2">Use code MAMOOJAN10</p>
              <Link href="/category/deals" className="inline-block mt-4 px-4 py-2 bg-white text-stone-800 rounded-lg text-sm hover:bg-white/90">Shop Now</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {dealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Blog */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>From Our Blog</h2>
              <p className="text-muted-foreground mt-1">Stories, traditions, and wellness tips</p>
            </div>
            <Link href="/blog" className="text-primary text-sm flex items-center gap-1 hover:underline hidden md:flex">
              All Articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.id} href="/blog" className="group">
                <div className="rounded-xl overflow-hidden aspect-video mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs text-accent" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{post.category}</span>
                <h3 className="mt-1 group-hover:text-muted-foreground transition-colors line-clamp-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px" }}>
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Trust Section */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Why Choose MamooJan?</h2>
            <p className="text-muted-foreground mt-2">Quality products, authentic experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Award className="w-8 h-8" />, title: "Authentic Products", desc: "Sourced directly from trusted suppliers with quality you can trust" },
              { icon: <CheckCircle className="w-8 h-8" />, title: "Family Owned", desc: "Proudly family-owned and operated since 2017" },
              { icon: <Package className="w-8 h-8" />, title: "Fast Shipping", desc: "Orders shipped from our New Jersey warehouse within 24 hours" },
              { icon: <Lock className="w-8 h-8" />, title: "Secure Checkout", desc: "256-bit SSL encryption for safe and secure transactions" },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl text-center border border-border">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/5 text-primary flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "15px" }}>{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Rewards Program */}
      <section className="py-12 md:py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-6 h-6" />
                <span className="text-sm opacity-80 uppercase tracking-wider">MamooJan Rewards</span>
              </div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px" }}>Earn Points. Save More.</h2>
              <p className="mt-4 opacity-90">Join our rewards program and earn points on every purchase and referral. Redeem points for exclusive discounts on your favorite products.</p>
              <Link href="/account" className="inline-block mt-6 px-6 py-3 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                Join for Free
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Purchases", points: "1 pt / $1", desc: "Earn on every order" },
                { label: "Reviews", points: "50 pts", desc: "Per verified review" },
                { label: "Referrals", points: "500 pts", desc: "Per friend signup" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                  <p className="text-2xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>{item.points}</p>
                  <p className="text-sm mt-1 opacity-80">{item.label}</p>
                  <p className="text-xs mt-2 opacity-60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Newsletter Signup */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Stay Connected</h2>
          <p className="text-muted-foreground mt-2">Subscribe to our newsletter for new products, cultural stories, and exclusive family deals.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button
              onClick={() => { setEmail(""); }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Get 10% Off
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Shipping Bar */}
      <section className="py-6 bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2"><Truck className="w-5 h-5 text-primary" /> Free Shipping $35+</div>
            <div className="flex items-center justify-center gap-2"><Package className="w-5 h-5 text-primary" /> Ships from NJ, USA</div>
            <div className="flex items-center justify-center gap-2"><Lock className="w-5 h-5 text-primary" /> Secure Payment</div>
            <div className="flex items-center justify-center gap-2"><Star className="w-5 h-5 text-primary" /> Trusted Since 2017</div>
          </div>
        </div>
      </section>
    </div>
  );
}
