"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

type Order = {
  id: number;
  number: string;
  status: string;
  date_created: string;
  date_modified: string;
  total: string;
  currency: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
    price: number;
  }>;
  shipping_lines: Array<{
    method_title: string;
    total: string;
  }>;
  tax_lines: Array<{
    label: string;
    tax_total: string;
  }>;
};

const statuses = [
  { key: "processing", label: "Processing" },
  { key: "on-hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderId.trim()}`);
      if (!res.ok) {
        throw new Error("Order not found");
      }
      const data: Order = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statuses.findIndex((s) => s.key === status);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Enter Order ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              type="text"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Track Order"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {order && (
        <div className="space-y-6">
          {/* Status Bar */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {statuses.map((status, index) => (
                  <div key={status.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index <= getStatusIndex(order.status)
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 text-center">
                      {status.label}
                    </span>
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="text-lg">
                Current Status:{" "}
                {statuses.find((s) => s.key === order.status)?.label ||
                  order.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Order Date</h3>
                  <p>{new Date(order.date_created).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Modified</h3>
                  <p>{new Date(order.date_modified).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total</h3>
                  <p>
                    {order.currency} {order.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {order.billing.first_name} {order.billing.last_name}
              </p>
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>
                {order.billing.city}, {order.billing.state}{" "}
                {order.billing.postcode}
              </p>
              <p>{order.billing.country}</p>
              <p>{order.billing.email}</p>
              <p>{order.billing.phone}</p>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {order.shipping.first_name} {order.shipping.last_name}
              </p>
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>
                {order.shipping.city}, {order.shipping.state}{" "}
                {order.shipping.postcode}
              </p>
              <p>{order.shipping.country}</p>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.line_items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>
                      {order.currency} {item.total}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              {order.shipping_lines.map((shipping, index) => (
                <div key={index} className="flex justify-between">
                  <span>Shipping ({shipping.method_title})</span>
                  <span>
                    {order.currency} {shipping.total}
                  </span>
                </div>
              ))}
              {order.tax_lines.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.label}</span>
                  <span>
                    {order.currency} {tax.tax_total}
                  </span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {order.currency} {order.total}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
