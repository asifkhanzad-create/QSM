"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAnimatedPresence } from "@/hooks/useAnimatedPresence";
import { type Category } from "@/lib/data";

function getScrollbarWidth() {
  return typeof window !== "undefined"
    ? window.innerWidth - document.documentElement.clientWidth
    : 0;
}

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
      const width = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${width}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleCategoryClick = () => {
    onClose();
  };

  if (!mounted) return null;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop-by-brand", label: "Shop by Brand" },
    { href: "/shop", label: "Shop All Products" },
    ...categories
      .filter((cat) => cat.slug)
      .map((cat) => ({
        href: `/shop?category=${cat.slug}`,
        label: cat.name,
      })),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
          "transition-opacity will-change-[opacity]",
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{
          transitionDuration: visible ? "900ms" : "500ms",
          transitionTimingFunction: visible
            ? "cubic-bezier(0.16, 1, 0.3, 1)"
            : "cubic-bezier(0.7, 0, 0.84, 0)",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 bg-white w-72 h-full flex flex-col shadow-2xl rounded-r-2xl",
          "transition-transform will-change-transform",
          visible ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          transitionDuration: visible ? "900ms" : "500ms",
          transitionTimingFunction: visible
            ? "cubic-bezier(0.16, 1, 0.3, 1)"
            : "cubic-bezier(0.7, 0, 0.84, 0)",
        }}
      >
        <div className="h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-full transition-colors duration-200 z-10"
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
            {navItems.map((item, index) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={handleCategoryClick}
                className={cn(
                  "block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full",
                  "border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900",
                  "transition-all duration-500 will-change-[opacity,transform]",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                )}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: visible ? `${120 + index * 60}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}