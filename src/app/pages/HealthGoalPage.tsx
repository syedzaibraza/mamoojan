"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Leaf, Heart, Zap, Home, Globe, BookOpen, Lightbulb } from "lucide-react";
import { healthGoals } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../data/products";

const goalContent: Record<string, { title: string; description: string; tips: string[]; icon: React.ReactNode }> = {
  "traditional-wellness": {
    title: "Traditional Wellness",
    description: "Discover time-honored natural remedies and herbal supplements that have been trusted for centuries. From Himalayan Shilajit to Joshanda herbal tea, these products bring the wisdom of ancient wellness practices to modern life.",
    tips: ["Shilajit resin has been used for centuries in Ayurvedic medicine for vitality", "Joshanda is a traditional herbal tea blend for soothing comfort", "Natural wellness products work best as part of a balanced lifestyle", "Start with small doses and gradually increase as your body adjusts"],
    icon: <Leaf className="w-8 h-8" />,
  },
  "family-culture": {
    title: "Family & Culture",
    description: "Connect with your roots through familiar foods, snacks, and products that bring families together. Share the flavors and traditions of home with loved ones, no matter where you are.",
    tips: ["Share traditional snacks during family gatherings and celebrations", "Introduce children to cultural foods and heritage flavors", "Use greeting cards and decorations to celebrate cultural occasions", "Food is one of the strongest connections to cultural identity"],
    icon: <Heart className="w-8 h-8" />,
  },
  "energy-vitality": {
    title: "Energy & Vitality",
    description: "Boost your natural energy and vitality with herbal supplements and wellness products. Our energy-focused products help you stay active and energized throughout the day.",
    tips: ["Shilajit is traditionally used to support natural energy production", "Stay hydrated throughout the day for optimal energy levels", "Combine supplements with regular physical activity", "Natural energy supplements work best when taken consistently"],
    icon: <Zap className="w-8 h-8" />,
  },
  "everyday-lifestyle": {
    title: "Everyday Lifestyle",
    description: "Practical products for your daily routine — from personal care essentials to lifestyle accessories. Quality items that make everyday life better.",
    tips: ["A tongue scraper is an easy addition to your morning oral care routine", "Reusable water bottles help you stay hydrated and reduce waste", "Invest in quality everyday items that last", "Natural personal care products are gentle on skin"],
    icon: <Home className="w-8 h-8" />,
  },
  "cultural-connection": {
    title: "Cultural Connection",
    description: "Celebrate your heritage and stay connected to your cultural roots with products that honor traditions. From celebration items to heritage foods, keep your culture alive.",
    tips: ["Decorate your home with cultural items to create a welcoming atmosphere", "Send greeting cards for cultural and religious celebrations", "Share traditional foods with neighbors and friends to build community", "Teach the next generation about cultural traditions through food and celebrations"],
    icon: <Globe className="w-8 h-8" />,
  },
};

export function HealthGoalPage({ products }: { products: Product[] }) {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const goal = goalContent[slug || "traditional-wellness"] || goalContent["traditional-wellness"];
  const goalData = healthGoals.find((g) => g.slug === slug);

  const relatedProducts = products.filter((p) => p.healthGoals.some((g) => g.toLowerCase().replace(/ /g, "-").replace("&", "").replace("--", "-") === slug));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{goal.title}</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-8 md:p-12 mb-10">
        <div className="max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-4">
            {goal.icon}
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "36px" }}>
            {goal.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">{goal.description}</p>
        </div>
      </div>

      {/* Browse other themes */}
      <div className="mb-10">
        <h3 className="text-sm text-muted-foreground mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Browse All Themes</h3>
        <div className="flex flex-wrap gap-2">
          {healthGoals.map((g) => (
            <Link
              key={g.slug}
              href={`/health-goals/${g.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${g.slug === slug ? "bg-primary text-white border-primary" : "bg-white border-border hover:border-primary hover:text-primary"}`}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-border p-6 md:p-8 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-accent" />
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Tips & Insights</h2>
        </div>
        <ul className="grid md:grid-cols-2 gap-3">
          {goal.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Products */}
      <div className="mb-10">
        <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>
          Products for {goal.title}
        </h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary rounded-xl">
            <p className="text-muted-foreground">Check back soon for more products in this category.</p>
            <Link href="/category/herbal-supplements" className="text-primary text-sm hover:underline mt-2 inline-block">Browse All Products</Link>
          </div>
        )}
      </div>

      {/* Learn More */}
      <div className="bg-secondary rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Learn More</h2>
        </div>
        <p className="text-muted-foreground mb-4">{goal.description}</p>
        <Link href="/blog" className="text-primary text-sm flex items-center gap-1 hover:underline">
          Read our blog <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
