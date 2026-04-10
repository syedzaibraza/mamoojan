"use client";

import Link from "next/link";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/products";
import { useState } from "react";

const blogCategories = [
  "All",
  "Wellness Guides",
  "Culture & Family",
  "Traditional Remedies",
  "Lifestyle Tips",
];

const allPosts = blogPosts;

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Blog</span>
      </nav>

      <div className="text-center mb-10">
        <h1
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "32px",
          }}
        >
          MamooJan Blog
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Stories, traditions, wellness tips, and cultural insights to keep you
          connected.
        </p>
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
            <img
              src={filteredPosts[0].image}
              alt={filteredPosts[0].title}
              className="w-full h-64 md:h-[400px] object-contain"
            />
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span
                className="text-xs text-accent"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                {filteredPosts[0].category}
              </span>
              <h2
                className="mt-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                }}
              >
                {filteredPosts[0].title}
              </h2>
              <p className="text-muted-foreground mt-3">
                {filteredPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>{filteredPosts[0].date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {filteredPosts[0].readTime}
                </span>
              </div>
              <Link
                href={`/blog/${filteredPosts[0].id}`}
                className="inline-flex items-center gap-1 mt-4 text-primary text-sm hover:underline cursor-pointer"
              >
                Read Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.slice(1).map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <span
                className="text-xs text-accent"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                {post.category}
              </span>
              <Link href={`/blog/${post.id}`}>
                <h3
                  className="mt-1 group-hover:text-muted-foreground transition-colors line-clamp-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {post.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
