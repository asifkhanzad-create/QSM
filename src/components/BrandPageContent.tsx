"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { type Product, type Brand } from "@/lib/data";
import { Star, ArrowUpDown } from "lucide-react";

interface BrandPageContentProps {
  initialProducts: Product[];
  brands: Brand[];
}

export default function BrandPageContent({
  initialProducts,
  brands,
}: BrandPageContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  const brandParam = searchParams.get("brand");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (brandParam) {
      result = result.filter(
        (p) => p.brand && p.brand.toLowerCase() === brandParam.toLowerCase()
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [initialProducts, searchQuery, brandParam, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, brandParam, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-10 animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
          Shop by Brand
        </h2>
        <p className="text-sm sm:text-sm text-neutral-500 mt-2 font-light">
          Browse products from your favourite brands. Quality you trust, beauty you love.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 sm:pb-8 border-b border-neutral-100 mb-6 sm:mb-8">

        {/* Brand Filter — horizontal scroll on mobile, wrap on desktop */}
        <div className="flex overflow-x-auto md:flex-wrap gap-2 w-full md:w-auto py-2 md:py-1 scrollbar-hide px-1">

          {/* All Brands pill */}
          <Link
            href="/shop-by-brand"
            className={`btn-pill shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider uppercase border transition-all duration-200 focus:outline-none shadow-none ${
              !brandParam
                ? "bg-[#FF385C] text-white border-transparent"
                : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200"
            }`}
          >
            All Brands
          </Link>

          {/* Brand pills — show logo if available, fallback to name */}
          {brands.map((brand) => {
            const isActive = brandParam?.toLowerCase() === brand.slug.toLowerCase();
            return (
              <Link
                key={brand._id}
                href={`/shop-by-brand?brand=${brand.slug}`}
                className={`btn-pill shrink-0 flex items-center gap-2 rounded-full border transition-all duration-200 focus:outline-none shadow-none ${
                  brand.logo ? "px-3 py-2" : "px-5 py-2.5"
                } ${
                  isActive
                    ? "bg-[#FF385C] text-white border-transparent"
                    : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200"
                }`}
              >
                {brand.logo ? (
                  <>
                    <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 ${isActive ? "bg-white/20" : "bg-neutral-100"}`}>
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={28}
                        height={28}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      {brand.name}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold tracking-wider uppercase">
                    {brand.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-200 text-xs rounded-full px-4 sm:px-3 py-2 sm:py-1.5 font-medium text-neutral-700 focus:outline-none focus:border-brand-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-24 bg-white rounded-2xl border border-neutral-100 shadow-sm animate-scale-in">
          <p className="text-sm sm:text-base text-neutral-600">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : "No products found for this brand."}
          </p>
          <button
            onClick={() => {
              router.push("/shop-by-brand", { scroll: false });
              setSortBy("featured");
            }}
            className="btn-pill mt-4 px-5 sm:px-6 py-2 bg-[#FF385C] hover:bg-[#FF385C]/90 text-white text-xs sm:text-sm border border-transparent focus:outline-none"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {paginatedProducts.map((product, index) => (
              <div
                key={product._id}
                className="group relative flex flex-col bg-white rounded-[2rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="w-full h-[220px] sm:h-[380px] bg-neutral-100 overflow-hidden relative block transition-transform duration-300 group-hover:shadow-md"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {product.originalPrice && (
                    <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-brand-600 text-white text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 uppercase tracking-wider rounded-full">
                      Sale
                    </span>
                  )}
                  {product.shades && product.shades.length > 0 && (
                    <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm border border-neutral-100">
                      {product.shades.length} Shades
                    </span>
                  )}
                </Link>
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-800">{product.rating}</span>
                      <span className="text-[10px] sm:text-xs text-neutral-400">({product.reviewsCount})</span>
                    </div>
                    <h3 className="text-xs sm:text-base font-normal tracking-wide text-neutral-900 group-hover:text-brand-600 transition">
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>
                  <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-base font-semibold text-neutral-950">Rs. {product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-sm text-neutral-400 line-through">
                        Rs. {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-neutral-200 rounded-lg text-xs sm:text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-neutral-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-neutral-200 rounded-lg text-xs sm:text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}