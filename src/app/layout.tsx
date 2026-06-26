import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { getCategories } from "@/sanity/client";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qasim Shopping Mall (QSM) - Premium Cosmetics & Beauty",
  description: "Qasim Shopping Mall: Exquisite cosmetic products for your natural beauty.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className={`font-sans antialiased text-neutral-800 bg-neutral-50 min-h-screen flex flex-col pb-14 md:pb-0 ${outfit.variable}`}>
        <CartProvider>
          <Header categories={categories} />
          <PageTransition>
            {children}
          </PageTransition>
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}