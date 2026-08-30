import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LuxuryPreloader } from "@/components/LuxuryPreloader";

export const metadata: Metadata = {
  title: "Radha Rani Bangles | Exquisite Indian Bangles & Jewelry",
  description:
    "Discover handcrafted Indian bangles — from 22K gold kadas and diamond-studded pieces to traditional Kundan sets and bridal churas. Timeless elegance, delivered to your door.",
  keywords: [
    "Indian bangles",
    "gold bangles",
    "bridal bangles",
    "kundan bangles",
    "diamond bangles",
    "silver bangles",
    "jewelry online India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground w-full max-w-full overflow-x-hidden">
        <LuxuryPreloader />
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen w-full max-w-full overflow-x-hidden">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
