"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { type Product, type Shade } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Star, ShoppingBag, Check, Truck, Sparkles, BadgeCheck, Wallet, ZoomIn, Eye } from "lucide-react";
import ImageZoomModal from "./ImageZoomModal";

interface ProductPageContentProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductPageContent({ product, relatedProducts = [] }: ProductPageContentProps) {
  const { addToCart } = useCart();
  
  const [selectedShade, setSelectedShade] = useState<Shade | null>(
    product.shades && product.shades.length > 0 ? product.shades[0] : null
  );
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse">("description");
  const [justAdded, setJustAdded] = useState(false);

  // Live viewer counter state (fake, max 14)
  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [showViewerCounter] = useState(() => Math.random() > 0.35);

  // Hover zoom state (desktop only)
  const [isHovering, setIsHovering] = useState(false);
  const [mousePercent, setMousePercent] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoom = 1.8;

  // Mobile zoom modal state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Swipe-to-change-image state (mobile/touch only)
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const containerWidthRef = useRef(1);

  // Live viewer counter effect
  useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;
  let trend = Math.random() > 0.5 ? 1 : -1; // start with up or down trend
  let trendSteps = Math.floor(Math.random() * 3) + 2; // keep trend for 2–4 steps

  const updateViewerCount = () => {
    setViewerCount((prev) => {
      if (prev === null) return Math.floor(Math.random() * 12) + 3;

      // Decrease trend steps
      trendSteps--;
      
      // Maybe flip trend when steps run out (70% chance to keep, 30% to flip)
      if (trendSteps <= 0) {
        trend = Math.random() > 0.3 ? trend : -trend;
        trendSteps = Math.floor(Math.random() * 3) + 2;
      }

      let next = prev + trend;
      
      // Bounce off walls instead of sticking
      if (next < 3) {
        next = 4;
        trend = 1;
        trendSteps = Math.floor(Math.random() * 3) + 2;
      }
      if (next > 14) {
        next = 13;
        trend = -1;
        trendSteps = Math.floor(Math.random() * 3) + 2;
      }

      return next;
    });

    const nextDelay = Math.random() * 7000 + 5000;
    timeoutId = setTimeout(updateViewerCount, nextDelay);
  };

  updateViewerCount();

