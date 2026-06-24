"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Home, Search, ShoppingBag, ShoppingCart } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const getSearchInput = () =>
      document.querySelector(
        'input[placeholder="Search products..."]'
      ) as HTMLInputElement | null;

    const handleFocus = () => setIsSearchFocused(true);
    const handleBlur = () => setIsSearchFocused(false);

    const input = getSearchInput();
    input?.addEventListener("focus", handleFocus);
    input?.addEventListener("blur", handleBlur);

    return () => {
      input?.removeEventListener("focus", handleFocus);
      input?.removeEventListener("blur", handleBlur);
    };
  }, [pathname]);

  const handleSearchTap = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      const searchInput = document.querySelector(
        'input[placeholder="Search products..."]'
      ) as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus();
      }
    }, 400);
  };

  const tabs = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      isActive: pathname === "/" && !isSearchFocused,
    },
    {
      label: "Search",
      icon: Search,
      onClick: handleSearchTap,
      isActive: isSearchFocused,
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      href: "/shop",
      isActive:
        pathname === "/shop" ||
        pathname.startsWith("/shop") ||
        pathname.startsWith("/product"),
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      onClick: () => setIsCartOpen(true),
      isActive: false,
      badge: cartCount,
    },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-100 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isTabActive = tab.isActive;

          if (tab.onClick) {
            return (
              <button
                key={tab.label}
                onClick={tab.onClick}
                className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1"
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isTabActive ? "text-[#FF385C]" : "text-neutral-400"
                    }`}
                    strokeWidth={isTabActive ? 2 : 1.75}
                  />
                  {"badge" in tab && tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-[#FF385C] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-normal transition-colors duration-200 ${
                    isTabActive ? "text-[#FF385C]" : "text-neutral-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href!}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isTabActive ? "text-[#FF385C]" : "text-neutral-400"
                  }`}
                  strokeWidth={isTabActive ? 2 : 1.75}
                />
              </div>
              <span
                className={`text-[10px] font-normal transition-colors duration-200 ${
                  isTabActive ? "text-[#FF385C]" : "text-neutral-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}