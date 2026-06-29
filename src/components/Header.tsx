"use client";

import SearchBar from "./SearchBar";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Search } from "lucide-react";
import Sidebar from "./Sidebar";
import { type Category } from "@/lib/data";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const [p, qs] = href.split("?");
    if (pathname !== p) return false;
    if (qs) {
      const params = new URLSearchParams(qs);
      const keys = Array.from(params.keys());
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (searchParams.get(key) !== params.get(key)) return false;
      }
      return true;
    }
    if (href === "/shop") {
      return !searchParams.get("isNewArrival") && !searchParams.get("isBestSeller");
    }
    return true;
  };

  const linkClass = (href: string) => {
    const active = isActive(href);
    return `text-xs font-normal tracking-wider uppercase px-4 py-2.5 rounded-full transition-all duration-200 ${
      active
        ? "bg-[#111111] text-white shadow-sm hover:bg-[#2a2a2a]"
        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
    }`;
  };

  return (
    <nav className="hidden md:flex items-center gap-4 whitespace-nowrap flex-1 justify-center ml-8">
      <Link href="/" className={linkClass("/")}>Home</Link>
      <Link href="/shop?isNewArrival=true" className={linkClass("/shop?isNewArrival=true")}>New Arrival</Link>
      <Link href="/shop?isBestSeller=true" className={linkClass("/shop?isBestSeller=true")}>Best Seller</Link>
      <Link href="/shop" className={linkClass("/shop")}>Categories</Link>
      <Link href="/shop-by-brand" className={linkClass("/shop-by-brand")}>Shop by Brand</Link>
    </nav>
  );
}



export default function Header({ categories }: { categories: Category[] }) {
  const { setIsCartOpen, cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
      />

      <header className="relative z-[100] bg-white/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── MOBILE LAYOUT ── */}
          <div className="relative z-[100] flex flex-col md:hidden py-3 gap-2">
            <div className="flex items-center justify-between relative">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="icon-btn p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="1" x2="19" y2="1" />
                  <line x1="1" y1="7" x2="19" y2="7" />
                  <line x1="1" y1="13" x2="19" y2="13" />
                </svg>
              </button>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
  <img
    src="/logo.png"
    alt="Logo"
    className="h-12 w-auto object-contain"
  />
</Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="icon-btn relative p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
                aria-label="Open Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span key={cartCount} className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pop">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="relative z-[100] hidden md:flex items-center justify-between h-32">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-none min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="icon-btn p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="1" y1="1" x2="19" y2="1" />
                  <line x1="1" y1="7" x2="19" y2="7" />
                  <line x1="1" y1="13" x2="19" y2="13" />
                </svg>
              </button>
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>

            <div className="flex flex-1 justify-center">
              <Suspense fallback={null}>
                <NavLinks />
              </Suspense>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="icon-btn relative p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
              aria-label="Open Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span key={cartCount} className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pop">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}