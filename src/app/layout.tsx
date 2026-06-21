import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qasim Shopping Mall (QSM) - Premium Cosmetics & Beauty",
  description: "Qasim Shopping Mall: Exquisite cosmetic products for your natural beauty.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased text-neutral-800 bg-neutral-50 min-h-screen flex flex-col ${outfit.variable}`}>
        <CartProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  );
}
