import React from "react";
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
      <Header />
      <CartDrawer />
      <main className="flex-1 bg-stone-50/50">
        <ShopPageContent
          initialProducts={products}
          categories={categories}
          initialCategory={initialCategory}
        />
      </main>
      <Footer />
    </>
  );
}
