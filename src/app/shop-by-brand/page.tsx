import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BrandPageContent from "@/components/BrandPageContent";
import { getProducts, getBrands } from "@/sanity/client";

export const revalidate = 60;

export default async function ShopByBrandPage() {
  const products = await getProducts();
  const brands = await getBrands();

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1 bg-stone-50/50">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-neutral-500 font-light">Loading brands...</div>}>
          <BrandPageContent initialProducts={products} brands={brands} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
