"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search } from "lucide-react";
import Sidebar from "./Sidebar";

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
      return !searchParams.get('isNewArrival') && !searchParams.get('isBestSeller');
    }

    return true;
  };

  const linkClass = (href: string) => {
    const active = isActive(href);
    return `text-xs font-normal tracking-wider uppercase px-4 py-2.5 rounded-full transition-all duration-200 ${
      active
        ? "bg-customPurple text-white shadow-sm"
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

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = query ? `/shop?search=${encodeURIComponent(query)}` : '/';
    router.push(url);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full sm:w-96 pl-10 pr-4 py-3.5 sm:py-3 bg-white sm:bg-neutral-50 border border-transparent rounded-full text-sm font-light text-neutral-900 placeholder-neutral-500 placeholder:font-light shadow-[0_1px_2px_0_rgba(60,64,67,0.12),0_2px_10px_2px_rgba(60,64,67,0.10)] focus:outline-none focus:border-transparent focus:bg-white hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15),0_4px_14px_3px_rgba(60,64,67,0.12)] focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.15),0_4px_14px_3px_rgba(60,64,67,0.12),0_0_0_4px_rgba(255,56,92,0.15)] transition-shadow duration-200"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-900" />
    </form>
  );
}

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="bg-white/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── MOBILE LAYOUT ── */}
          <div className="flex flex-col md:hidden py-3 gap-2">
            {/* Row 1: Hamburger | Logo | Cart */}
            <div className="flex items-center justify-between">
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

              {/* Logo center — increase h-14 to h-16/h-20 if you want it even bigger */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={820}
                  height={288}
                  className="h-72 w-auto object-contain"
                  priority
                />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="icon-btn relative p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
                aria-label="Open Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pop"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Row 2: Search bar full width */}
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>

          {/* ── DESKTOP LAYOUT (untouched) ── */}
          <div className="hidden md:flex items-center justify-between h-32">
            {/* Left: Menu + Search */}
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

            {/* Nav Links */}
            <div className="flex flex-1 justify-center">
              <Suspense fallback={null}>
                <NavLinks />
              </Suspense>
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="icon-btn relative p-2 rounded-full text-neutral-900 hover:text-neutral-950 hover:bg-neutral-100 transition-all duration-200 shrink-0"
              aria-label="Open Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pop"
                >
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