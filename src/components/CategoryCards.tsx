"use client";

import React from "react";
import Link from "next/link";
import { type Category } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const localImages: Record<string, string> = {
  lipsticks: "/category-lipsticks.png",
  "face-washes": "/category-face-washes.png",
  "face-serums": "/category-face-serums.png",
  moisturizers: "/category-moisturizers.png",
  "hair-products": "/category-hair-products.png",
  "nail-polishes": "/category-nail-polishes.png",
  "eye-cosmetics": "/category-eye-cosmetics.png",
};

interface CategoryCardsProps {
  categories: Category[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-in-up">
        <h2 className="text-2xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
          Shop by Category
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-light">
          Explore our curated collections designed for every beauty need.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((category, index) => (
          <Link
            key={category._id}
            href={`/shop?category=${category.slug}`}
            className={`group relative overflow-hidden rounded-3xl shadow-md shadow-neutral-300/40 hover:shadow-xl hover:shadow-neutral-300/50 transition-shadow duration-300 ${
              index === 0 ? "col-span-2 sm:col-span-1" : ""
            } animate-fade-in-up`}
            style={{ animationDelay: `${Math.min(index * 80, 500)}ms` }}
          >
            {/* Image */}
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img
                src={category.image || localImages[category.slug] || "/placeholder-category.png"}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
              <h3 className="text-white text-sm sm:text-base font-semibold tracking-wide">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-white/70 text-[10px] sm:text-xs mt-1 line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2 text-white/80 group-hover:text-white text-[10px] sm:text-xs font-medium transition-colors duration-300">
                Shop Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}