 "use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Package, CreditCard, Gift, MapPin, Star, Settings, User } from "lucide-react";

const tabs = [
  { key: "orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
  { key: "subscriptions", label: "Subscriptions", icon: <CreditCard className="w-4 h-4" /> },
  { key: "rewards", label: "Rewards", icon: <Gift className="w-4 h-4" /> },
  { key: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
  { key: "reviews", label: "Reviews", icon: <Star className="w-4 h-4" /> },
  { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
] as const;

type TabKey = typeof tabs[number]["key"];

const mockOrders = [
  { id: "MJ-2026-4521", date: "March 5, 2026", status: "Delivered", total: 67.97, items: 3 },
  { id: "MJ-2026-3892", date: "February 20, 2026", status: "Shipped", total: 44.99, items: 1 },
  { id: "MJ-2026-2714", date: "February 1, 2026", status: "Delivered", total: 89.96, items: 4 },
];

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("orders");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">My Account</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>Welcome back, John!</h1>
          <p className="text-sm text-muted-foreground">Member since January 2025 &middot; MamooJan Gold Member</p>
        </div>
      </div>

      {/* Points Banner */}
      <div className="bg-gradient-to-r from-primary to-stone-700 text-white rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-sm opacity-80">Your MamooJan Rewards</p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "36px" }}>2,450 Points</p>
            <p className="text-sm opacity-80">Worth $24.50 in discounts</p>
          </div>
          <Link href="/category/herbal-supplements" className="px-6 py-2.5 bg-white text-primary rounded-lg text-sm hover:bg-white/90" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
            Redeem Points
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Order History</h2>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm" style={{ fontWeight: 500 }}>Order #{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.date} &middot; {order.items} items</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${order.status === "Delivered" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                        {order.status}
                      </span>
                      <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "subscriptions" && (
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
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Saved Addresses</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-primary rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                  </div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>John Doe</p>
                  <p className="text-sm text-muted-foreground">123 Main Street</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 border-dashed flex items-center justify-center">
                  <button className="text-sm text-primary hover:underline">+ Add New Address</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>My Reviews</h2>
              <div className="bg-white border border-border rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>Shilajit Resin - Pure Himalayan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Reviewed on Feb 28, 2026</p>
                    <p className="text-sm text-muted-foreground mt-2">"Authentic quality Shilajit! Reminds me of the pure resin from back home. Great energy boost and fast shipping."</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Leave a review and earn 50 reward points!</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Account Settings</h2>
              <div className="bg-white border border-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <input type="email" defaultValue="john@example.com" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-border">
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>Newsletter</p>
                    <p className="text-xs text-muted-foreground">Receive health tips and exclusive offers</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-primary" />
                </div>
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}