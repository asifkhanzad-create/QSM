"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroBanners() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = [
    {
      imageSrc: "/hero-banner-1.png",
      altText: "First Hero Banner",
      tagline: "QSM - Quality, Style, Modernity",
      title: (
        <>
          Elevate Your <br />
          Beauty Experience
        </>
      ),
      description: "Discover premium cosmetics crafted with care and elegance. QSM brings you the best in beauty with quality you can trust.",
      linkHref: "/shop",
      linkText: "Explore the Collection",
    },
    {
      imageSrc: "/hero-banner-2.png",
      altText: "Second Hero Banner",
      tagline: "New Arrivals",
      title: (
        <>
          Unveiling the <br />
          Latest Trends
        </>
      ),
      description: "Stay ahead with our newest collection, featuring innovative formulas and captivating shades.",
      linkHref: "/shop",
      linkText: "Shop New Arrivals",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="relative h-[85vh] bg-stone-100 overflow-hidden mt-6">
      {banners.map((banner, index) => {
        const isActive = index === currentBannerIndex;
        return (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background image with subtle scale transition */}
            <div className="absolute inset-0 z-0">
              <img
                src={banner.imageSrc}
                alt={banner.altText}
                className={`w-full h-full object-cover object-center opacity-90 transition-transform duration-[5000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
              {/* Elegant overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/40 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl text-white space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs tracking-wider uppercase font-medium text-accentGold-200">
                  <Sparkles className="w-3.5 h-3.5 text-accentGold-300" /> {banner.tagline}
                </span>
                <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight font-serif">
                  {banner.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                  {banner.description}
                </p>
                <div className="pt-4">
                  <Link
                    href={banner.linkHref}
                    className="btn-pill inline-flex items-center gap-2 px-8 py-3 bg-accentPink-400 text-white font-medium hover:bg-accentPink-500 transition-colors"
                  >
                    {banner.linkText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBannerIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBannerIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
