"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const categories = [
  { name: "Lipsticks", href: "/shop?category=lipsticks" },
  { name: "Face Washes", href: "/shop?category=face-washes" },
  { name: "Face Serums", href: "/shop?category=face-serums" },
  { name: "Moisturizers", href: "/shop?category=moisturizers" },
  { name: "Hair Products", href: "/shop?category=hair-products" },
  { name: "Nail Polishes", href: "/shop?category=nail-polishes" },
  { name: "Eye Cosmetics", href: "/shop?category=eye-cosmetics" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  React.useEffect(() => {
    setIsMobileOpen(isOpen);
  }, [isOpen]);

  const handleCategoryClick = () => {
    setIsMobileOpen(false);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {/* Mobile & Desktop Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile & Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 bg-white transform transition-transform duration-300 ease-in-out w-72 h-full flex flex-col shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h1 className="text-xl font-light tracking-[0.25em] text-neutral-950 font-serif">
              QSM
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-800 transition rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
            <Link
              href="/"
              onClick={handleCategoryClick}
              className="block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={handleCategoryClick}
              className="block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition rounded-lg"
            >
              Shop All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={handleCategoryClick}
                className="block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition rounded-lg"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}