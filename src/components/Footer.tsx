"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-serif tracking-widest">QSM</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We never cut corners when it comes to the quality, integrity, and purity of our cosmetics. Over thousands of happy customers trust us daily for reliable results and honest, skin-loving formulas. We back every single product with an uncompromising commitment to your 100% satisfaction
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              <br />
              <br />
              Address: Basement Saleem Center Civil Line Road Near Stylo Shoes Jhelum, Punjab, Pakistan
            </p>
          </div>

          {/* Shop categories */}
          <div className="space-y-3 md:justify-self-center">
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
          <div className="space-y-4 md:justify-self-end">
            <h4 className="text-white text-sm font-medium tracking-wider uppercase md:text-right">GET IN TOUCH</h4>
            <ul className="flex flex-col gap-3 text-sm md:text-right">
              <li className="sr-only">
                <a href="https://wa.me/923178517190" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  +923178517190
                </a>
              </li>
            </ul>
            <div className="flex items-center justify-end gap-4 pt-1">
              <a href="https://wa.me/923178517190" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#25D366] transition-colors duration-200" aria-label="WhatsApp">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/p/QASIM-Shopping-MALL-100047933815996/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#1877F2] transition-colors duration-200" aria-label="Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@qasim.shopping.ma" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FE2C55] transition-colors duration-200" aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.27 8.27 0 004.76 1.5V6.76a4.83 4.83 0 01-1-.07z"/>
                </svg>
              </a>
            </div>
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
