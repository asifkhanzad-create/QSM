import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ShopPageContent from "@/components/ShopPageContent";
import { getCategories, getProducts } from "@/sanity/client";

interface PageProps {
  searchParams: {
    category?: string;
  };
}

export const revalidate = 60; // Revalidate every minute

export default async function ShopPage({ searchParams }: PageProps) {
  const categories = await getCategories();
  const products = await getProducts();
  const initialCategory = searchParams.category || "";

  return (
    <>
    
    <CartDrawer />
      <main className="flex-1 bg-stone-50/50">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-neutral-500 font-light">Loading catalog...</div>}>
          <ShopPageContent
            initialProducts={products}
            categories={categories}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
