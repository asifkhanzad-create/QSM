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
          <div className="flex items-center justify-center px-6 -mt-2">
            <Image
              src="/logo.png"
              alt="QSM Logo"
              width={200}
              height={70}
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>

          <nav className="flex-1 overflow-y-auto px-4 -mt-1 space-y-2 stagger-fade-in">
            <Link
              href="/"
              onClick={handleCategoryClick}
              className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/shop-by-brand"
              onClick={handleCategoryClick}
              className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
            >
              Shop by Brand
            </Link>
            <Link
              href="/shop"
              onClick={handleCategoryClick}
              className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
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
                  className="btn-press block px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors rounded-lg"
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