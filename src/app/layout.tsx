import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased text-neutral-800 bg-neutral-50 min-h-screen flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
