"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Truck, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, couponCode, setCouponCode, discount, applyCoupon } = useCart();

  const shipping = totalPrice >= 49 ? 0 : 5.99;
  const discountAmount = (totalPrice * discount) / 100;
  const finalTotal = totalPrice - discountAmount + shipping;

  const suggestedProducts = products.filter((p) => !items.some((i) => i.product.id === p.id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Your Cart is Empty</h1>
        <p className="text-muted-foreground mt-2 mb-6">Discover authentic products and start exploring our collection.</p>
        <Link href="/category/herbal-supplements" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="mt-16">
          <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Popular Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {suggestedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="mb-8" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-xl border border-border">
              <Link href={`/product/${item.product.id}`} className="shrink-0">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <Link href={`/product/${item.product.id}`} className="text-sm hover:text-primary transition-colors line-clamp-2" style={{ fontWeight: 500 }}>
                      {item.product.name}
                    </Link>
                    {item.subscription && (
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">Subscribe & Save 20%</span>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove item"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary" aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "var(--primary)" }}>
                    ${(item.product.price * item.quantity * (item.subscription ? 0.8 : 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl border border-border p-6 sticky top-32">
            <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px" }}>Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-primary"><span>Discount ({discount}%)</span><span>-${discountAmount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-primary">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">Add ${(49 - totalPrice).toFixed(2)} more for free shipping</p>
              )}
              <div className="border-t pt-3 flex justify-between" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ fontSize: "20px", color: "var(--primary)" }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button onClick={applyCoupon} className="px-4 py-2 border border-primary text-primary rounded-lg text-sm hover:bg-primary/5">Apply</button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Try MAMOOJAN10 or SAVE20</p>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Fast Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}