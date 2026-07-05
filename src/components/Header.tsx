"use client";

import SearchBar from "./SearchBar";
import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Home, Sparkles, Flame, LayoutGrid, Tag, ShoppingBag } from "lucide-react";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import Sidebar from "./Sidebar";
import { type Category } from "@/lib/data";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop?isNewArrival=true", label: "New Arrival", icon: Sparkles },
  { href: "/shop?isBestSeller=true", label: "Best Seller", icon: Flame },
  { href: "/shop", label: "Categories", icon: LayoutGrid },
  { href: "/shop-by-brand", label: "Shop by Brand", icon: Tag },
];

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

  return (
    <nav className="flex items-center gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-medium tracking-wide uppercase transition-all duration-200 ${
              active
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            <span>{label}</span>
          </Link>
        );
      })}
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

      {/* ── MOBILE HEADER (UNCHANGED - your original code) ── */}
      <header className="relative z-[100] bg-white/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)] md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-[100] flex flex-col py-3 gap-2">
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
        </div>
      </header>

      {/* ── DESKTOP BIG PILL HEADER ── */}
      <header className="hidden md:block relative z-[100] py-4 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-neutral-100/80">

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 shrink-0"
              aria-label="Open Menu"
            >
              <DotsSixVerticalIcon className="w-6 h-6" weight="bold" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-neutral-100" />

            {/* Left: Search */}
            <div className="flex-shrink-0 w-72 lg:w-80 xl:w-96">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-neutral-100" />

            {/* Center: Nav */}
            <div className="flex-1 flex justify-center">
              <Suspense fallback={null}>
                <NavLinks />
              </Suspense>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-neutral-100" />

            {/* Right: Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-white text-neutral-900 shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-neutral-100 flex items-center justify-center hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] active:scale-95 transition-all duration-150 flex-shrink-0"
              aria-label="Open Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pop">
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