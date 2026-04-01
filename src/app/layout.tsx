import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "./components/Layout";
import { QueryProvider } from "./providers/QueryProvider";

export const metadata: Metadata = {
  title: "MamooJan – Connecting Families Around The World",
  description:
    "Traditional products, herbal supplements, authentic snacks, and everyday essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, sans-serif" }}>
        <QueryProvider>
          <Layout>{children}</Layout>
        </QueryProvider>
      </body>
    </html>
  );
}
