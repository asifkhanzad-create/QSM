"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type Product, type Category } from "@/lib/data";
import { Star, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ShopPageContentProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ShopPageContent({
  initialProducts,
  categories,
}: ShopPageContentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Get current filters from URL
  const categoryParam = searchParams.get('category');
  const isNewArrivalParam = searchParams.get('isNewArrival');
  const isBestSellerParam = searchParams.get('isBestSeller');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Search Query — when active, search ALL products, ignore other filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (categoryParam) {
      result = result.filter(
        (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    // Filter by New Arrival
    if (isNewArrivalParam === 'true') {
      result = result.filter((p) => p.isNewArrival === true);
    }

    // Filter by Best Seller
    if (isBestSellerParam === 'true') {
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
  }, [initialProducts, searchQuery, categoryParam, isNewArrivalParam, isBestSellerParam, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
          Beauty Catalog
        </h2>
        <p className="text-sm text-neutral-500 mt-2 font-light">
          Find the perfect products for your unique beauty routine. Organic formulations, premium pigments.
        </p>
      </div>

      {/* Control Bar (Search, Category Filter Tabs, Sorting) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-8 border-b border-neutral-100 mb-8">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:border-brand-500"
          />
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-neutral-400" />
        </div>

        {/* Categories Fast Filter */}
        <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
          <Link
            href="/shop"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition border-2 ${
              !searchParams.get('category')
                ? "bg-neutral-950 text-white border-neutral-950"
                : "bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-900 border-neutral-200"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition border-2 ${
                searchParams.get('category')?.toLowerCase() === cat.slug.toLowerCase()
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-900 border-neutral-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-neutral-200 text-xs rounded px-3 py-1.5 font-medium text-neutral-700 focus:outline-none focus:border-brand-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-lg border border-neutral-100 shadow-sm">
          <p className="text-base text-neutral-600">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSortBy("featured");
            }}
            className="mt-4 px-6 py-2 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 text-sm font-medium transition border-2 border-neutral-950 rounded-full"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group relative flex flex-col">
              {/* Product Card Image Container */}
              <Link
                href={`/product/${product.slug}`}
                className="w-full h-[380px] bg-neutral-100 rounded-md overflow-hidden relative block"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                
                {/* Sale Tag */}
                {product.originalPrice && (
                  <span className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider rounded-sm">
                    Sale
                  </span>
                )}

                {/* Number of Shades Badge */}
                {product.shades && product.shades.length > 0 && (
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm border border-neutral-100">
                    {product.shades.length} Shades
                  </span>
                )}
              </Link>

              {/* Card Details */}
              <div className="mt-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
                    <span className="text-xs text-neutral-400">({product.reviewsCount})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-medium text-neutral-900 group-hover:text-brand-600 transition">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                </div>

                {/* Price Display */}
                <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-neutral-950">Rs. {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through">
                    Rs. {product.originalPrice.toFixed(2)}
                  </span>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
