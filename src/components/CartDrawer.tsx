"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { useAnimatedPresence } from "@/hooks/useAnimatedPresence";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
  } = useCart();

  const { mounted, visible } = useAnimatedPresence(isCartOpen);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={cn(
          "overlay-backdrop",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div
          className={cn(
            "drawer-panel w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto",
            visible ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-medium text-neutral-900 font-serif">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="icon-btn p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-scale-in">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-base font-medium text-neutral-900">Your bag is empty</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Fill it with beautiful items from our collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-pill mt-6 px-6 py-2.5 bg-gradient-to-r from-customPurple to-customPink hover:from-customPurple-hover hover:to-customPink-hover text-white text-sm border border-transparent focus:outline-none"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product._id}-${item.selectedShade?.name || "none"}-${idx}`}
                  className="flex gap-4 py-4 border-b border-neutral-50 last:border-b-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="w-20 h-24 bg-neutral-100 rounded-md overflow-hidden relative flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between text-sm">
                      <h4 className="font-medium text-neutral-950 hover:text-brand-600 transition-colors">
                        <Link href={`/product/${item.product.slug}`} onClick={() => setIsCartOpen(false)}>
                          {item.product.name}
                        </Link>
                      </h4>
                      <p className="font-semibold text-neutral-900">
                        Rs. {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {item.selectedShade && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-200"
                          style={{ backgroundColor: item.selectedShade.colorCode }}
                        />
                        <span className="text-xs text-neutral-500">{item.selectedShade.name}</span>
                      </div>
                    )}

                    <div className="flex-1 flex items-end justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded">
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.selectedShade?.name || null, item.quantity - 1)
                          }
                          className="icon-btn p-1 hover:bg-neutral-50 text-neutral-500 border-2 border-neutral-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.selectedShade?.name || null, item.quantity + 1)
                          }
                          className="icon-btn p-1 hover:bg-neutral-50 text-neutral-500 border-2 border-neutral-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id, item.selectedShade?.name || null)}
                        className="icon-btn text-neutral-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 px-6 py-6 bg-neutral-50 animate-fade-in-up">
              <div className="flex justify-between text-base font-medium text-neutral-900 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">Rs. {cartSubtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-pill w-full flex items-center justify-center py-3 bg-gradient-to-r from-customPurple to-customPink hover:from-customPurple-hover hover:to-customPink-hover text-white border border-transparent focus:outline-none"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-press w-full flex items-center justify-center py-2.5 text-sm text-accentPink-400 hover:text-accentPink-500 font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
