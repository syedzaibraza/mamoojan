"use client";

import Link from "next/link";
import { ChevronRight, Mail, Phone, MapPin, Clock, MessageCircle, Warehouse } from "lucide-react";
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
            { icon: <Mail className="w-5 h-5" />, title: "Email", detail: "mamoojanus@gmail.com", sub: "We respond within 24 hours" },
            { icon: <Phone className="w-5 h-5" />, title: "Phone", detail: "+1 (212) 321-0291", sub: "Mon-Fri 9am-6pm EST" },
            { icon: <MapPin className="w-5 h-5" />, title: "Office Address", detail: "522 Mulberry Lane", sub: "West Hempstead, NY 11552" },
            { icon: <Warehouse className="w-5 h-5" />, title: "Warehouse", detail: "441 Schiller St", sub: "Elizabeth, NJ 07206" },
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
      <div className="bg-secondary rounded-xl p-6 md:p-8 mb-12">
        <h2 className="text-center mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "20px" }}>Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            { q: "What is your return policy?", a: "We offer a 30-day return policy on all unopened products. If you're not satisfied, contact us for a full refund." },
            { q: "How long does shipping take?", a: "Orders ship from our New Jersey warehouse within 1-2 business days. Standard delivery takes 3-5 business days across the US." },
            { q: "Do you ship internationally?", a: "Currently we ship within the United States. International shipping options are coming soon." },
            { q: "Do you offer wholesale pricing?", a: "Yes! We offer wholesale and distribution partnerships. Contact us at mamoojanus@gmail.com for wholesale inquiries." },
          ].map((faq) => (
            <details key={faq.q} className="bg-white rounded-lg border border-border">
              <summary className="p-4 cursor-pointer text-sm list-none" style={{ fontWeight: 500 }}>{faq.q}</summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
