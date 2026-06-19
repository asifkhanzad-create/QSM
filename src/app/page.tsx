import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getCategories, getProducts } from "@/sanity/client";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Heart, Sparkles, Sprout } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] bg-stone-100 flex items-center overflow-hidden">
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

        {/* Brand Core Promises */}
        <section className="py-12 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-3">
                  <Sprout className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Ethical Sourcing</h4>
                <p className="text-xs text-neutral-500 mt-1">Responsibly harvested ingredients</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-3">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Quality Formulas</h4>
                <p className="text-xs text-neutral-500 mt-1">Premium ingredients, proven results</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Secure Shopping</h4>
                <p className="text-xs text-neutral-500 mt-1">Protected transactions, privacy assured</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Express Delivery</h4>
                <p className="text-xs text-neutral-500 mt-1">Fast & reliable shipping</p>
              </div>
            </div>
          </div>
        </section>

        {/* Shop By Category */}
        <section className="py-16 sm:py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-3xl font-light tracking-tight text-stone-950 font-serif">
                Shop by Collection
              </h2>
                <div className="w-12 h-[1px] bg-brand-500 mx-auto mt-3 mb-4" />
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Explore our carefully curated range of quality beauty products for every need.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category._id}
                  href={`/shop?category=${category.slug}`}
                  className="group relative h-80 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/20 to-transparent" />
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-xl font-medium font-serif">{category.name}</h3>
                    <p className="text-xs text-neutral-300 font-light mt-1.5 opacity-0 group-hover:opacity-100 transition duration-300 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 sm:mb-16">
              <div>
                <span className="text-xs tracking-wider uppercase text-brand-600 font-semibold">
                  Highly Requested
                </span>
                <h2 className="text-3xl font-light tracking-tight text-stone-950 font-serif mt-1">
                  Our Best Sellers
                </h2>
              </div>
              <Link
                href="/shop"
                className="group flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 mt-4 sm:mt-0"
              >
                View all collection <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <div key={product._id} className="group relative flex flex-col">
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-full h-96 bg-stone-100 rounded-md overflow-hidden relative"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.originalPrice && (
                      <span className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider rounded-sm">
                        Sale
                      </span>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-xs font-semibold text-stone-800">
                          {product.rating}
                        </span>
                        <span className="text-xs text-stone-400">({product.reviewsCount})</span>
                      </div>

                      <h3 className="text-base font-medium text-stone-900 group-hover:text-brand-600 transition">
                        <Link href={`/product/${product.slug}`}>{product.name}</Link>
                      </h3>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-neutral-950">Rs. {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    Rs. {product.originalPrice.toFixed(2)}
                  </span>
                )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Promo Banner */}
        <section className="relative h-96 sm:h-[450px] bg-stone-900 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=1600"
              alt="Cosmetic Swatches"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-stone-950/40" />
          </div>
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center text-white space-y-6">
            <h3 className="text-2xl sm:text-4xl font-light font-serif tracking-wide">
              Created For Your Comfort & Glowing Skin
            </h3>
            <p className="max-w-xl text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Every formula is clinically researched, packed with nourishing botanical ingredients, free of synthetics, parabens, or fillers, and engineered for high-performance coverage.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium transition rounded shadow-md"
              >
                Discover QSM
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
