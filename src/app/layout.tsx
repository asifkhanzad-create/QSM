import type { Metadata } from "next";
import { Oswald, Poppins } from "next/font/google"; 
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
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
      <body className={`antialiased text-neutral-800 bg-neutral-50 min-h-screen flex flex-col ${poppins.variable} ${oswald.variable}`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
