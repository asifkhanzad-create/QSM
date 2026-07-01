"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const width = getScrollbarWidth();
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${width}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      setExpandedId(null);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleCategoryClick = () => onClose();

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!mounted) return null;

  const topLinks = [
    { href: "/", label: "Home" },
    { href: "/shop-by-brand", label: "Shop by Brand" },
    { href: "/shop", label: "Shop All Products" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm",
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
          "fixed left-0 top-0 z-[1001] bg-white w-72 h-full flex flex-col shadow-2xl rounded-r-2xl",
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
            {/* Top links */}
            {topLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleCategoryClick}
                className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Categories */}
            {categories
              .filter((cat) => cat.slug)
              .map((cat) => {
                const hasSubs =
                  cat.subcategories && cat.subcategories.length > 0;
                const isExpanded = expandedId === cat._id;

                return (
                  <div key={cat._id}>
                    {hasSubs ? (
                      <>
                        {/* Accordion Header — FIX: text-left added, base styling matches Link exactly */}
                        <button
                          onClick={(e) => toggleExpand(e, cat._id)}
                          className={cn(
                            "w-full flex items-center justify-between px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 transition-all duration-200 text-left",
                            "hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900",
                            isExpanded &&
                              "border-neutral-400 bg-neutral-50 text-neutral-900"
                          )}
                        >
                          <span className="font-normal">{cat.name}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform duration-500 shrink-0 ml-2",
                              isExpanded && "rotate-180"
                            )}
                            style={{
                              transitionTimingFunction:
                                "cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                          />
                        </button>

                        {/* Subcategories Dropdown */}
                        <div
                          className={cn(
                            "grid will-change-[grid-template-rows]",
                            isExpanded
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          )}
                          style={{
                            transitionProperty: "grid-template-rows, opacity",
                            transitionDuration: isExpanded ? "600ms" : "400ms",
                            transitionTimingFunction: isExpanded
                              ? "cubic-bezier(0.16, 1, 0.3, 1)"
                              : "cubic-bezier(0.7, 0, 0.84, 0)",
                          }}
                        >
                          <div className="overflow-hidden pl-4 space-y-1 pt-1">
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              onClick={handleCategoryClick}
                              className={cn(
                                "block px-4 py-2.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-all duration-500",
                                isExpanded
                                  ? "translate-y-0 opacity-100"
                                  : "-translate-y-2 opacity-0"
                              )}
                              style={{
                                transitionTimingFunction:
                                  "cubic-bezier(0.16, 1, 0.3, 1)",
                                transitionDelay: isExpanded ? "80ms" : "0ms",
                              }}
                            >
                              All {cat.name}
                            </Link>
                            {cat.subcategories!.map((sub, index) => (
                              <Link
                                key={sub.slug}
                                href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                onClick={handleCategoryClick}
                                className={cn(
                                  "block px-4 py-2.5 text-sm font-normal text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-all duration-500",
                                  isExpanded
                                    ? "translate-y-0 opacity-100"
                                    : "-translate-y-2 opacity-0"
                                )}
                                style={{
                                  transitionTimingFunction:
                                    "cubic-bezier(0.16, 1, 0.3, 1)",
                                  transitionDelay: isExpanded
                                    ? `${120 + index * 60}ms`
                                    : "0ms",
                                }}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Plain Category Link (no subcategories) */
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        onClick={handleCategoryClick}
                        className="block px-5 py-3.5 text-sm font-normal text-neutral-700 rounded-full border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
                      >
                        {cat.name}
                      </Link>
                    )}
                  </div>
                );
              })}
          </nav>
        </div>
      </div>
    </>
  );
}