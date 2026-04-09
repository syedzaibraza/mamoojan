"use client";

import Link from "next/link";
import { ChevronRight, ChevronDown, Mail, Phone, MapPin, Clock, MessageCircle, Warehouse } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Contact Us</span>
      </nav>

      <div className="text-center mb-10">
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "32px" }}>Contact Us</h1>
        <p className="text-muted-foreground mt-2">We'd love to hear from you. Our team is here to help with any questions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Contact Info */}
        <div className="space-y-4">
          {[
            { icon: <Mail className="w-5 h-5" />, title: "Email", detail: "mamoojanus@gmail.com" },
            { icon: <Phone className="w-5 h-5" />, title: "Phone", detail: "+1 (212) 321-0291" },
            { icon: <MapPin className="w-5 h-5" />, title: "Office Address", detail: "West Hempstead, NY, 11552", sub: "United States" },
            // { icon: <Warehouse className="w-5 h-5" />, title: "Warehouse", detail: "441 Schiller St", sub: "Elizabeth, NJ 07206" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-sm" style={{ fontWeight: 500 }}>{item.title}</h3>
                <p className="text-sm text-primary">{item.detail}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-6 md:p-8">
          <h2 className="mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a topic</option>
                <option>Order Question</option>
                <option>Product Information</option>
                <option>Shipping & Returns</option>
                <option>Wholesale / Distribution</option>
                <option>Rewards Program</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gradient-to-b from-secondary to-secondary/60 rounded-2xl border border-border p-6 md:p-8 mb-12">
        <h2 className="text-center mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "24px" }}>Frequently Asked Questions</h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Everything you need to know about Mamoojan products.
        </p>
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "What is Shilajit?",
              a: "Shilajit is a natural mineral-rich resin found in the Himalayan mountains, known for its energy-boosting and revitalizing properties.",
            },
            {
              q: "How should I use Mamoojan products?",
              a: "Each product comes with simple usage directions on the packaging. Follow the recommended amount for best results.",
            },
            {
              q: "Are Mamoojan products natural?",
              a: "Yes. All Mamoojan products are made using pure and authentic ingredients sourced from nature.",
            },
            {
              q: "Can I use multiple Mamoojan products together?",
              a: "Yes, our products complement each other well and can be used together as part of your daily wellness routine.",
            },
            {
              q: "What makes Mamoojan different from others?",
              a: "Mamoojan focuses on authenticity, quality, and customer satisfaction — ensuring every product delivers real results.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <summary
                className="flex items-center justify-between gap-3 p-4 md:p-5 cursor-pointer list-none"
                style={{ fontWeight: 600 }}
              >
                <span className="text-sm md:text-base">{faq.q}</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-4 md:px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