  return () => clearTimeout(timeoutId);
}, []);

  const handleMouseMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePercent({ x, y });
  }, []);

  const handleImageTouchStart = (e: React.TouchEvent) => {
    if (product.images.length <= 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    containerWidthRef.current = imageContainerRef.current?.offsetWidth || 1;
    setIsSwiping(true);
  };

  const handleImageTouchMove = (e: React.TouchEvent) => {
    if (product.images.length <= 1 || !isSwiping) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }

    let constrainedDelta = deltaX;
    if (activeImageIndex === 0 && deltaX > 0) {
      constrainedDelta = deltaX * 0.35;
    } else if (activeImageIndex === product.images.length - 1 && deltaX < 0) {
      constrainedDelta = deltaX * 0.35;
    }

    setDragOffset(constrainedDelta);
  };

  const handleImageTouchEnd = () => {
    if (product.images.length <= 1) {
      setIsSwiping(false);
      return;
    }
    const width = containerWidthRef.current || 1;
    const threshold = width * 0.18;

    if (dragOffset <= -threshold && activeImageIndex < product.images.length - 1) {
      setSelectedShade(null);
      setActiveImageIndex((prev) => prev + 1);
    } else if (dragOffset >= threshold && activeImageIndex > 0) {
      setSelectedShade(null);
      setActiveImageIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    setIsSwiping(false);
  };

  const handleAddToCart = () => {
    if (product.shades && product.shades.length > 0 && !selectedShade) {
      alert("Please select a shade first.");
      return;
    }
    addToCart(product, selectedShade, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const displayedImage = product.images[activeImageIndex] || product.images[0];
  const isSelectedShadeInStock = selectedShade ? selectedShade.inStock : true;

  // Stock logic
  const isProductInStock = typeof product.quantity !== "number" || product.quantity > 0;
  const isLowStock = product.quantity !== undefined && product.quantity > 0 && product.quantity <= 5;

    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div
            ref={imageContainerRef}
            className="w-full h-[500px] sm:h-[600px] bg-white rounded-[2rem] overflow-hidden relative shadow-sm border border-neutral-100"
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setIsHovering(true); }}
            onPointerLeave={(e) => { if (e.pointerType === "mouse") setIsHovering(false); }}
            onPointerMove={(e) => { if (e.pointerType === "mouse") handleMouseMove(e); }}
            onTouchStart={handleImageTouchStart}
            onTouchMove={handleImageTouchMove}
            onTouchEnd={handleImageTouchEnd}
          >
            <div
              className="flex h-full"
              style={{
                width: `${product.images.length * 100}%`,
                transform: `translateX(calc(${-activeImageIndex * (100 / product.images.length)}% + ${dragOffset}px))`,
                transition: isSwiping ? "none" : "transform 300ms ease-out",
              }}
            >
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="h-full flex-shrink-0"
                  style={{ width: `${100 / product.images.length}%` }}
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    style={
                      idx === activeImageIndex
                        ? {
                            transform: isHovering ? `scale(${zoom})` : "scale(1)",
                            transformOrigin: `${mousePercent.x}% ${mousePercent.y}%`,
                            transition: "transform 300ms ease-out",
                          }
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>

            {/* Mobile zoom button */}
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-neutral-100 text-neutral-700 hover:text-neutral-900 hover:bg-white transition-all md:hidden"
              aria-label="Zoom image"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedShade(null);
                    setActiveImageIndex(idx);
                  }}
                  className={`icon-btn w-20 h-24 rounded-full overflow-hidden bg-white border border-neutral-200 transition-all duration-200 hover:border-neutral-900 ${
                    activeImageIndex === idx && !selectedShade
                      ? "border-neutral-900 scale-95 ring-2 ring-neutral-900/20"
                      : ""
                  }`}
                >
                  <img src={img} alt={`${product.name} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
                {/* Right Column: Product Info & Purchase Actions */}
        <div className="space-y-6">
          
          {/* Breadcrumbs / Tag */}
          <div className="flex items-center gap-2">
            {product.isBestSeller && (
  <span className="text-[10px] uppercase tracking-wider text-white font-bold bg-neutral-900 px-2.5 py-1 rounded-full">
    Bestseller
  </span>
)}
{product.isHotSelling && (
  <span className="text-[10px] uppercase tracking-wider text-white font-bold bg-orange-500 px-2.5 py-1 rounded-full flex items-center gap-1">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer flame: greyish white */}
      <path d="M4.84 10.71C3.08 3.9 7.03 0.4 14.47 0C9.86 4.43 18.32 9.23 18.79 14.01C19.88 12.6 20.5 10.74 20.62 7.63C26.19 14.19 21.6 24.93 9.35 23.15C8.22 23.01 7.14 22.74 6.15 22.32C2.67 21.27 0 16.97 0 13.63C0 10.46 1.35 7.78 3.1 6.06C3.34 7.71 3.84 9.27 4.84 10.71z" fill="#fc3b3b"/>
      {/* Inner flame: pure white */}
      <path d="M8.8 18.05C7.54 15.56 7.72 11.61 11.25 10.22C11.28 14.76 17.24 15.38 16.12 20.27C17.14 19.4 17.65 18.02 17.74 16.63C19.36 19.4 18.09 21.63 15.78 22.82C8.77 26.27 2.73 19.2 6.77 15.38C6.77 16.59 8.16 17.92 8.8 18.05z" fill="#f5b70d"/>
    </svg>
    Hot Selling
  </span>
)}
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-sm font-bold text-neutral-800">{product.rating}</span>
              <span className="text-sm text-neutral-400">({product.reviewsCount} verified reviews)</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-neutral-950">Rs. {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  Rs. {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Live Viewer Counter — ADDED HERE */}
            {showViewerCounter && viewerCount !== null && (
            <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <Eye className="w-4 h-4 text-neutral-400" />
              <span className="font-semibold text-neutral-800">{viewerCount} {viewerCount === 1 ? 'person' : 'people'}</span>
              <span className="text-neutral-500">viewing this right now</span>
            </div>
            )}

            {/* Stock Status with Progress Bar */}
            {typeof product.quantity === "number" && product.quantity > 0 && (
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">
                    {product.quantity <= 3 
                      ? "Low Stock" 
                      : product.quantity <= 10 
                        ? "Selling Fast" 
                        : "In Stock"}
                  </span>
                  <span className={`font-bold ${
                    product.quantity <= 3 
                      ? "text-red-500" 
                      : product.quantity <= 10 
                        ? "text-amber-600" 
                        : "text-green-600"
                  }`}>
                    {product.quantity} units available
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      product.quantity <= 3 
                        ? "bg-red-500" 
                        : product.quantity <= 10 
                          ? "bg-amber-500" 
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((product.quantity / 20) * 100, 100)}%` }}
                  />
                </div>
                
                {product.quantity <= 3 && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Only {product.quantity} left — order soon before it's gone
                  </p>
                )}
                {product.quantity > 3 && product.quantity <= 10 && (
                  <p className="text-xs text-amber-600 font-medium">
                    Selling fast! {product.quantity} units remaining
                  </p>
                )}
              </div>
            )}

            {typeof product.quantity === "number" && product.quantity === 0 && (
              <div className="mt-5 flex items-center gap-2 text-red-500">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                <p className="text-sm font-medium">
                  Currently out of stock
                </p>
              </div>
            )}
          </div>

          <hr className="border-neutral-100" />

                    {/* Shade/Color Selection */}
          {product.shades && product.shades.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-neutral-900">
                  Select Shade:{" "}
                  <span className="text-brand-600 font-semibold">
                    {selectedShade?.name || "Choose below"}
                  </span>
                </span>
                {!isSelectedShadeInStock && (
                  <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {product.shades.map((shade, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedShade(shade)}
                    className={`icon-btn relative w-9 h-9 rounded-full bg-white border border-neutral-200 transition-all duration-200 flex items-center justify-center p-0.5 hover:border-neutral-900 hover:scale-105 ${
                      selectedShade?.name === shade.name
                        ? "border-neutral-900 shadow-md scale-105 ring-2 ring-neutral-900/15"
                        : ""
                    }`}
                    title={shade.name}
                  >
                    <span
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: shade.colorCode }}
                    />
                    {selectedShade?.name === shade.name && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className={`w-4 h-4 ${
                            shade.colorCode.toLowerCase() === "#ffffff" ? "text-neutral-900" : "text-white"
                          }`}
                        />
                      </span>
                    )}
                    {!shade.inStock && (
                      <span className="absolute inset-x-0 h-0.5 bg-neutral-400/80 rotate-45" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

                    {/* Add To Cart Form */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              {isSelectedShadeInStock && isProductInStock && (
                <div className="flex items-center border border-neutral-200 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="icon-btn px-3.5 py-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 border border-neutral-200 rounded-full"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium text-neutral-900 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, product.quantity || 99))}
                    className="icon-btn px-3.5 py-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 border border-neutral-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!isSelectedShadeInStock || !isProductInStock}
                className={`btn-pill flex-1 flex items-center justify-center gap-2 py-3.5 border ${
                  justAdded
                    ? "bg-green-600 text-white border-green-600 scale-[1.02]"
                    : !isProductInStock
                      ? "bg-white text-neutral-400 cursor-not-allowed border-neutral-200"
                      : isSelectedShadeInStock
                        ? "btn-gradient focus:outline-none"
                        : "bg-white text-neutral-400 cursor-not-allowed border-neutral-200"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 animate-pop" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {!isProductInStock
                      ? "Out of Stock"
                      : isSelectedShadeInStock
                        ? "Add to Shopping Bag"
                        : "Selected Shade Out of Stock"}
                  </>
                )}
              </button>
            </div>
          </div>

          <hr className="border-neutral-100" />

                    {/* Informational Tabs */}
          <div className="border border-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="flex gap-2 border-b border-neutral-100 bg-neutral-50/50 p-2">
              {(["description", "ingredients", "howToUse"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn-pill flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase text-center border transition-all duration-200 focus:outline-none ${
                    activeTab === tab
                      ? "btn-gradient scale-[1.02]"
                      : "bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 border-neutral-200"
                  }`}
                >
                  {tab === "description" ? "Description" : tab === "ingredients" ? "Ingredients" : "How to Use"}
                </button>
              ))}
            </div>

            <div key={activeTab} className="p-5 text-sm text-neutral-600 leading-relaxed min-h-[120px] animate-fade-in-up">
              {activeTab === "description" && (
  <div className="space-y-3">
    {product.brandName && (
      <p className="text-sm font-medium text-neutral-800">
        Brand: <span className="text-brand-600">{product.brandName}</span>
      </p>
    )}
    <p>{product.description}</p>
  </div>
)}
              {activeTab === "ingredients" && (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-400 font-medium mb-1">KEY SKIN-LOVING INGREDIENTS:</p>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-neutral-700 font-medium">
                      {product.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-neutral-400">Pure mineral pigments, natural botanical oils, and active antioxidants.</p>
                  )}
                </div>
              )}
              {activeTab === "howToUse" && (
                <p>{product.howToUse || "Apply evenly with a clean brush, sponge, or your fingertips. Layer for desired coverage intensity."}</p>
              )}
            </div>
          </div>

                    {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-50 text-center text-[11px] text-neutral-500 font-medium bg-neutral-50 rounded-xl p-4">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>Free Shipping Over 2500</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <BadgeCheck className="w-5 h-5 text-brand-600" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wallet className="w-5 h-5 text-brand-600" />
              <span>Cash on Delivery</span>
            </div>
          </div>

        </div>
      </div>

            {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 sm:pt-20">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-in-up">
            <h2 className="text-2xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {relatedProducts.map((relatedProduct, index) => (
              <div
                key={relatedProduct._id}
                className="group relative flex flex-col bg-white rounded-[2rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                <Link
                  href={`/product/${relatedProduct.slug}`}
                  className="w-full h-[220px] sm:h-[380px] bg-neutral-100 overflow-hidden relative block transition-transform duration-300 group-hover:shadow-md"
                >
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {relatedProduct.originalPrice && (
                    <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-brand-600 text-white text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 uppercase tracking-wider rounded-full">
                      Sale
                    </span>
                  )}
                  {relatedProduct.shades && relatedProduct.shades.length > 0 && (
                    <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm border border-neutral-100">
                      {relatedProduct.shades.length} Shades
                    </span>
                  )}
                </Link>
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-800">{relatedProduct.rating}</span>
                      <span className="text-[10px] sm:text-xs text-neutral-400">({relatedProduct.reviewsCount})</span>
                    </div>
                    <h3 className="text-xs sm:text-base font-normal tracking-wide text-neutral-900 group-hover:text-brand-600 transition">
                      <Link href={`/product/${relatedProduct.slug}`}>{relatedProduct.name}</Link>
                    </h3>
                  </div>
                  <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-base font-semibold text-neutral-950">Rs. {relatedProduct.price.toFixed(2)}</span>
                    {relatedProduct.originalPrice && (
                      <span className="text-[10px] sm:text-sm text-neutral-400 line-through">
                        Rs. {relatedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
          <ImageZoomModal
        src={displayedImage}
        alt={product.name}
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
      />

    </div>
  );
}