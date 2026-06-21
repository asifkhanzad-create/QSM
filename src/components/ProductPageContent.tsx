"use client";

import React, { useState } from "react";
import { type Product, type Shade } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Check, Shield, RotateCcw, Truck, Sparkles } from "lucide-react";

interface ProductPageContentProps {
  product: Product;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  const { addToCart } = useCart();
  
  // Set initial shade if shades are available
  const [selectedShade, setSelectedShade] = useState<Shade | null>(
    product.shades && product.shades.length > 0 ? product.shades[0] : null
  );
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howToUse">("description");
  const [justAdded, setJustAdded] = useState(false);

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
          <div className="w-full h-[500px] sm:h-[600px] bg-white rounded-lg overflow-hidden relative shadow-sm border border-neutral-100">
            <img
              key={displayedImage}
              src={displayedImage}
              alt={product.name}
              className="w-full h-full object-cover animate-fade-in"
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
              <span className="text-[10px] uppercase tracking-wider text-white font-bold bg-neutral-900 px-2.5 py-1 rounded">
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
                      ? "bg-accentPink-400 hover:bg-accentPink-500 text-white border-accentPink-400"
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
          <div className="border border-neutral-100 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="flex gap-2 border-b border-neutral-100 bg-neutral-50/50 p-2">
              {(["description", "ingredients", "howToUse"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn-pill flex-1 py-2.5 text-xs font-semibold tracking-wider uppercase text-center border transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-accentPink-400 text-white border-accentPink-400 scale-[1.02]"
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
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-50 text-center text-[11px] text-neutral-500 font-medium">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-brand-600" />
              <span>Free Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-brand-600" />
              <span>30-Day Free Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-5 h-5 text-brand-600" />
              <span>100% Secure Checkout</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

