"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, User } from "lucide-react";

export default function Header() {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-500 hover:text-neutral-800 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Navigation links */}
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <Link href="/" className="hover:text-neutral-900 transition">
              Home
            </Link>
            <Link href="/shop" className="hover:text-neutral-900 transition">
              Shop
            </Link>
            <Link href="/shop?category=lipsticks" className="hover:text-neutral-900 transition">
              Lipsticks
            </Link>
            <Link href="/shop?category=face-washes" className="hover:text-neutral-900 transition">
              Face Washes
            </Link>
            <Link href="/shop?category=face-serums" className="hover:text-neutral-900 transition">
              Face Serums
            </Link>
            <Link href="/shop?category=moisturizers" className="hover:text-neutral-900 transition">
              Moisturizers
            </Link>
            <Link href="/shop?category=hair-products" className="hover:text-neutral-900 transition">
              Hair Products
            </Link>
            <Link href="/shop?category=nail-polishes" className="hover:text-neutral-900 transition">
              Nail Polishes
            </Link>
            <Link href="/shop?category=eye-cosmetics" className="hover:text-neutral-900 transition">
              Eye Cosmetics
            </Link>
          </nav>

          {/* Center: Brand Logo */}
          <div className="flex-1 sm:flex-initial text-center sm:text-left">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl sm:text-3xl font-light tracking-[0.25em] text-neutral-950 font-serif">
                QSM
              </h1>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Shop All Products
          </Link>
          <Link
            href="/shop?category=lipsticks"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Lipsticks
          </Link>
          <Link
            href="/shop?category=face-washes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Face Washes
          </Link>
          <Link
            href="/shop?category=face-serums"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Face Serums
          </Link>
          <Link
            href="/shop?category=moisturizers"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Moisturizers
          </Link>
          <Link
            href="/shop?category=hair-products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Hair Products
          </Link>
          <Link
            href="/shop?category=nail-polishes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2 border-b border-neutral-50"
          >
            Nail Polishes
          </Link>
          <Link
            href="/shop?category=eye-cosmetics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-2"
          >
            Eye Cosmetics
          </Link>
        </div>
      )}
    </header>
  );
}
