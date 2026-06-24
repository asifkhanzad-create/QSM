import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductPageContent from "@/components/ProductPageContent";
import { getProductBySlug, getRelatedProducts } from "@/sanity/client";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // Revalidate every minute

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  const relatedProducts = product
    ? await getRelatedProducts(product.slug, product.category)
    : [];

  if (!product) {
    return (
      <>
        <Header />
        <CartDrawer />
        <main className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4 bg-stone-50">
          <h2 className="text-2xl font-light font-serif text-neutral-900">Product Not Found</h2>
          <p className="text-neutral-500 mt-2 text-sm max-w-md">
            We couldn't find the product you're looking for. It may have been discontinued or moved.
          </p>
          <Link
            href="/shop"
            className="mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium transition"
          >
            Back to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1 bg-stone-50/50">
        <ProductPageContent product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
