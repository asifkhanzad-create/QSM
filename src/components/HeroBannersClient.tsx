"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export interface SanityHeroBanner {
  _id: string;
  title: string;
  tagline?: string;
  description?: string;
  linkText: string;
  linkHref: string;
  image: string;
  altText?: string;
}

export interface SanityMobileBanner {
  _id: string;
  title: string;
  subtitle?: string;
  linkText: string;
  linkHref: string;
  image: string;
}

function renderMultiline(text?: string) {
  if (!text) return null;
  return text.split("\n").map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

interface HeroBannersClientProps {
  banners: SanityHeroBanner[];
  mobileSlides: SanityMobileBanner[];
}

export default function HeroBannersClient({ banners, mobileSlides }: HeroBannersClientProps) {
  // ── Desktop Hero ──
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // ── Mobile Hero Slider State ──
  const [mobileSlide, setMobileSlide] = useState(0);
  const [noTransition, setNoTransition] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalRealSlides = mobileSlides.length;
  // Clone first slide at the end for seamless forward loop
  const displaySlides =
    totalRealSlides > 1 ? [...mobileSlides, mobileSlides[0]] : mobileSlides;

  // Snap back from clone to real first slide (instant, no animation)
  useEffect(() => {
    if (mobileSlide === totalRealSlides && totalRealSlides > 1) {
      const timer = setTimeout(() => {
        setNoTransition(true);
        setMobileSlide(0);
      }, 500); // must match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [mobileSlide, totalRealSlides]);

  // Re-enable CSS transition after the snap
  useEffect(() => {
    if (noTransition) {
      const timer = setTimeout(() => {
        setNoTransition(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [noTransition]);

  // Safety: reset index if it somehow goes out of bounds
  useEffect(() => {
    if (mobileSlide >= displaySlides.length && displaySlides.length > 0) {
      setMobileSlide(0);
    }
  }, [displaySlides.length, mobileSlide]);

  const advanceSlide = useCallback(() => {
    if (totalRealSlides <= 1) return;
    setMobileSlide((prev) => {
      if (prev >= totalRealSlides) return 0;
      return prev + 1;
    });
  }, [totalRealSlides]);

  const goToMobileSlide = useCallback((index: number) => {
    if (totalRealSlides === 0) return;
    setMobileSlide(index);
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalRealSlides > 1) {
      timerRef.current = setInterval(() => {
        advanceSlide();
      }, 5000);
    }
  }, [totalRealSlides, advanceSlide]);

  // Auto-advance mobile slider
  useEffect(() => {
    if (totalRealSlides <= 1) return;
    timerRef.current = setInterval(() => {
      advanceSlide();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalRealSlides, advanceSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || totalRealSlides === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return;

    if (deltaX < 0) {
      // Swipe left → next
      if (totalRealSlides > 1) advanceSlide();
    } else {
      // Swipe right → previous
      setMobileSlide((prev) => {
        if (prev <= 0) return totalRealSlides - 1;
        return prev - 1;
      });
    }
  };

  const activeSlide = displaySlides[mobileSlide] || displaySlides[0];
  const activeDotIndex = mobileSlide >= totalRealSlides ? 0 : mobileSlide;

  return (
    <>
      {/* ── Desktop Hero ── */}
      <div className="hidden md:block max-w-[1200px] mx-auto pt-12 pb-6">
        <section className="relative h-[480px] lg:h-[520px] bg-stone-100 overflow-hidden rounded-[32px] shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-neutral-100/80">
        {banners.map((banner, index) => {
          const isActive = index === currentBannerIndex;
          return (
            <div
              key={banner._id}
              className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={banner.image}
                  alt={banner.altText || banner.title}
                  className={`w-full h-full object-cover object-center opacity-90 transition-transform duration-[5000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/40 to-transparent" />
              </div>

              <div className="relative z-10 w-full h-full flex items-center px-12 lg:px-16">
                <div className="max-w-xl text-white space-y-6">
                  {banner.tagline && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs tracking-wider uppercase font-medium text-accentGold-200">
                      <Sparkles className="w-3.5 h-3.5 text-accentGold-300" /> {banner.tagline}
                    </span>
                  )}
                  <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-tight font-serif">
                    {renderMultiline(banner.title)}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                    {renderMultiline(banner.description)}
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
      </div>

      {/* ── Mobile Hero Slider ── */}
      <section
        className="block md:hidden mt-0 overflow-hidden bg-stone-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Slides */}
        <div className="relative w-full aspect-video overflow-hidden">
          <div
            className={`flex h-full ${
              noTransition ? "" : "transition-transform duration-500 ease-in-out"
            }`}
            style={{ transform: `translateX(-${mobileSlide * 100}%)` }}
          >
            {displaySlides.map((slide, index) => (
              <div key={`${slide._id}-${index}`} className="w-full h-full flex-shrink-0">
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
          {activeSlide && (
            <div key={activeSlide._id}>
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
          )}
        </div>

        {/* Dots Navigation */}
        {totalRealSlides > 1 && (
          <div className="flex justify-center gap-2 pb-5 bg-white">
            {mobileSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToMobileSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeDotIndex
                    ? "bg-neutral-900 w-6"
                    : "bg-neutral-300 w-2 hover:bg-neutral-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}