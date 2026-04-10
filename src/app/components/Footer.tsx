"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useWooCategories } from "../hooks/useWooCategories";

export function Footer() {
  const { data: categoriesData } = useWooCategories();
  const footerCategories = categoriesData?.shopCategories ?? [];

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
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
            <p className="text-sm text-gray-400 mb-2">
              Connecting Families Around The World
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Traditional products, wellness supplements, snacks, and everyday
              essentials.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/mamoojanus/"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/mamoojanusa/"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://www.tiktok.com/@mamoojan27"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-1.877V14.14a5.338 5.338 0 1 1-4.637-5.293v2.747a2.591 2.591 0 1 0 1.82 2.474V2h2.817a4.79 4.79 0 0 0 3.77 1.877v2.809z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-sm mb-4 uppercase tracking-wider text-gray-300"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerCategories.length > 0
                ? footerCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/category/${category.slug}`}
                        className="hover:text-white transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                : null}
              {/* <li>
                <Link
                  href="/category/deals"
                  className="text-accent hover:text-accent/80 transition-colors"
                >
                  Deals & Offers
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Discover */}
          {/* <div>
            <h4 className="text-sm mb-4 uppercase tracking-wider text-gray-300" style={{ fontFamily: "Poppins, sans-serif" }}>Discover</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/health-goals/traditional-wellness" className="hover:text-white transition-colors">Traditional Wellness</Link></li>
              <li><Link href="/health-goals/family-culture" className="hover:text-white transition-colors">Family & Culture</Link></li>
              <li><Link href="/health-goals/energy-vitality" className="hover:text-white transition-colors">Energy & Vitality</Link></li>
              <li><Link href="/health-goals/everyday-lifestyle" className="hover:text-white transition-colors">Everyday Lifestyle</Link></li>
              <li><Link href="/health-goals/cultural-connection" className="hover:text-white transition-colors">Cultural Connection</Link></li>
            </ul>
          </div> */}

          {/* Company */}
          <div>
            <h4
              className="text-sm mb-4 uppercase tracking-wider text-gray-300"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-sm mb-4 uppercase tracking-wider text-gray-300"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href="tel:+12123210291"
                  className="hover:text-white transition-colors"
                >
                  +1 (212) 321-0291
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href="mailto:mamoojanus@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  mamoojanus@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>West Hempstead, NY, 11552 </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2026 Mamoojan.com Inc. All rights reserved. Est. 2017.
            </p>
            <Image
              src="/payment-logos.png"
              alt="Payment Methods"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
