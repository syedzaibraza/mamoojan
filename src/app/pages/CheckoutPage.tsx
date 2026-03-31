 "use client";

import { type ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, Check, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { getAcceptJsUrl } from "../lib/payments/authorizenet";

type Step = "shipping" | "payment" | "review";

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
};

const initialForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};

function normalizeDigits(input: string) {
  return input.replace(/\D/g, "");
}

function parseExpiry(expiry: string) {
  const normalized = expiry.replace(/\s/g, "");
  const [month, year] = normalized.split("/");
  if (!month || !year) return null;
  const mm = normalizeDigits(month);
  const yy = normalizeDigits(year);
  if (mm.length < 1 || yy.length < 2) return null;
  const monthNum = Number(mm);
  if (!Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) return null;
  return { month: monthNum.toString().padStart(2, "0"), year: yy.slice(-2) };
}

function validateShipping(form: CheckoutForm): string | null {
  if (!form.firstName.trim() || !form.lastName.trim()) return "First and last name are required.";
  if (!form.email.trim() || !form.email.includes("@")) return "A valid email is required.";
  if (!form.address1.trim() || !form.city.trim() || !form.postcode.trim()) {
    return "Address, city, and ZIP/postal code are required.";
  }
  if (!form.country.trim()) return "Country is required.";
  return null;
}

function validateCard(form: CheckoutForm): string | null {
  const cardNumber = normalizeDigits(form.cardNumber);
  const cvv = normalizeDigits(form.cardCvv);
  const expiry = parseExpiry(form.cardExpiry);
  if (cardNumber.length < 13 || cardNumber.length > 19) return "Enter a valid card number.";
  if (!expiry) return "Enter card expiry as MM/YY.";
  if (cvv.length < 3 || cvv.length > 4) return "Enter a valid CVC/CVV.";
  return null;
}

