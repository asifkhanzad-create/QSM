import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Suspense } from "react";
import ShopPageContent from "@/components/ShopPageContent";
import { getCategories, getProducts } from "@/sanity/client";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

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
        <section className="relative h-[85vh] bg-stone-100 flex items-center overflow-hidden mt-6">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1600"
              alt="Premium Cosmetics Collection"
              className="w-full h-full object-cover object-center opacity-90"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl text-white space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs tracking-wider uppercase font-medium text-accentGold-200">
                <Sparkles className="w-3.5 h-3.5 text-accentGold-300" /> QSM - Quality, Style, Modernity
              </span>
              <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight font-serif">
                Elevate Your <br />
                <span className="font-normal italic">Beauty Experience</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                Discover premium cosmetics crafted with care and elegance. QSM brings you the best in beauty with quality you can trust.
              </p>
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-stone-900 font-medium hover:bg-brand-100 transition rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
                >
                  Explore the Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* All Products Grid */}
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading products...</div>}>
          <ShopPageContent initialProducts={products} categories={categories} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
