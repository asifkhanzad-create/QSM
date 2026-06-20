import type { Metadata } from "next";
// 1. Fixed the import name to include the underscore
import { Bebas_Neue } from "next/font/google"; 
import "./globals.css";

// 2. Added the required 'weight' property
const bebasNeue = Bebas_Neue({
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-bebas-neue",
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
      <body className={`antialiased text-neutral-800 bg-neutral-50 min-h-screen flex flex-col ${bebasNeue.variable}`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