function isSecureOriginForAcceptJs() {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
  const discount = useCartStore((s) => s.discount);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState<Step>("shipping");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>(initialForm);

  const shipping = totalPrice >= 49 ? 0 : 5.99;
  const discountAmount = (totalPrice * discount) / 100;
  const finalTotal = totalPrice - discountAmount + shipping;
  const couponCode = useCartStore((s) => s.couponCode);

  const wcLineItems = useMemo(() => {
    return items
      .map((item) => {
        const productId = Number(item.product.id);
        const variationId = item.variationId ? Number(item.variationId) : undefined;
        return {
          lineId: item.id,
          productId: Number.isFinite(productId) ? productId : NaN,
          variationId: variationId && Number.isFinite(variationId) ? variationId : undefined,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          name: item.name,
        };
      })
      .filter((item) => Number.isFinite(item.productId));
  }, [items]);

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
        <p className="text-muted-foreground mt-2">
          {successMessage || "Thank you for your purchase."} {orderNumber ? `Order #${orderNumber}.` : ""}
        </p>
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

  const handleFormChange =
    (field: keyof CheckoutForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const goToPayment = () => {
    const shippingError = validateShipping(form);
    setErrorMessage(shippingError);
    if (shippingError) return;
    setStep("payment");
  };

  const goToReview = () => {
    const cardError = validateCard(form);
    setErrorMessage(cardError);
    if (cardError) return;
    setStep("review");
  };

  async function ensureAcceptJsLoaded() {
    if (typeof window === "undefined") {
      throw new Error("Payment can only be processed in the browser.");
    }
    if (window.Accept && typeof window.Accept.dispatchData === "function") return;

    const primaryScriptUrl = getAcceptJsUrl();
    const fallbackScriptUrl = primaryScriptUrl.includes("jstest.authorize.net")
      ? "https://js.authorize.net/v1/Accept.js"
      : "https://jstest.authorize.net/v1/Accept.js";

    const waitForAccept = async () => {
      const startedAt = Date.now();
      while (Date.now() - startedAt < 5000) {
        if (window.Accept && typeof window.Accept.dispatchData === "function") return;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      throw new Error("Authorize.net SDK loaded but Accept.js is unavailable.");
    };

    const loadScript = async (scriptUrl: string) => {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(
          `script[src="${scriptUrl}"]`,
        );

        if (existingScript?.getAttribute("data-loaded") === "true") {
          resolve();
          return;
        }

        const script = existingScript || document.createElement("script");
        if (!existingScript) {
          script.src = scriptUrl;
          script.async = true;
          document.body.appendChild(script);
        }

        const timeout = window.setTimeout(() => {
          script.removeEventListener("load", onLoad);
          script.removeEventListener("error", onError);
          reject(new Error("Timed out while loading payment SDK."));
        }, 7000);

        const onLoad = () => {
          window.clearTimeout(timeout);
          script.setAttribute("data-loaded", "true");
          resolve();
        };
        const onError = () => {
          window.clearTimeout(timeout);
          reject(new Error("Failed to load payment SDK."));
        };

        script.addEventListener("load", onLoad, { once: true });
        script.addEventListener("error", onError, { once: true });
      });

      await waitForAccept();
    };

    try {
      await loadScript(primaryScriptUrl);
      return;
    } catch {
      // Remove stale script nodes and retry with fallback host.
      document.querySelectorAll('script[src*="authorize.net/v1/Accept.js"]').forEach((node) => {
        node.parentElement?.removeChild(node);
      });
      await loadScript(`${fallbackScriptUrl}?t=${Date.now()}`);
    }
  }

  async function tokenizeCard() {
    if (!isSecureOriginForAcceptJs()) {
      throw new Error(
        "Authorize.net requires HTTPS. Open checkout on https:// or use https local dev (npm run dev:https).",
      );
    }

    await ensureAcceptJsLoaded();
    const apiLoginId =
      process.env.NEXT_PUBLIC_AUTHNET_API_LOGIN_ID ||
      process.env.NEXT_PUBLIC_AUTHORIZE_NET_API_LOGIN_ID;
    const clientKey =
      process.env.NEXT_PUBLIC_AUTHNET_CLIENT_KEY || process.env.NEXT_PUBLIC_AUTHORIZE_NET_CLIENT_KEY;
    if (!apiLoginId || !clientKey) {
      throw new Error(
        "Missing public payment credentials. Set NEXT_PUBLIC_AUTHORIZE_NET_API_LOGIN_ID/NEXT_PUBLIC_AUTHORIZE_NET_CLIENT_KEY (or NEXT_PUBLIC_AUTHNET_API_LOGIN_ID/NEXT_PUBLIC_AUTHNET_CLIENT_KEY).",
      );
    }
    if (apiLoginId.length > 25) {
      throw new Error(
        "Invalid public API Login ID. Use your real Authorize.net API Login ID (max 25 chars), not a pk_/sk_ key.",
      );
    }
    const expiry = parseExpiry(form.cardExpiry);
    if (!expiry) throw new Error("Invalid card expiry.");

    return new Promise<{ dataDescriptor: string; dataValue: string }>((resolve, reject) => {
      const secureData = {
        authData: {
          apiLoginID: apiLoginId,
          clientKey,
        },
        cardData: {
          cardNumber: normalizeDigits(form.cardNumber),
          month: expiry.month,
          year: expiry.year,
          cardCode: normalizeDigits(form.cardCvv),
        },
      };

      window.Accept.dispatchData(secureData, (response) => {
        const resultCode = response.messages?.resultCode;
        if (resultCode !== "Ok" || !response.opaqueData?.dataDescriptor || !response.opaqueData?.dataValue) {
          const paymentError =
            response.messages?.message?.[0]?.text || "Could not tokenize payment details.";
          reject(new Error(paymentError));
          return;
        }
        resolve({
          dataDescriptor: response.opaqueData.dataDescriptor,
          dataValue: response.opaqueData.dataValue,
        });
      });
    });
  }

  const placeOrder = async () => {
    setErrorMessage(null);
    if (wcLineItems.length !== items.length) {
      setErrorMessage("Some cart items are not synced with WooCommerce product IDs.");
      return;
    }

    const shippingError = validateShipping(form);
    if (shippingError) {
      setErrorMessage(shippingError);
      setStep("shipping");
      return;
    }
    const cardError = validateCard(form);
    if (cardError) {
      setErrorMessage(cardError);
      setStep("payment");
      return;
    }

    try {
      setIsSubmitting(true);
      const opaqueData = await tokenizeCard();

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          opaqueData,
          billing: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            address1: form.address1.trim(),
            address2: form.address2.trim() || undefined,
            city: form.city.trim(),
            state: form.state.trim() || undefined,
            postcode: form.postcode.trim(),
            country: form.country.trim(),
          },
          shipping: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            address1: form.address1.trim(),
            address2: form.address2.trim() || undefined,
            city: form.city.trim(),
            state: form.state.trim() || undefined,
            postcode: form.postcode.trim(),
            country: form.country.trim(),
          },
          cart: {
            items: wcLineItems,
            shippingTotal: shipping,
            couponCode: couponCode || undefined,
            discountPercent: discount,
            total: Number(finalTotal.toFixed(2)),
          },
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        orderNumber?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Checkout failed. Please try another payment method.");
      }

      setSuccessMessage(data.message || "Payment complete.");
      setOrderNumber(data.orderNumber || null);
      setOrderPlaced(true);
      clearCart();
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          {/* Shipping */}
          {step === "shipping" && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">First Name</label>
                  <input value={form.firstName} onChange={handleFormChange("firstName")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="John" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Last Name</label>
                  <input value={form.lastName} onChange={handleFormChange("lastName")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Doe" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input value={form.email} onChange={handleFormChange("email")} type="email" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="john@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Phone (optional)</label>
                  <input value={form.phone} onChange={handleFormChange("phone")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+1 555 555 5555" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Address</label>
                  <input value={form.address1} onChange={handleFormChange("address1")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="123 Main St" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Address 2 (optional)</label>
                  <input value={form.address2} onChange={handleFormChange("address2")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Apt, suite, unit" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">City</label>
                  <input value={form.city} onChange={handleFormChange("city")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="New York" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">State (optional)</label>
                  <input value={form.state} onChange={handleFormChange("state")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="NY" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">ZIP Code</label>
                  <input value={form.postcode} onChange={handleFormChange("postcode")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="10001" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Country</label>
                  <input value={form.country} onChange={handleFormChange("country")} type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="US" />
                </div>
              </div>
              <button onClick={goToPayment} className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment */}
          {step === "payment" && (
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Payment Method</h2>
              <div className="space-y-3 mb-6">
                {["Credit Card (Authorize.net Accept.js)"].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                    <input type="radio" name="payment" defaultChecked={method.startsWith("Credit Card")} className="accent-primary" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Card Number</label>
                  <input value={form.cardNumber} onChange={handleFormChange("cardNumber")} autoComplete="cc-number" type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="4111 1111 1111 1111" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Expiry</label>
                    <input value={form.cardExpiry} onChange={handleFormChange("cardExpiry")} autoComplete="cc-exp" type="text" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">CVC</label>
                    <input value={form.cardCvv} onChange={handleFormChange("cardCvv")} autoComplete="cc-csc" type="password" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="123" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Card data is tokenized by Authorize.net Accept.js and never sent as raw PAN to your Next.js server.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("shipping")} className="px-6 py-3 border border-border rounded-lg hover:bg-secondary text-sm">Back</button>
                <button onClick={goToReview} className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
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
                  onClick={placeOrder}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  <Lock className="w-4 h-4" /> {isSubmitting ? "Processing..." : "Place Order"}
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