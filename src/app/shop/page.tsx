import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ShopPageContent from "@/components/ShopPageContent";
import { getCategories, getProducts } from "@/sanity/client";

interface PageProps {
  searchParams: {
    category?: string;
    brand?: string;
    subcategory?: string;
  };
}

export const revalidate = 60;

export default async function ShopPage({ searchParams }: PageProps) {
  const categories = await getCategories();

  // Extract filters from URL
  const category = searchParams.category || undefined;
  const brand = searchParams.brand || undefined;
  const subcategory = searchParams.subcategory || undefined;

  // Fetch filtered products server-side (includes subcategory now)
  const products = await getProducts(category, brand, subcategory);

  return (
    <>
      
      <CartDrawer />
      <main className="flex-1 bg-stone-50/50">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-neutral-500 font-light">
              Loading catalog...
            </div>
          }
        >
          <ShopPageContent
            initialProducts={products}
            categories={categories}
            initialCategory={category || ""}
            initialSubcategory={subcategory || ""}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}