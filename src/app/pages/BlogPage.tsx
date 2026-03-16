"use client";

import Link from "next/link";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/products";
import { useState } from "react";

const blogCategories = ["All", "Wellness Guides", "Culture & Family", "Traditional Remedies", "Lifestyle Tips"];

const allPosts = [
  ...blogPosts,
  {
    id: "4",
    title: "5 Traditional Snacks That Connect You to Your Roots",
    excerpt: "From Mango Bites to Hazmina digestive candy, explore traditional snacks that bring the flavors of South Asian heritage to your everyday life.",
    category: "Culture & Family",
    image: "https://images.unsplash.com/photo-1770124129809-fe1fe6b7c23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMG1hbmdvJTIwZnJ1aXQlMjBzbmFja3N8ZW58MXx8fHwxNzczMDg3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 15, 2026",
    readTime: "5 min read",
  },
  {
    id: "5",
    title: "Tongue Scraping: The Ancient Practice for Better Oral Health",
    excerpt: "Discover why tongue scraping has been a daily ritual in Ayurvedic tradition for thousands of years and how it benefits your overall health.",
    category: "Lifestyle Tips",
    image: "https://images.unsplash.com/photo-1570586790173-a031eec3f21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjB0b25ndWUlMjBzY3JhcGVyJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzczMDg3NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 10, 2026",
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "How to Celebrate Cultural Holidays When Living Abroad",
    excerpt: "Tips and ideas for keeping cultural traditions alive through decorations, greeting cards, and traditional foods, even far from home.",
    category: "Culture & Family",
    image: "https://images.unsplash.com/photo-1763879537802-18dd4a76b3c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhcnR5JTIwZmxhZ3MlMjBkZWNvcmF0aW9uJTIwYnVudGluZ3xlbnwxfHx8fDE3NzMwODc0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 5, 2026",
    readTime: "7 min read",
  },
];

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" ? allPosts : allPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Blog</span>
      </nav>

      <div className="text-center mb-10">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px" }}>MamooJan Blog</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Stories, traditions, wellness tips, and cultural insights to keep you connected.</p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${activeCategory === cat ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <div className="mb-10">
          <div className="grid md:grid-cols-2 gap-6 bg-white rounded-xl border border-border overflow-hidden">
            <img src={filteredPosts[0].image} alt={filteredPosts[0].title} className="w-full h-64 md:h-full object-cover" />
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span className="text-xs text-accent" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{filteredPosts[0].category}</span>
              <h2 className="mt-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>{filteredPosts[0].title}</h2>
              <p className="text-muted-foreground mt-3">{filteredPosts[0].excerpt}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>{filteredPosts[0].date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {filteredPosts[0].readTime}</span>
              </div>
              <span className="inline-flex items-center gap-1 mt-4 text-primary text-sm hover:underline cursor-pointer">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.slice(1).map((post) => (
          <article key={post.id} className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="p-5">
              <span className="text-xs text-accent" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{post.category}</span>
              <h3 className="mt-1 group-hover:text-muted-foreground transition-colors line-clamp-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px" }}>
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
