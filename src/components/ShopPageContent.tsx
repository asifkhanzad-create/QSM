"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { type Product, type Category } from "@/lib/data";
import { Star, ArrowUpDown, X } from "lucide-react";

interface ShopPageContentProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSubcategory?: string;
}

function getSubcategoryName(
  categories: Category[],
  categorySlug: string,
  subcategorySlug: string
): string | null {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category?.subcategories) return null;
  const sub = category.subcategories.find((s) => s.slug === subcategorySlug);
  return sub?.name || null;
}

export default function ShopPageContent({
  initialProducts,
  categories,
  initialCategory = "",
  initialSubcategory = "",
}: ShopPageContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Scroll hint on mount — mobile only
  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    if (window.innerWidth >= 768) return;

    const timer = setTimeout(() => {
      el.scrollTo({ left: 60, behavior: "smooth" });
      setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 600);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Initialize searchQuery from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    setSearchQuery(searchFromUrl);
  }, [searchParams]);

  // Get current filters from URL
  const categoryParam = searchParams.get("category") || initialCategory;
  const subcategoryParam = searchParams.get("subcategory") || initialSubcategory;
  const isNewArrivalParam = searchParams.get("isNewArrival");
  const isBestSellerParam = searchParams.get("isBestSeller");

  // Resolve subcategory name for UI
  const subcategoryName = useMemo(
    () =>
      categoryParam && subcategoryParam
        ? getSubcategoryName(categories, categoryParam, subcategoryParam)
        : null,
    [categories, categoryParam, subcategoryParam]
  );

  const isSubcategoryActive = !!subcategoryParam && !!subcategoryName;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Search Query — when active, search ALL products
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Category (client-side safety net)
    if (categoryParam) {
      result = result.filter(
        (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    // Filter by New Arrival
    if (isNewArrivalParam === "true") {
      result = result.filter((p) => p.isNewArrival === true);
    }

    // Filter by Best Seller
    if (isBestSellerParam === "true") {
      result = result.filter((p) => p.isBestSeller === true);
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    initialProducts,
    searchQuery,
    categoryParam,
    isNewArrivalParam,
    isBestSellerParam,
    sortBy,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset page to 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryParam, subcategoryParam, isNewArrivalParam, isBestSellerParam, sortBy]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const activeCategoryName = categories.find(
    (c) => c.slug.toLowerCase() === (categoryParam || "").toLowerCase()
  )?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ─── Breadcrumb & Heading ─── */}
      <div className="mb-6 sm:mb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-3">
          <Link href="/shop" className="hover:text-neutral-900 transition-colors">
            Shop
          </Link>
          {categoryParam && (
            <>
              <span className="text-neutral-300">/</span>
              <Link
                href={`/shop?category=${categoryParam}`}
                className="hover:text-neutral-900 transition-colors capitalize"
              >
                {activeCategoryName || categoryParam}
              </Link>
            </>
          )}
          {isSubcategoryActive && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-900 font-medium">{subcategoryName}</span>
            </>
          )}
        </nav>

        {/* Title + Active Filters */}
<div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between gap-3">
  <h1 className="text-2xl sm:text-3xl font-light font-serif text-neutral-950 tracking-tight">
    {isSubcategoryActive
      ? subcategoryName
      : activeCategoryName || "Beauty Catalog"}
  </h1>

  <div className="flex items-center justify-center gap-2 flex-wrap sm:justify-start">
            {/* Category Filter Tag */}
            {categoryParam && !isSubcategoryActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
                {activeCategoryName}
                <Link
                  href="/shop"
                  className="hover:text-neutral-900 p-0.5 rounded-full hover:bg-neutral-200 transition-colors"
                  aria-label="Clear category filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {/* Subcategory Filter Tag */}
            {isSubcategoryActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-full text-xs font-medium">
                {subcategoryName}
                <Link
                  href={`/shop?category=${categoryParam}`}
                  className="hover:bg-neutral-700 p-0.5 rounded-full transition-colors"
                  aria-label="Clear subcategory filter"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}

            {/* Search Tag */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("search");
                    router.push(`?${params.toString()}`, { scroll: false });
                    setSearchQuery("");
                  }}
                  className="hover:text-brand-900 p-0.5 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar (Search, Category Filter Tabs, Sorting) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 sm:pb-8 border-b border-neutral-100 mb-6 sm:mb-8">
        {/* Categories Fast Filter */}
        <div className="relative w-full md:w-auto">
          <div
            ref={categoryScrollRef}
            className="flex flex-nowrap gap-2 sm:gap-2 overflow-x-auto md:flex-wrap scrollbar-hide px-4 sm:px-4 md:px-4 py-2 md:py-1"
          >
            <Link
              href="/shop"
              className={`btn-pill shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs !font-normal tracking-wider uppercase border transition-all duration-200 focus:outline-none shadow-none ${
                !searchParams.get("category")
                  ? "btn-gradient"
                  : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200"
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className={`btn-pill shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-xs !font-normal tracking-wider uppercase border transition-all duration-200 focus:outline-none shadow-none ${
                  searchParams.get("category")?.toLowerCase() === cat.slug.toLowerCase()
                    ? "btn-gradient"
                    : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 border-neutral-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          {/* Right fade gradient — mobile only */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-r from-transparent to-white md:hidden" />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs sm:text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-200 text-xs sm:text-xs rounded-full px-4 sm:px-3 py-2 sm:py-1.5 font-medium text-neutral-700 focus:outline-none focus:border-brand-500"
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
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white rounded-2xl border border-neutral-100 shadow-sm animate-scale-in text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-5">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-lg font-medium text-neutral-900 mb-2">
            {isSubcategoryActive
              ? `No products in ${subcategoryName} yet`
              : searchQuery
              ? `No products found matching "${searchQuery}"`
              : "No products found matching your criteria"}
          </h2>
          <p className="text-sm text-neutral-500 mb-6 max-w-sm">
            {isSubcategoryActive
              ? `We're adding products to ${subcategoryName} soon. Browse all ${activeCategoryName} products instead.`
              : searchQuery
              ? "Try a different search term or browse our categories."
              : "Try adjusting your filters or check back later."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isSubcategoryActive && (
              <Link
                href={`/shop?category=${categoryParam}`}
                className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                View all {activeCategoryName}
              </Link>
            )}
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("category");
                params.delete("subcategory");
                params.delete("isNewArrival");
                params.delete("isBestSeller");
                params.delete("search");
                router.push(`?${params.toString()}`, { scroll: false });
                setSearchQuery("");
                setSortBy("featured");
              }}
              className="btn-pill bg-[#111111] text-white hover:bg-[#2a2a2a] px-5 sm:px-6 py-2 text-xs sm:text-sm focus:outline-none"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {paginatedProducts.map((product, index) => (
              <div
                key={product._id}
                className="group relative flex flex-col bg-white rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                {/* Product Card Image Container */}
                <Link
                  href={`/product/${product.slug}`}
                  className="w-full h-[220px] sm:h-[380px] bg-neutral-100 overflow-hidden relative block transition-transform duration-300 group-hover:shadow-md"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Sale Tag */}
                  {product.originalPrice && (
                    <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 uppercase tracking-wider rounded-full">
                      Sale
                    </span>
                  )}

                  {product.isBestSeller && (
                    <span className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#111111] text-white text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 uppercase tracking-wider rounded-full">
                      Best Seller
                    </span>
                  )}

                  {/* Number of Shades Badge */}
                  {product.shades && product.shades.length > 0 && (
                    <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm border border-neutral-100">
                      {product.shades.length} Shades
                    </span>
                  )}
                </Link>

                {/* Card Details */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-800">
                        {product.rating}
                      </span>
                      <span className="text-[10px] sm:text-xs text-neutral-400">
                        ({product.reviewsCount})
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-base font-normal tracking-wide text-neutral-900 group-hover:text-brand-600 transition">
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                  </div>

                  {/* Price Display */}
                  <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-base font-semibold text-neutral-950">
                      Rs. {product.price.toFixed(2)}
                    </span>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-100">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-[#111111] hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200"
              >
                Previous
              </button>
              <span className="text-xs sm:text-sm text-neutral-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-[#111111] hover:bg-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200"
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