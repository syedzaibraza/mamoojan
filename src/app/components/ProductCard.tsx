"use client";

import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import type { Product } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        {/* Labels */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.labels.map((label) => (
            <span
              key={label}
              className={`text-xs px-2 py-0.5 rounded-full ${label === "Best Seller"
                ? "bg-primary text-white"
                : label === "Sale"
                  ? "bg-accent text-white"
                  : label === "New"
                    ? "bg-blue-500 text-white"
                    : label === "Organic"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                }`}
            >
              {label}
            </span>
          ))}
        </div>
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {/* Quick View */}
        <Link
          href={`/product/${product.id}`}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="w-4 h-4 text-foreground" />
        </Link>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm mb-2 line-clamp-2 hover:text-primary transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "var(--primary)" }}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Diet badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.dietTypes.slice(0, 2).map((diet) => (
            <span key={diet} className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded border border-gray-200">
              {diet}
            </span>
          ))}
        </div>

        {/* Stock indicator */}
        {product.stockCount && product.stockCount <= 5 && (
          <p className="text-xs text-destructive mb-2">Only {product.stockCount} left in stock!</p>
        )}

        {/* Add to Cart */}
        <button
          onClick={() => {
            addToCart(product);
            toast.success(`${product.name} added to cart`);
          }}
          className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}