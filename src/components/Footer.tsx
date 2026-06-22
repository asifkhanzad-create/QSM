"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-serif tracking-widest">QSM</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Qasim Shopping Mall: Exquisite cosmetic products for your natural beauty.
            </p>
          </div>

          {/* Shop categories */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-medium tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lipsticks" className="hover:text-white transition">
                  Lipsticks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=face-washes" className="hover:text-white transition">
                  Face Washes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=face-serums" className="hover:text-white transition">
                  Face Serums
                </Link>
              </li>
              <li>
                <Link href="/shop?category=moisturizers" className="hover:text-white transition">
                  Moisturizers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hair-products" className="hover:text-white transition">
                  Hair Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=nail-polishes" className="hover:text-white transition">
                  Nail Polishes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=eye-cosmetics" className="hover:text-white transition">
                  Eye Cosmetics
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-medium tracking-wider uppercase">Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition cursor-pointer">About Us</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Shipping & Returns</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Ingredients Policy</span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">Contact Support</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-medium tracking-wider uppercase">Stay Connected</h4>
            <p className="text-sm text-neutral-400">
              Subscribe to get special offers, beauty tips, and product arrivals.
            </p>
            <form className="flex max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm bg-neutral-800 text-white placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:border-brand-500 rounded-l"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-customPurple to-customPink hover:from-customPurple-hover hover:to-customPink-hover text-white text-sm px-4 py-2 font-medium transition border border-customPink rounded-full"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Qasim Shopping Mall (QSM). All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
