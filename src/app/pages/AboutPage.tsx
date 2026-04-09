import Link from "next/link";
import {
  ChevronRight,
  Award,
  Zap,
  ShieldCheck,
  HeartPulse,
  Activity,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-50 to-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">About Us</span>
          </nav>
          <div>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 5vw, 42px)",
              }}
            >
              About <span className="text-accent">MamooJan</span>
            </h1>
            <p className="text-muted-foreground mt-6 text-lg">
              At Mamoojan, we believe in harnessing the natural power of the
              Himalayas to promote wellness, energy, and vitality.
            </p>
            <p className="text-muted-foreground mt-4 text-lg">
              As the sole distributor of Belle Vie in the United States, Canada,
              and Mexico, we are committed to bringing authentic Himalayan
              Shilajit and other natural products to customers who value purity
              and performance.
            </p>
            <p className="text-muted-foreground mt-4 text-lg">
              Our mission is simple: to provide products that are 100%
              authentic, naturally sourced, and crafted with care. Every item we
              offer undergoes strict quality checks to ensure it meets our high
              standards for excellence and customer satisfaction.
            </p>
            <p className="text-muted-foreground mt-4 text-lg">
              Mamoojan represents more than just a product line; it is a
              commitment to natural living and lasting energy. Through our
              growing range of health-boosting supplements and wellness
              essentials, we strive to help individuals enhance their daily
              vitality and live more balanced lives.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "100%", label: "Authenticity" },
              { value: "100%", label: "Quality" },
              { value: "100%", label: "Customer Service" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: "42px",
                  }}
                >
                  {item.value}
                </p>
                <p className="text-sm opacity-90 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ImageWithFallback
                src="/about-1.png"
                alt="MamooJan - Connecting families"
                className="rounded-xl w-full aspect-[4/3] object-contain"
              />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "28px",
                }}
              >
                Increase Energy With MamooJan
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: "Natural Energy",
                    desc: "Experience sustained energy the natural way.",
                  },
                  {
                    icon: <ShieldCheck className="w-5 h-5" />,
                    title: "Immune Support",
                    desc: "Our products help strengthen your immune system.",
                  },
                  {
                    icon: <HeartPulse className="w-5 h-5" />,
                    title: "Boost Your Immunity",
                    desc: "Regular use of our supplements promotes resilience against stress.",
                  },
                  {
                    icon: <Activity className="w-5 h-5" />,
                    title: "Natural Vitality",
                    desc: "Restore your body’s natural vitality and performance.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: "16px",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  Get in Touch
                </Link>
                <Link
                  href="/blog"
                  className="text-primary text-sm hover:underline"
                >
                  Read Our Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2
            className="mb-8"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "28px",
            }}
          >
            Our Quality Standards
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "MamooJan",
              "Belle Vie Distributor",
              "Natural Sourcing",
              "Made with Care",
              "North America Distribution",
              "Authentic Products",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-border"
              >
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
