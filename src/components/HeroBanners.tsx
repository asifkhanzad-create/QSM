"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroBanners() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const banners = [
    {
      imageSrc: "/hero-banner-1.png",
      altText: "First Hero Banner",
      tagline: "",
      title: (
        <>
          Inner <br />
          Radiance
        </>
      ),
      description: (
        <>
          Illuminate your visage from within<br />
          Let your natural vibrancy speak first
        </>
      ),
      linkHref: "/shop",
      linkText: "Explore the Collection",
    },
    {
      imageSrc: "/hero-banner-2.png",
      altText: "Second Hero Banner",
      tagline: "",
      title: (
        <>
          Velvet <br />
          Touch
        </>
      ),
      description: (
        <>
          Smooth your canvas to flawless perfection<br />
          Embrace a soft, weightless skin feeling
        </>
      ),
      linkHref: "/shop-by-brand",
      linkText: "Shop by Brand",
    },
  ];

  // ── Desktop Hero (unchanged) ──
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // ── Mobile Hero Slider State ──
  const mobileSlides = [
    {
      image: "/mobile-banner-1.png",
      title: "Radiance Redefined",
      subtitle: "Where elegance meets everyday beauty.",
      linkHref: "/shop",
      linkText: "Shop All",
    },
    {
      image: "/mobile-banner-2.jpg",
      title: "Bold. Beautiful. You.",
      subtitle: "Crafted for the modern muse.",
      linkHref: "/shop-by-brand",
      linkText: "Shop by Brand",
    },
  ];

  const [mobileSlide, setMobileSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToMobileSlide = useCallback((index: number) => {
    setMobileSlide(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 5000);
  }, [mobileSlides.length]);

  // Auto-advance mobile slider
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setMobileSlide((prev) => (prev + 1) % mobileSlides.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX < 0) {
      goToMobileSlide((mobileSlide + 1) % mobileSlides.length);
    } else {
      goToMobileSlide((mobileSlide - 1 + mobileSlides.length) % mobileSlides.length);
    }
  };

  const activeSlide = mobileSlides[mobileSlide];

  return (
    <>
      {/* ── Desktop Hero (unchanged) ── */}
      <section className="hidden md:block relative h-[85vh] bg-stone-100 overflow-hidden mt-6 rounded-2xl">
        {banners.map((banner, index) => {
          const isActive = index === currentBannerIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={banner.imageSrc}
                  alt={banner.altText}
                  className={`w-full h-full object-cover object-center opacity-90 transition-transform duration-[5000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/40 to-transparent" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl text-white space-y-6">
                  {banner.tagline && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs tracking-wider uppercase font-medium text-accentGold-200">
                      <Sparkles className="w-3.5 h-3.5 text-accentGold-300" /> {banner.tagline}
                    </span>
                  )}
                  <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight font-serif">
                    {banner.title}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                    {banner.description}
                  </p>
                  <div className="pt-4">
                    <Link
                      href={banner.linkHref}
                      className="btn-pill btn-shimmer-sweep inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#2a2a2a] text-white transition-colors focus:outline-none overflow-hidden"
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

      {/* ── Mobile Hero Slider ── */}
      <section
        className="block md:hidden mt-0 overflow-hidden bg-stone-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Slides */}
        <div className="relative w-full aspect-video overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
          >
            {mobileSlides.map((slide, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Text Content (below image) */}
<div className="px-6 py-6 text-center bg-white overflow-hidden">
  <div key={mobileSlide}>
    <h2
      className="text-2xl font-light font-serif text-neutral-950 tracking-tight animate-mobile-slide-up"
      style={{ animationDelay: "800ms" }}
    >
      {activeSlide.title}
    </h2>
    <p
      className="text-base text-neutral-500 mt-2 font-light animate-mobile-slide-up"
      style={{ animationDelay: "1000ms" }}
    >
      {activeSlide.subtitle}
    </p>
    <a
      href={activeSlide.linkHref}
      className="btn-pill inline-block mt-4 px-8 py-3 bg-transparent border border-neutral-900 text-neutral-900 text-sm font-medium transition-all duration-200 hover:bg-neutral-900 hover:text-white active:scale-[0.98]"
    >
      {activeSlide.linkText}
    </a>
  </div>
</div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 pb-5 bg-white">
          {mobileSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMobileSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === mobileSlide
                  ? "bg-neutral-900 w-6"
                  : "bg-neutral-300 w-2 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}