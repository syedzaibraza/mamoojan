 "use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, Check, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";

type Step = "shipping" | "payment" | "review";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
  const discount = useCartStore((s) => s.discount);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState<Step>("shipping");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = totalPrice >= 49 ? 0 : 5.99;
  const discountAmount = (totalPrice * discount) / 100;
  const finalTotal = totalPrice - discountAmount + shipping;

  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
  ];

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">Thank you for your purchase. Your order #MJ-2026-{Math.floor(Math.random() * 9000) + 1000} has been placed.</p>
        <p className="text-sm text-muted-foreground mt-4">You'll receive a confirmation email with tracking details shortly.</p>
        <Link href="/" className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Your Cart is Empty</h1>
        <Link href="/" className="inline-block mt-4 text-primary hover:underline">Return to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/cart" className="hover:text-primary">Cart</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Checkout</span>
      </nav>

      {/* Steps */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${step === s.key ? "text-primary" : steps.indexOf(steps.find((st) => st.key === step)!) > i ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === s.key ? "bg-primary text-white" : steps.indexOf(steps.find((st) => st.key === step)!) > i ? "bg-primary/20 text-primary" : "bg-gray-200 text-muted-foreground"}`}>
                {steps.indexOf(steps.find((st) => st.key === step)!) > i ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className="text-sm hidden sm:inline" style={{ fontWeight: 500 }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping */}
          {step === "shipping" && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">First Name</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="John" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Last Name</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Doe" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input type="email" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="john@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Address</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">City</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="New York" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">ZIP Code</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="10001" />
                </div>
              </div>
              <button onClick={() => setStep("payment")} className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment */}
          {step === "payment" && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Payment Method</h2>
              <div className="space-y-3 mb-6">
                {["Credit Card", "PayPal", "Apple Pay"].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                    <input type="radio" name="payment" defaultChecked={method === "Credit Card"} className="accent-primary" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Card Number</label>
                  <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Expiry</label>
                    <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">CVC</label>
                    <input type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="123" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary text-sm">Back</button>
                <button onClick={() => setStep("review")} className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review */}
          {step === "review" && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Order Review</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontWeight: 500 }}>{item.name}</p>
                      {item.variationAttributes && Object.keys(item.variationAttributes).length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {Object.entries(item.variationAttributes)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep("payment")} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary text-sm">Back</button>
                <button
                  onClick={() => {
                    setOrderPlaced(true);
                    clearCart();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  <Lock className="w-4 h-4" /> Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div>
          <div className="bg-secondary rounded-xl p-6 sticky top-32">
            <h3 className="mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              <div className="border-t pt-2 flex justify-between" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: "var(--primary)" }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground justify-center">
              <Lock className="w-3 h-3" /> Secured with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}