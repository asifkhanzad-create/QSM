"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string;
  categoryName?: string;
}

interface SearchCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount: number;
}

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      setCategories([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setOpen(true);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Search fetch error:", err);
      }
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = () => {
    const value = inputRef.current?.value || "";

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!value.trim()) {
      setProducts([]);
      setCategories([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    inputRef.current?.blur();
    const value = inputRef.current?.value || "";
    const url = value.trim() ? `/shop?search=${encodeURIComponent(value.trim())}` : "/";
    router.push(url);
  };

  const handleFocus = () => {
    const value = inputRef.current?.value || "";
    if ((products.length > 0 || categories.length > 0) && value.trim()) {
      setOpen(true);
    }
  };

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative w-full z-[999]">
      <input
        ref={inputRef}
        type="text"
        defaultValue=""
        onInput={handleInput}
        onFocus={handleFocus}
        placeholder="Search products..."
        enterKeyHint="search"
        className="w-full sm:w-96 pl-10 pr-4 py-3.5 sm:py-3 bg-white sm:bg-neutral-50 border border-transparent rounded-full text-sm font-light text-neutral-900 placeholder-neutral-500 placeholder:font-light shadow-[0_1px_2px_0_rgba(60,64,67,0.12),0_2px_10px_2px_rgba(60,64,67,0.10)] focus:outline-none focus:border-transparent focus:bg-white hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.15),0_4px_14px_3px_rgba(60,64,67,0.12)] focus:shadow-[0_1px_3px_0_rgba(60,64,67,0.15),0_4px_14px_3px_rgba(60,64,67,0.12),0_0_0_4px_rgba(255,56,92,0.15)] transition-shadow duration-200"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-900" />

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-100 p-4 z-50">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
            Searching...
          </div>
        </div>
      )}

      {!loading && open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden z-[999] max-h-[60vh] overflow-y-auto"
        >
          {!hasResults ? (
            <div className="p-4">
              <p className="text-sm text-neutral-500">No matching products or categories found.</p>
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Categories
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        router.push(`/shop?category=${cat.slug}`);
                        setOpen(false);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-50 transition-colors"
                    >
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-neutral-100 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{cat.name}</p>
                        <p className="text-xs text-neutral-400">{cat.productCount} products</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {categories.length > 0 && products.length > 0 && (
                <div className="border-t border-neutral-100" />
              )}

              {products.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Products
                  </div>
                  {products.map((prod) => (
                    <button
                      key={prod._id}
                      type="button"
                      onClick={() => {
                        router.push(`/product/${prod.slug}`);
                        setOpen(false);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-50 transition-colors"
                    >
                      {prod.image ? (
                        <img src={prod.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{prod.name}</p>
                        <p className="text-xs text-neutral-500">
                          Rs. {prod.price.toFixed(2)}
                          {prod.originalPrice && (
                            <span className="ml-1.5 text-neutral-300 line-through">
                              Rs. {prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
}