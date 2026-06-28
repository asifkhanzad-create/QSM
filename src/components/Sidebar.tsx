"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAnimatedPresence } from "@/hooks/useAnimatedPresence";
import { type Category } from "@/lib/data";

export default function Sidebar({
  isOpen,
  onClose,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}) {
  const { mounted, visible } = useAnimatedPresence(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 icon-btn p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center px-6 py-4 border-b border-neutral-200">
  <Link href="/" onClick={onClose}>
  <img
    src="/logo.png"
    alt="QSM Logo"
    className="h-12 w-auto object-contain"
  />
  </Link>
</div>

<nav className="flex-1 overflow-y-auto px-4 pt-6 space-y-3">
  <Link
    href="/"
    onClick={handleCategoryClick}
    className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
  >
    Home
  </Link>
  <Link
    href="/shop-by-brand"
    onClick={handleCategoryClick}
    className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
  >
    Shop by Brand
  </Link>
  <Link
    href="/shop"
    onClick={handleCategoryClick}
    className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
  >
    Shop All Products
  </Link>
  {categories
    .filter((cat) => cat.slug)
    .map((cat) => (
      <Link
        key={cat._id}
        href={`/shop?category=${cat.slug}`}
        onClick={handleCategoryClick}
        className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
      >
        {cat.name}
      </Link>
    ))}
</nav>
        </div>
      </div>
    </>
  );
}