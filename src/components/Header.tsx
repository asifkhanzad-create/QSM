"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    `text-xs font-medium tracking-wide uppercase transition ${
      isActive(href)
        ? "text-neutral-900"
        : "text-neutral-500 hover:text-neutral-800"
    }`;

  return (
    <nav className="hidden md:flex items-center gap-4 whitespace-nowrap flex-1 justify-center">
      <Link href="/" className={linkClass("/")}>Home</Link>
      <Link href="/shop?isNewArrival=true" className={linkClass("/shop?isNewArrival=true")}>New Arrival</Link>
      <Link href="/shop?isBestSeller=true" className={linkClass("/shop?isBestSeller=true")}>Best Seller</Link>
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
    <form onSubmit={handleSearch} className="relative flex-1 min-w-0 sm:flex-none">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full sm:w-96 pl-10 pr-4 py-3 sm:py-2.5 bg-white sm:bg-neutral-50 border border-neutral-200 rounded-full text-sm font-medium text-neutral-900 placeholder-neutral-500 shadow-sm shadow-neutral-900/5 sm:shadow-none focus:outline-none focus:ring-2 focus:ring-[#6F2DA8]/40 focus:border-[#6F2DA8] focus:bg-white hover:border-[#6F2DA8]/40 hover:shadow-[0_0_12px_rgba(111,45,168,0.15)] transition-all duration-200"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
    </form>
  );
}

function LogoSection() {
  return (
    <div className="hidden sm:flex sm:flex-1 sm:justify-center">
      <button
        onClick={() => window.location.reload()}
        className="relative w-[64px] h-[64px] sm:w-[120px] sm:h-[120px]"
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
          <div className="flex items-center justify-between h-20 sm:h-32">
            {/* Left: Menu + Search */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-none min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="icon-btn p-1.5 text-neutral-500 hover:text-neutral-800 transition-colors duration-200 shrink-0"
              >
                <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                  <rect x="1" y="1" width="20" height="3" rx="1.5" fill="currentColor" />
                  <rect x="5" y="7.5" width="12" height="3" rx="1.5" fill="currentColor" />
                  <rect x="1" y="14" width="20" height="3" rx="1.5" fill="currentColor" />
                </svg>
              </button>
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>
            </div>

            {/* Nav Links (centered between search and logo) */}
            <div className="hidden md:flex md:flex-1 md:justify-center">
              <Suspense fallback={null}>
                <NavLinks />
              </Suspense>
            </div>

            {/* Center: Logo (hidden on mobile, restored from sm breakpoint up) */}
            <div className="hidden sm:flex sm:flex-1 sm:justify-center">
              <button
                onClick={() => window.location.reload()}
                className="relative w-[64px] h-[64px] sm:w-[120px] sm:h-[120px] shrink-0"
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

            {/* Far Right: Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="icon-btn relative p-2 text-neutral-700 hover:text-neutral-950 shrink-0"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
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