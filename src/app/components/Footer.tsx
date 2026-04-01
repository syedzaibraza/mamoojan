import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/Mamoojan-Logo-W.png"
                alt="MamooJan"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 mb-2">Connecting Families Around The World</p>
            <p className="text-sm text-gray-400 mb-4">Traditional products, wellness supplements, snacks, and everyday essentials.</p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Youtube"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm mb-4 uppercase tracking-wider text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/category/herbal-supplements" className="hover:text-white transition-colors">Herbal Supplements</Link></li>
              <li><Link href="/category/snacks-food" className="hover:text-white transition-colors">Snacks & Food</Link></li>
              <li><Link href="/category/personal-care-wellness" className="hover:text-white transition-colors">Personal Care</Link></li>
              <li><Link href="/category/lifestyle-products" className="hover:text-white transition-colors">Lifestyle Products</Link></li>
              <li><Link href="/category/celebration-items" className="hover:text-white transition-colors">Celebration Items</Link></li>
              <li><Link href="/category/deals" className="text-accent hover:text-accent/80 transition-colors">Deals & Offers</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm mb-4 uppercase tracking-wider text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Discover</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/health-goals/traditional-wellness" className="hover:text-white transition-colors">Traditional Wellness</Link></li>
              <li><Link href="/health-goals/family-culture" className="hover:text-white transition-colors">Family & Culture</Link></li>
              <li><Link href="/health-goals/energy-vitality" className="hover:text-white transition-colors">Energy & Vitality</Link></li>
              <li><Link href="/health-goals/everyday-lifestyle" className="hover:text-white transition-colors">Everyday Lifestyle</Link></li>
              <li><Link href="/health-goals/cultural-connection" className="hover:text-white transition-colors">Cultural Connection</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm mb-4 uppercase tracking-wider text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Rewards Program</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm mb-4 uppercase tracking-wider text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+1 (212) 321-0291</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:mamoojanus@gmail.com" className="hover:text-white transition-colors">mamoojanus@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>522 Mulberry Lane<br />West Hempstead, NY 11552</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">&copy; 2026 Mamoojan.com Inc. All rights reserved. Est. 2017.</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
