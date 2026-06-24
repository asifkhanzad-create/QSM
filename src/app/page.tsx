import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Suspense } from "react";
import ShopPageContent from "@/components/ShopPageContent";
import { getCategories, getProducts } from "@/sanity/client";
import HeroBanners from "@/components/HeroBanners";
import CategoryCards from "@/components/CategoryCards";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanners />

        {/* Mobile-only CTA buttons */}
        <div className="sm:hidden flex flex-col items-center gap-3 px-6 py-6">
          <a
            href="/shop"
            className="btn-pill w-full max-w-xs text-center py-3.5 bg-customPurple hover:bg-customPurple-hover text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop All
          </a>
          <a
            href="/shop-by-brand"
            className="btn-pill w-full max-w-xs text-center py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop by Brand
          </a>
        </div>

        {/* Category Cards */}
        <CategoryCards categories={categories} />

        {/* All Products Grid */}
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading products...</div>}>
          <ShopPageContent initialProducts={products} categories={categories} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
