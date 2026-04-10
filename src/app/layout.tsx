import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "./components/Layout";
import { QueryProvider } from "./providers/QueryProvider";

export const metadata: Metadata = {
  title: "MamooJan – Connecting Families Around The World",
  description:
    "Traditional products, herbal supplements, authentic snacks, and everyday essentials.",
  icons: [
    {
      rel: "icon",
      url: "/fav-black.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/fav-white.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
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
