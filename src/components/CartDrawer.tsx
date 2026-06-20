"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

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

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-medium text-neutral-900 font-serif">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-base font-medium text-neutral-900">Your bag is empty</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Fill it with beautiful items from our collection.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 text-sm font-medium transition border-2 border-neutral-950 rounded-full"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product._id}-${item.selectedShade?.name || "none"}-${idx}`}
                  className="flex gap-4 py-4 border-b border-neutral-50 last:border-b-0"
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
                      <h4 className="font-medium text-neutral-950 hover:text-brand-600">
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
                          className="p-1 hover:bg-neutral-50 text-neutral-500 hover:border-neutral-900 border-2 border-neutral-200 rounded-full"
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
                          className="p-1 hover:bg-neutral-50 text-neutral-500 hover:border-neutral-900 border-2 border-neutral-200 rounded-full"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id, item.selectedShade?.name || null)}
                        className="text-neutral-400 hover:text-red-500 transition p-1"
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
            <div className="border-t border-neutral-100 px-6 py-6 bg-neutral-50">
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
                  className="w-full flex items-center justify-center py-3 bg-white hover:bg-neutral-900 hover:text-white font-medium transition border-2 border-neutral-950 rounded-full"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 text-sm text-neutral-600 hover:text-neutral-900 font-medium transition"
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
