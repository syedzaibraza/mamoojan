import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

export function TermsPage() {
  const sections = [
    {
      id: "use-of-website",
      title: "1. Use of Website",
      content: (
        <>
          <p>
            Mamoojan.com provides natural wellness products and related items for personal use. By using
            this website, you confirm that:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>You are at least 18 years old or using the site under parental supervision</li>
            <li>You will use the website only for lawful purposes</li>
            <li>You will not misuse, copy, or exploit website content without permission</li>
          </ul>
        </>
      ),
    },
    {
      id: "products-information",
      title: "2. Products & Information",
      content: (
        <>
          <p>
            We offer natural supplements and lifestyle products designed to support wellness and vitality.
            While we aim for accuracy:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Product descriptions, images, and prices may change without notice</li>
            <li>Results from supplements may vary from person to person</li>
            <li>Our products are not intended to diagnose, treat, cure, or prevent any disease</li>
          </ul>
          <p className="mt-2">Always consult a healthcare professional before using any supplement.</p>
        </>
      ),
    },
    {
      id: "orders",
      title: "3. Orders & Payments",
      content: (
        <ul className="list-disc pl-5 space-y-1">
          <li>All orders are subject to acceptance and availability</li>
          <li>We reserve the right to cancel or refuse any order at our discretion</li>
          <li>Payments must be completed before order processing</li>
          <li>Prices are listed in USD unless otherwise stated</li>
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "4. Shipping & Delivery",
      content: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Shipping times are estimates and may vary due to external factors</li>
          <li>We are not responsible for delays caused by carriers or customs</li>
          <li>Customers are responsible for providing accurate shipping details</li>
        </ul>
      ),
    },
    {
      id: "returns",
      title: "5. Returns & Refunds",
      content: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Returns may be accepted within [X days] of delivery</li>
          <li>Products must be unused and in original packaging</li>
          <li>Certain items (such as consumables) may not be eligible for return</li>
          <li>Refunds will be processed after inspection</li>
        </ul>
      ),
    },
    {
      id: "ip",
      title: "6. Intellectual Property",
      content:
        "All content on Mamoojan.com, including logos, text, images, and branding, is the property of Mamoojan.com Inc. and may not be used without permission.",
    },
    {
      id: "liability",
      title: "7. Limitation of Liability",
      content: (
        <>
          <p>Mamoojan.com shall not be liable for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Misuse of products</li>
            <li>Health-related outcomes resulting from product use</li>
          </ul>
          <p className="mt-2">Use products at your own discretion.</p>
        </>
      ),
    },
    {
      id: "third-party-links",
      title: "8. Third-Party Links",
      content:
        "Our website may include links to third-party websites. We are not responsible for their content, policies, or practices.",
    },
    {
      id: "changes",
      title: "9. Changes to Terms",
      content:
        "We may update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the updated terms.",
    },
    {
      id: "governing-law",
      title: "10. Governing Law",
      content: "These Terms are governed by the laws of the State of New York, United States.",
    },
    {
      id: "contact",
      title: "11. Contact Us",
      content: (
        <div>
          <p>Mamoojan.com Inc.</p>
          <p>West Hempstead, NY, USA</p>
          <p>
            Email:{" "}
            <a href="mailto:mamoojanus@gmail.com" className="text-primary hover:underline">
              mamoojanus@gmail.com
            </a>
          </p>
          <p>Phone: (212) 321-0291</p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-b from-stone-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Terms & Conditions</span>
        </nav>

        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-primary mb-3">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Legal Information</span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 38px)",
            }}
          >
            Terms & Conditions
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Effective Date: [Insert Date]</p>
          <p className="text-muted-foreground mt-4">
            Welcome to Mamoojan.com. By accessing or using our website, you agree to be bound by the
            following Terms & Conditions. If you do not agree, please do not use our services.
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Quick Links</p>
              <div className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="rounded-xl border border-border bg-white p-5 md:p-6 shadow-sm">
                <h2 className="text-foreground text-lg font-semibold mb-2">{section.title}</h2>
                <div className="text-sm leading-7 text-muted-foreground">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
