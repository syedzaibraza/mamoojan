import Link from "next/link";
import { ChevronRight, Globe, Award, Heart, Users, Leaf, Package } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-50 to-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">About Us</span>
          </nav>
          <div className="max-w-3xl">
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 42px)" }}>
              Connecting <span className="text-accent">Families</span> Around The World
            </h1>
            <p className="text-muted-foreground mt-6 text-lg">
              Founded on July 25, 2017, MamooJan is dedicated to bringing traditional products, wellness supplements, authentic snacks, and everyday essentials to customers through our online store and retail distribution. We bridge cultures and connect families through familiar flavors and natural wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center mb-10" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>What Drives Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart className="w-8 h-8" />, title: "Family & Culture", desc: "We connect families and communities through familiar products that bring the tastes and traditions of home to your doorstep." },
              { icon: <Leaf className="w-8 h-8" />, title: "Traditional Wellness", desc: "We offer natural herbal supplements like Shilajit and Joshanda, honoring centuries-old traditions of holistic health and wellness." },
              { icon: <Globe className="w-8 h-8" />, title: "Global Connection", desc: "We bridge cultures by making South Asian heritage foods, snacks, and traditional products accessible worldwide." },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/5 text-primary flex items-center justify-center mb-4">{v.icon}</div>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "18px" }}>{v.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2017", label: "Founded" },
              { value: "140+", label: "Products" },
              { value: "2", label: "Trusted Brands" },
              { value: "4.7/5", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "36px" }}>{s.value}</p>
                <p className="text-sm opacity-80 mt-1">{s.label}</p>
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
                src="https://images.unsplash.com/photo-1710186012216-9b2cf2a800bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwZmFtaWx5JTIwZ2F0aGVyaW5nJTIwZm9vZHxlbnwxfHx8fDE3NzMwODc0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="MamooJan - Connecting families"
                className="rounded-xl w-full aspect-[4/3] object-cover"
              />
            </div>
            <div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Our Story</h2>
              <p className="text-muted-foreground mt-4">
                MamooJan started with a simple idea: families living abroad deserve easy access to the traditional products, snacks, and wellness items they grew up with. What began as a small effort to share beloved products has grown into a trusted online retail and distribution company.
              </p>
              <p className="text-muted-foreground mt-4">
                Based in West Hempstead, New York, with our warehouse in Elizabeth, New Jersey, we serve customers across the United States. From authentic Himalayan Shilajit supplements distributed through our Focus N Rulz brand to favorite childhood mango snacks, every product is selected with care to bring joy and connection to your home.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <Link href="/contact" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                  Get in Touch
                </Link>
                <Link href="/blog" className="text-primary text-sm hover:underline">Read Our Blog</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="mb-8" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "28px" }}>Our Brands & Partners</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["MamooJan", "Focus N Rulz", "Family Owned", "Made with Care", "USA Distribution", "Authentic Products"].map((item) => (
              <div key={item} className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-border">
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
