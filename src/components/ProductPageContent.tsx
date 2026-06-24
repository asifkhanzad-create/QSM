"use client";

import React, { useState, useRef, useCallback } from "react";
import { type Product, type Shade } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Star, ShoppingBag, Check, Truck, Sparkles, BadgeCheck, Wallet } from "lucide-react";

interface ProductPageContentProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductPageContent({ product, relatedProducts = [] }: ProductPageContentProps) {
  const { addToCart } = useCart();
  
  // Set initial shade if shades are available
  const [selectedShade, setSelectedShade] = useState<Shade | null>(
    product.shades && product.shades.length > 0 ? product.shades[0] : null
  );
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse">("description");
  const [justAdded, setJustAdded] = useState(false);

  // Hover zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [mousePercent, setMousePercent] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoom = 1.8;

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || product.images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return; // minimum swipe distance
    if (diff > 0 && activeImageIndex < product.images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else if (diff < 0 && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
    touchStartX.current = null;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePercent({ x, y });
  }, []);

  const handleAddToCart = () => {
    if (product.shades && product.shades.length > 0 && !selectedShade) {
      alert("Please select a shade first.");
      return;
    }
    addToCart(product, selectedShade, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  // Determine which main image to display from the product gallery
  const displayedImage = product.images[activeImageIndex] || product.images[0];

  const isSelectedShadeInStock = selectedShade ? selectedShade.inStock : true;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div
            ref={imageContainerRef}
            className="w-full h-[500px] sm:h-[600px] bg-white rounded-xl overflow-hidden relative shadow-sm border border-neutral-100 touch-pan-y"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              key={displayedImage}
              src={displayedImage}
              alt={product.name}
              className="w-full h-full object-cover animate-fade-in transition-transform duration-300 ease-out"
              style={{
                transform: isHovering ? `scale(${zoom})` : "scale(1)",
                transformOrigin: `${mousePercent.x}% ${mousePercent.y}%`,
              }}
            />
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedShade(null); // Clear shade override to show full gallery
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
            <span className="text-xs uppercase tracking-wider text-brand-600 font-semibold bg-brand-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            {product.isBestSeller && (
              <span className="text-[10px] uppercase tracking-wider text-white font-bold bg-neutral-900 px-2.5 py-1 rounded-full">
                Bestseller
              </span>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-serif text-neutral-950 tracking-tight">
              {product.name}
            </h1>
            
            {/* Reviews / Rating */}
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
              
              {/* Swatch circle buttons */}
              <div className="flex flex-wrap gap-3">
                {product.shades.map((shade, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedShade(shade);
                    }}
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
              {/* Quantity selector */}
              {isSelectedShadeInStock && (
                <div className="flex items-center border border-neutral-200 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="icon-btn px-3.5 py-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 border border-neutral-200 rounded-full"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium text-neutral-900 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="icon-btn px-3.5 py-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 border border-neutral-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isSelectedShadeInStock}
                className={`btn-pill flex-1 flex items-center justify-center gap-2 py-3.5 border ${
                  justAdded
                    ? "bg-green-600 text-white border-green-600 scale-[1.02]"
                    : isSelectedShadeInStock
                      ? "bg-customPurple hover:bg-customPurple-hover text-white border-transparent focus:outline-none"
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
                    {isSelectedShadeInStock ? "Add to Shopping Bag" : "Selected Shade Out of Stock"}
                  </>
                )}
              </button>
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Informational Tabs (Description, Ingredients, How to Use) */}
          <div className="border border-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="flex gap-2 border-b border-neutral-100 bg-neutral-50/50 p-2">
              {(["description", "ingredients", "howToUse"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn-pill flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase text-center border transition-all duration-200 focus:outline-none ${
                    activeTab === tab
                      ? "bg-customPurple text-white border-transparent scale-[1.02]"
                      : "bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 border-neutral-200"
                  }`}
                >
                  {tab === "description" ? "Description" : tab === "ingredients" ? "Ingredients" : "How to Use"}
                </button>
              ))}
            </div>

            <div key={activeTab} className="p-5 text-sm text-neutral-600 leading-relaxed min-h-[120px] animate-fade-in-up">
              {activeTab === "description" && <p>{product.description}</p>}
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

    </div>
  );
}

