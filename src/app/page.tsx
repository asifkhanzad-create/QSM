import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Suspense } from "react";
import ShopPageContent from "@/components/ShopPageContent";
import { getCategories, getProducts } from "@/sanity/client";
import HeroBanners from "@/components/HeroBanners";

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

        {/* All Products Grid */}
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading products...</div>}>
          <ShopPageContent initialProducts={products} categories={categories} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
