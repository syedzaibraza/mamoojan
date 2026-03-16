"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

const navCategories = [
  {
    name: "Herbal Supplements",
    slug: "herbal-supplements",
    subcategories: ["Shilajit Resin", "Shilajit Gummies", "Shilajit Shot", "Joshanda", "Energy Supplements", "Traditional Remedies"],
    featured: ["Shilajit Resin - Pure Himalayan", "Shilajit Gummies - Daily Wellness"],
  },
  {
    name: "Snacks & Food",
    slug: "snacks-food",
    subcategories: ["Mango Snacks", "Dried Fruits", "Traditional Candy", "Digestive Treats", "Spiced Snacks"],
    featured: ["Mango Bites - Sweet Dried Mango", "Hazmina Digestive Candy"],
  },
  {
    name: "Personal Care",
    slug: "personal-care-wellness",
    subcategories: ["Tongue Scrapers", "Alum Blocks", "Grooming Essentials", "Oral Care", "Natural Skincare"],
    featured: ["Tongue Scraper - Stainless Steel"],
  },
  {
    name: "Lifestyle",
    slug: "lifestyle-products",
    subcategories: ["Caps & Hats", "Water Bottles", "Accessories", "Daily Essentials"],
    featured: ["MamooJan Classic Cap", "MamooJan Water Bottle"],
  },
  {
    name: "Celebrations",
    slug: "celebration-items",
    subcategories: ["Greeting Cards", "Event Flags", "Decorations", "Party Supplies"],
    featured: ["Celebration Greeting Cards Set"],
  },
  { name: "Brands", slug: "brands", subcategories: ["MamooJan", "Focus N Rulz"] },
  { name: "Deals", slug: "category/deals", subcategories: [] },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const { totalItems } = useCart();
  const router = useRouter();
  const menuTimeout = useRef<ReturnType<typeof setTimeout>>();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
      setSearchOpen(true);
    } else {
      setSearchResults([]);
      setSearchOpen(false);
    }
  };

  const handleMenuEnter = (name: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(name);
  };

  const handleMenuLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 200);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
          <span className="hidden sm:inline">Free Shipping on Orders $35+ |</span>
          <span className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Connecting Families Around The World
          </span>
          <span className="hidden md:inline">| Use code MAMOOJAN10 for 10% Off</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>M</span>
            </div>
            <span className="text-xl hidden sm:block" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "var(--foreground)" }}>
              MamooJan
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products, snacks, supplements..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50">
                <div className="p-2 text-xs text-muted-foreground border-b">Product Suggestions</div>
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    className="flex items-center gap-3 p-3 w-full text-left hover:bg-secondary transition-colors"
                    onClick={() => {
                      router.push(`/product/${product.id}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <div className="text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.brand} &middot; ${product.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
                <div className="p-2 text-xs text-muted-foreground border-t">Popular: Shilajit, Mango Bites, Tongue Scraper</div>
              </div>
            )}
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/account" className="hidden sm:flex items-center gap-1.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Account</span>
            </Link>
            <Link href="/cart" className="relative flex items-center gap-1.5 text-sm text-foreground hover:text-muted-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 md:-top-2 md:-right-5 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            {navCategories.map((cat) => (
              <li
                key={cat.name}
                className="relative"
                onMouseEnter={() => handleMenuEnter(cat.name)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={cat.slug === "brands" ? "/brands" : cat.slug.startsWith("category") ? `/${cat.slug}` : `/category/${cat.slug}`}
                  className={`flex items-center gap-1 px-3 py-3 text-sm transition-colors ${
                    cat.name === "Deals" ? "text-accent" : "text-foreground"
                  } hover:text-muted-foreground`}
                >
                  {cat.name}
                  {cat.subcategories.length > 0 && <ChevronDown className="w-3 h-3" />}
                </Link>
                {/* Mega Menu */}
                {activeMenu === cat.name && cat.subcategories.length > 0 && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-xl border border-border rounded-b-lg p-6 min-w-[400px] z-50"
                    onMouseEnter={() => handleMenuEnter(cat.name)}
                    onMouseLeave={handleMenuLeave}
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Subcategories</h4>
                        <ul className="space-y-2">
                          {cat.subcategories.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/category/${cat.slug}`}
                                className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                                onClick={() => setActiveMenu(null)}
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {cat.featured && cat.featured.length > 0 && (
                        <div>
                          <h4 className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Featured</h4>
                          <div className="space-y-3">
                            {cat.featured.map((f) => (
                              <div key={f} className="p-3 bg-secondary rounded-lg">
                                <span className="text-sm">{f}</span>
                              </div>
                            ))}
                            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                              <span className="text-sm text-accent">New Arrivals This Week!</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white max-h-[70vh] overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.slug === "brands" ? "/brands" : `/category/${cat.slug}`}
                className={`block py-3 px-3 rounded-lg text-sm ${cat.name === "Deals" ? "text-accent bg-accent/5" : "text-foreground"} hover:bg-secondary transition-colors`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t pt-3 mt-3">
              <Link href="/account" className="flex items-center gap-2 py-3 px-3 text-sm text-foreground hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                <User className="w-4 h-4" /> My Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
