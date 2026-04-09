import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

export function PrivacyPolicyPage() {
  const sections = [
    {
      id: "information-we-collect",
      title: "1. Information We Collect",
      content: (
        <>
          <p>We may collect the following information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Personal details (name, email, phone number, address)</li>
            <li>Payment information (processed securely via third-party providers)</li>
            <li>Order history and preferences</li>
            <li>Website usage data (cookies, IP address, browser type)</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      title: "2. How We Use Your Information",
      content: (
        <>
          <p>Your information is used to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Process and fulfill orders</li>
            <li>Provide customer support</li>
            <li>Improve our products and services</li>
            <li>Send updates, promotions, or order notifications</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "3. Sharing of Information",
      content: (
        <>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Payment processors</li>
            <li>Shipping and logistics partners</li>
            <li>Service providers assisting in website operations</li>
          </ul>
          <p className="mt-2">All partners are required to protect your information.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking",
      content: (
        <>
          <p>We use cookies to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Enhance website performance</li>
            <li>Understand user behavior</li>
            <li>Improve user experience</li>
          </ul>
          <p className="mt-2">You can disable cookies in your browser settings.</p>
        </>
      ),
    },
    {
      id: "data-security",
      title: "5. Data Security",
      content:
        "We implement reasonable security measures to protect your information. However, no system is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      id: "your-rights",
      title: "6. Your Rights",
      content: (
        <>
          <p>You may:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Request access to your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at{" "}
            <a href="mailto:mamoojanus@gmail.com" className="text-primary hover:underline">
              mamoojanus@gmail.com
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "third-party-services",
      title: "7. Third-Party Services",
      content:
        "Our website may use third-party tools (such as payment gateways or analytics). These services have their own privacy policies.",
    },
    {
      id: "childrens-privacy",
      title: "8. Children's Privacy",
      content:
        "Mamoojan.com is not intended for individuals under 13. We do not knowingly collect data from children.",
    },
    {
      id: "changes",
      title: "9. Changes to This Policy",
      content:
        "We may update this Privacy Policy periodically. Changes will be posted on this page with a new effective date.",
    },
    {
      id: "contact",
      title: "10. Contact Information",
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
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <div className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-primary mb-3">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Mamoojan.com</span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 38px)",
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Effective Date: [Insert Date]</p>
          <p className="text-muted-foreground mt-4">
            Mamoojan.com respects your privacy and is committed to protecting your personal information.
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
