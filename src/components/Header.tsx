"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const [p, qs] = href.split("?");
    if (pathname !== p) return false;
    if (!qs) return true;
    const params = new URLSearchParams(qs);
    const keys = Array.from(params.keys());
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (searchParams.get(key) !== params.get(key)) return false;
    }
    return true;
  };

  const linkClass = (href: string) =>
    `text-xs font-semibold tracking-wider uppercase transition ${
      isActive(href)
        ? "text-neutral-900"
        : "text-neutral-500 hover:text-neutral-800"
    }`;

  return (
    <nav className="hidden md:flex items-center gap-5">
      <Link href="/" className={linkClass("/")}>Home</Link>
      <Link href="/shop?isNewArrival=true" className={linkClass("/shop?isNewArrival=true")}>New Arrival</Link>
      <Link href="/shop?isBestSeller=true" className={linkClass("/shop?isBestSeller=true")}>Best Seller</Link>
    </nav>
  );
}

function LogoSection() {
  return (
    <div className="flex-1 flex justify-center">
      <button
        onClick={() => window.location.reload()}
        className="relative w-[120px] h-[120px]"
      >
        <Image
          src="/logo.png"
          alt="Qasim Shopping Mall Logo"
          fill
          className="object-contain"
          sizes="150px"
          priority
        />
      </button>
    </div>
  );
}

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-32">
            {/* Left: Menu + Nav Buttons */}
            <div className="flex items-center gap-6 flex-1">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-neutral-500 hover:text-neutral-800 transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Suspense fallback={null}>
                <NavLinks />
              </Suspense>
            </div>

            {/* Center: Logo */}
            <LogoSection />

            {/* Right: Cart */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-700 hover:text-neutral-950 transition"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
