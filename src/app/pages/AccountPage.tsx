"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Package,
  CreditCard,
  Gift,
  MapPin,
  Star,
  Settings,
  User,
  LogOut,
  EyeIcon,
  EyeOffIcon,
  Loader2,
  XIcon,
  ChevronLeft,
  Heart,
  Lock,
} from "lucide-react";

const tabs = [
  { key: "orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
  // { key: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
  // { key: "rewards", label: "Rewards", icon: <Gift className="w-4 h-4" /> },
  {
    key: "addresses",
    label: "Addresses",
    icon: <MapPin className="w-4 h-4" />,
  },
  // { key: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
  // { key: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
] as const;

type TabKey = (typeof tabs)[number]["key"];

type AccountCustomer = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type AccountOrder = {
  id: number;
  number: string;
  dateCreated: string;
  status:
    | "pending"
    | "processing"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "refunded"
    | "failed";
  total: number;
  items: number;
};

type AccountApiResponse = {
  ok: boolean;
  message?: string;
  customer?: AccountCustomer;
};

type OrdersApiResponse = {
  ok: boolean;
  message?: string;
  orders?: AccountOrder[];
};

type OrderDetail = {
  id: number;
  number: string;
  dateCreated: string;
  status: string;
  total: number;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  paymentMethodTitle: string;
  lineItems: Array<{
    id: number;
    name: string;
    quantity: number;
    total: number;
    subtotal: number;
  }>;
  billing: {
    name: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    name: string;
    address1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
};

type OrderDetailApiResponse = {
  ok: boolean;
  message?: string;
  order?: OrderDetail;
};

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  "on-hold": "bg-orange-50 text-orange-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
  refunded: "bg-purple-50 text-purple-700",
  failed: "bg-red-50 text-red-700",
};

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function fetchAccountMe() {
  const res = await fetch("/api/account/me", { cache: "no-store" });
  const data = (await res.json()) as AccountApiResponse;
  if (!res.ok || !data.ok || !data.customer) {
    throw new ApiError(data.message || "Could not load account.", res.status);
  }
  return data.customer;
}

async function fetchAccountOrders() {
  const res = await fetch("/api/account/orders", { cache: "no-store" });
  const data = (await res.json()) as OrdersApiResponse;
  if (!res.ok || !data.ok) {
    throw new ApiError(data.message || "Could not load orders.", res.status);
  }
  return data.orders || [];
}

export function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>("orders");
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const meQuery = useQuery({
    queryKey: ["account-me"],
    queryFn: fetchAccountMe,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  const ordersQuery = useQuery({
    queryKey: ["account-orders"],
    queryFn: fetchAccountOrders,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const customer = meQuery.data ?? null;
  const orders = ordersQuery.data ?? [];

  // const rewardPoints = useMemo(() => {
  //   return Math.max(0, orders.length * 40);
  // }, [orders.length]);

  useEffect(() => {
    const status =
      (meQuery.error as ApiError | null)?.status ||
      (ordersQuery.error as ApiError | null)?.status;
    if (status === 401) {
      router.replace("/login?next=/account");
    }
  }, [meQuery.error, ordersQuery.error, router]);

  useEffect(() => {
    const meStatus = (meQuery.error as ApiError | null)?.status;
    const ordersStatus = (ordersQuery.error as ApiError | null)?.status;
    if (meQuery.error && meStatus !== 401) {
      toast.error(
        (meQuery.error as Error).message || "Could not load account.",
      );
    }
    if (ordersQuery.error && ordersStatus !== 401) {
      toast.error(
        (ordersQuery.error as Error).message || "Could not load orders.",
      );
    }
  }, [meQuery.error, ordersQuery.error]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.removeQueries({ queryKey: ["account-me"] });
    queryClient.removeQueries({ queryKey: ["account-orders"] });
    toast.success("Logged out successfully.");
    router.push("/login?next=/account");
  }

  async function loadOrderDetails(orderId: number) {
    const cachedOrder = queryClient.getQueryData<OrderDetail>([
      "order-detail",
      orderId,
    ]);
    if (cachedOrder) {
      setSelectedOrder(cachedOrder);
      return;
    }

    setLoadingOrderId(orderId);
    try {
      const res = await fetch(`/api/account/orders/${orderId}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as OrderDetailApiResponse;
      if (!res.ok || !data.ok || !data.order) {
        throw new Error(data.message || "Could not load order details.");
      }
      queryClient.setQueryData(["order-detail", orderId], data.order);
      setSelectedOrder(data.order);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Could not load order details.";
      toast.error(msg);
    } finally {
      setLoadingOrderId(null);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      toast.error("Current and new password are required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Unable to change password.");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(data.message || "Password updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (
    (meQuery.isLoading && !meQuery.data) ||
    (ordersQuery.isLoading && !ordersQuery.data)
  ) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-56 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>

          {/* Content skeleton */}
          <div className="lg:col-span-3 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">My Account</span>
      </nav>
      {((meQuery.error && (meQuery.error as ApiError).status !== 401) ||
        (ordersQuery.error &&
          (ordersQuery.error as ApiError).status !== 401)) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {(meQuery.error as Error | null)?.message ||
            (ordersQuery.error as Error | null)?.message ||
            "Could not load account"}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            Welcome back, {customer?.firstName || customer?.name || "Customer"}!
          </h1>
          <p className="text-sm text-muted-foreground">{customer?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Points Banner */}
      {/* <div className="bg-gradient-to-r from-primary to-stone-700 text-white rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">Your MamooJan Rewards</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "36px" }}>{rewardPoints} Points</p>
            <p className="text-sm opacity-80">Keep shopping to earn more rewards</p>
          </div>
          <Link href="/category/herbal-supplements" className="px-6 py-2.5 bg-white text-primary rounded-lg text-sm hover:bg-white/90" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Redeem Points
          </Link>
        </div>
      </div> */}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === "settings") {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } else {
                    setSelectedOrder(null);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.key ? "bg-primary text-white" : "text-foreground hover:bg-secondary"}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "orders" && (
            <div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                Order History
              </h2>
              {orders.length === 0 ? (
                <div className="bg-white border border-border rounded-xl p-6">
                  <p className="text-sm text-muted-foreground">
                    No orders found for this account yet.
                  </p>
                </div>
              ) : (
                <>
                  {selectedOrder ? (
                    <div className="mt-6 bg-white border border-border rounded-xl p-5">
                      <div className="flex gap-2 items-start">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer hover:bg-black/5  p-1 rounded-sm"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h3
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 600,
                              fontSize: "18px",
                            }}
                          >
                            Order #{selectedOrder.number}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {selectedOrder.status} ·{" "}
                            {new Date(
                              selectedOrder.dateCreated,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm">
                        {selectedOrder.lineItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-border pb-2"
                          >
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>${item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Billing</p>
                          <p className="text-muted-foreground">
                            {selectedOrder.billing.name || "-"}
                          </p>
                          <p className="text-muted-foreground">
                            {selectedOrder.billing.email || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Shipping</p>
                          <p className="text-muted-foreground">
                            {selectedOrder.shipping.name || "-"}
                          </p>
                          <p className="text-muted-foreground">
                            {selectedOrder.shipping.address1 || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-sm space-y-1">
                        <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
                        <p>
                          Shipping: ${selectedOrder.shippingTotal.toFixed(2)}
                        </p>
                        <p>
                          Discount: ${selectedOrder.discountTotal.toFixed(2)}
                        </p>
                        <p style={{ fontWeight: 600 }}>
                          Total: ${selectedOrder.total.toFixed(2)}
                        </p>
                        {selectedOrder.paymentMethodTitle && (
                          <p className="text-muted-foreground">
                            Payment: {selectedOrder.paymentMethodTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-sm" style={{ fontWeight: 500 }}>
                              Order #{order.number}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.dateCreated).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}{" "}
                              &middot; {order.items} items
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full ${statusColors[order.status]} capitalize`}
                            >
                              {order.status}
                            </span>
                            <span
                              className="text-sm"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              ${order.total.toFixed(2)}
                            </span>
                            <button
                              onClick={() => void loadOrderDetails(order.id)}
                              disabled={loadingOrderId === order.id}
                              className="text-xs text-primary hover:underline disabled:opacity-60 cursor-pointer hover:bg-black/5  p-1 rounded-sm"
                            >
                              {loadingOrderId === order.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <EyeIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* {activeTab === "subscriptions" && (
            <div>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Active Subscriptions</h2>
              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontWeight: 500 }}>Shilajit Resin - Monthly</p>
                    <p className="text-xs text-muted-foreground">Next delivery: March 25, 2026</p>
                    <p className="text-xs text-primary mt-1">Saving 20% with Subscribe & Save</p>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>$27.99/mo</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">Manage your subscriptions anytime. Cancel or pause with no fees.</p>
            </div>
          )}

          {activeTab === "rewards" && (
            <div>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>MamooJan Rewards</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-border rounded-xl p-4 text-center">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px", color: "var(--primary)" }}>2,450</p>
                  <p className="text-sm text-muted-foreground">Available Points</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 text-center">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>5,200</p>
                  <p className="text-sm text-muted-foreground">Lifetime Points</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 text-center">
                  <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Gold</p>
                  <p className="text-sm text-muted-foreground">Member Tier</p>
                </div>
              </div>
              <h3 className="text-sm mb-3" style={{ fontWeight: 500 }}>Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { action: "Purchase: Shilajit Resin", points: "+35", date: "March 5" },
                  { action: "Product Review", points: "+50", date: "March 3" },
                  { action: "Purchase: Mango Bites", points: "+7", date: "Feb 20" },
                  { action: "Friend Referral", points: "+500", date: "Feb 15" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border text-sm">
                    <span>{item.action}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-primary">{item.points}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {activeTab === "addresses" && (
            <div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                Saved Addresses
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-primary rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>
                    {customer?.name || "Customer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer?.address1 || "No address on file"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[customer?.city, customer?.state, customer?.postcode]
                      .filter(Boolean)
                      .join(", ") || "Add your city/state"}
                  </p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 border-dashed flex items-center justify-center">
                  <Link
                    href="/checkout"
                    className="text-sm text-primary hover:underline"
                  >
                    + Add / Update Address
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* {activeTab === "reviews" && (
            <div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                My Reviews
              </h2>
              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>
                      Shilajit Resin - Pure Himalayan
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reviewed on Feb 28, 2026
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      "Authentic quality Shilajit! Reminds me of the pure resin
                      from back home. Great energy boost and fast shipping."
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Leave a review and earn 50 reward points!
              </p>
            </div>
          )} */}

          {activeTab === "settings" && (
            <div>
              <h2
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "20px",
                }}
              >
                Account Settings
              </h2>
              <div className="bg-white border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={customer?.name || ""}
                    className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-secondary/40"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input
                    type="email"
                    readOnly
                    value={customer?.email || ""}
                    className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-secondary/40"
                  />
                </div>
                {/* <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>Newsletter</p>
                    <p className="text-xs text-muted-foreground">Receive health tips and exclusive offers</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-primary" />
                </div> */}
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-md font-medium">Change Password</p>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Current Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showCurrentPassword
                            ? "Hide current password"
                            : "Show current password"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      New Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showNewPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Confirm New Password
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 border border-border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm disabled:opacity-60"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
