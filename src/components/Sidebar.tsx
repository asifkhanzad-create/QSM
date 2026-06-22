"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAnimatedPresence } from "@/hooks/useAnimatedPresence";

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
  const { mounted, visible } = useAnimatedPresence(isOpen);

  const handleCategoryClick = () => {
    onClose();
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          "overlay-backdrop z-40",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "drawer-panel fixed left-0 top-0 z-50 bg-white w-72 h-full flex flex-col shadow-xl rounded-r-2xl",
          visible ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h1 className="text-xl font-light tracking-[0.25em] text-neutral-950 font-serif">
              QSM
            </h1>
            <button
              onClick={onClose}
              className="icon-btn p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2 stagger-fade-in">
            <Link
              href="/"
              onClick={handleCategoryClick}
              className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={handleCategoryClick}
              className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
            >
              Shop All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={handleCategoryClick}
                className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
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
