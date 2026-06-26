"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, ShoppingBag, CreditCard, Sparkles, CheckCircle2, Truck, PartyPopper } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartCount, clearCart, shippingCost, isFreeShipping, amountUntilFreeShipping: amountUntilFree } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState<{
    items: typeof cart;
    subtotal: number;
    shipping: number;
    total: number;
    freeShipping: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // Added phone number field
    address: "",
    city: "",
    zipCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Don't submit yet — show confirmation dialog first
    setShowConfirmDialog(true);
  };

  const confirmOrder = () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    // Generate a simple order number for the confirmation screen
    const newOrderNumber = `${Date.now()}`;
    setOrderNumber(newOrderNumber);

    // Save a snapshot of the order for the Thank You screen (cart gets cleared below)
    setOrderSnapshot({
      items: cart,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      total: totalCost,
      freeShipping: isFreeShipping,
    });

    // Notify Discord with full order details (this stays exactly as-is)
    fetch("/api/discord-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formData,
        cart,
        cartSubtotal,
        shippingCost,
        totalCost,
        isFreeShipping,
        orderNumber: newOrderNumber,
      }),
      keepalive: true,
    }).catch((err) => console.error("Discord notify failed:", err));

    // Clear cart and show the on-site confirmation screen
    clearCart();
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const totalCost = cartSubtotal + shippingCost;

  if (isSuccess) {
    return (
      <>
        
        <main className="flex-1 bg-stone-50/50 py-16 sm:py-24 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-neutral-100 rounded-2xl shadow-xl p-8 text-center space-y-6 animate-scale-in">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mx-auto animate-pop">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-600 font-bold">Order Confirmed</span>
              <h2 className="text-2xl font-light font-serif text-neutral-900">Thank you for your order!</h2>
              <p className="text-sm text-neutral-500 font-light">
                Your order has been placed successfully. Our team will contact you shortly to confirm your Cash on Delivery order.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 text-left border border-neutral-100 space-y-3">
              {orderSnapshot && orderSnapshot.items.length > 0 && (
                <>
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {orderSnapshot.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm gap-2">
                        <div>
                          <span className="text-neutral-900 font-medium">{item.product.name}</span>
                          {item.selectedShade && (
                            <span className="text-neutral-400 text-xs block">Shade: {item.selectedShade.name}</span>
                          )}
                          <span className="text-neutral-400 text-xs block">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-neutral-900 whitespace-nowrap">
                          Rs. {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-neutral-200" />
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal:</span>
                    <span className="font-semibold text-neutral-900">Rs. {orderSnapshot.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Shipping:</span>
                    <span className="font-semibold text-neutral-900">
                      {orderSnapshot.freeShipping ? "FREE" : `Rs. ${orderSnapshot.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Total Amount:</span>
                    <span className="font-bold text-neutral-950">Rs. {orderSnapshot.total.toFixed(2)}</span>
                  </div>
                  <hr className="border-neutral-200" />
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Order Number:</span>
                <span className="font-semibold text-neutral-900">QSM-{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Delivery Estimate:</span>
                <span className="font-semibold text-neutral-900">3-5 Business Days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Payment Method:</span>
                <span className="font-semibold text-neutral-900">Cash on Delivery</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-left">
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                📸 Kindly take a screenshot of this order confirmation or save these details — you may need them later for reference.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="btn-pill w-full inline-block py-3 bg-white hover:bg-neutral-900 hover:text-white text-sm border-2 border-neutral-950"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      
      <main className="flex-1 bg-stone-50/50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to shopping bag
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form Column (Delivery & Payment info) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* 1. Contact Info */}
                <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-medium text-neutral-950 font-serif border-b border-neutral-100 pb-3">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Email Address <span className="text-neutral-400 font-normal normal-case">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-lg font-medium text-neutral-950 font-serif border-b border-neutral-100 pb-3">
                    Shipping Details
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Zip Code <span className="text-neutral-400 font-normal normal-case">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Cash on Delivery (COD) Details */}
                <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h3 className="text-lg font-medium text-neutral-950 font-serif flex items-center gap-1.5">
                      <CreditCard className="w-5 h-5 text-brand-600" /> Cash on Delivery (COD)
                    </h3>
                    <span className="text-[10px] text-green-600 font-bold tracking-widest uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Secure
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Pay with cash when your order is delivered to your doorstep. Please ensure you have the exact amount ready.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                className={`btn-pill w-full py-4 text-sm font-semibold uppercase tracking-wider text-white border-2 ${
                    isSubmitting || cart.length === 0
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border-neutral-200"
                      : "bg-neutral-950 hover:bg-neutral-800 border-neutral-950 shadow-lg"
                  }`}
                >
                  {isSubmitting ? "Placing Order..." : `Complete Order • Rs. ${totalCost.toFixed(2)}`}
                </button>

                <Link
                  href="/shop"
                  className="btn-pill w-full inline-block text-center py-4 text-sm font-semibold uppercase tracking-wider bg-white hover:bg-neutral-50 text-neutral-700 border-2 border-neutral-200"
                >
                  Continue Shopping
                </Link>
              </form>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 bg-white border border-neutral-100 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-medium text-neutral-950 font-serif border-b border-neutral-100 pb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-5 h-5 text-brand-600" /> Order Summary
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-neutral-500">Your bag is empty.</p>
                  <Link href="/shop" className="text-xs font-semibold text-brand-600 hover:underline">
                    Find products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-14 bg-stone-100 rounded-lg overflow-hidden relative flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-neutral-900 line-clamp-1">{item.product.name}</h4>
                          {item.selectedShade && (
                            <span className="text-[10px] text-neutral-400 block mt-0.5">Shade: {item.selectedShade.name}</span>
                          )}
                          <span className="text-[10px] text-neutral-400 block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900">Rs. {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <hr className="border-neutral-100" />

              {/* Bill totals */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-neutral-900">Rs. {cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Standard Shipping</span>
                  <span className={`font-semibold ${isFreeShipping ? 'text-green-600' : 'text-neutral-900'}`}>
                    {isFreeShipping ? 'FREE' : `Rs. ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {!isFreeShipping && amountUntilFree > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-600 font-medium bg-brand-50 rounded-lg px-3 py-2">
                    <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Add Rs. {amountUntilFree.toFixed(2)} more to get FREE shipping!</span>
                  </div>
                )}
                {isFreeShipping && (
                  <div className="flex items-center gap-1.5 text-[11px] text-green-700 font-medium bg-green-50 rounded-lg px-3 py-2">
                    <PartyPopper className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>You've unlocked FREE shipping!</span>
                  </div>
                )}
                <hr className="border-neutral-50 my-1" />
                <div className="flex justify-between text-base font-semibold text-neutral-950">
                  <span>Grand Total</span>
                  <span className="text-lg">Rs. {totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-100 rounded-lg text-[11px] text-brand-700 flex items-start gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  <strong>Express Delivery:</strong> Orders under Rs. 2,500 have a flat Rs. 200 shipping fee. Orders of Rs. 2,500+ ship FREE! Delivery within 2-4 business days.
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      {/* Confirm Order Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 animate-fade-in">
          <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-7 text-center space-y-5 animate-scale-in">
            <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-light font-serif text-neutral-900">Confirm Your Order</h3>
              <p className="text-sm text-neutral-500 font-light">
                Are you sure you want to place this order for{" "}
                <span className="font-semibold text-neutral-900">Rs. {totalCost.toFixed(2)}</span>?
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3.5 text-left border border-neutral-100 space-y-2">
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm gap-2">
                    <div>
                      <span className="text-neutral-900 font-medium">
                        {item.product.name}
                        <span className="text-neutral-400 font-normal"> x{item.quantity}</span>
                      </span>
                      {item.selectedShade && (
                        <span className="text-neutral-400 text-xs block">Shade: {item.selectedShade.name}</span>
                      )}
                    </div>
                    <span className="font-semibold text-neutral-900 whitespace-nowrap">
                      Rs. {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="border-neutral-200" />
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Items:</span>
                <span className="font-semibold text-neutral-900">{cartCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Payment Method:</span>
                <span className="font-semibold text-neutral-900">Cash on Delivery</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="btn-pill py-3 text-sm font-semibold border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              >
                No, Go Back
              </button>
              <button
                type="button"
                onClick={confirmOrder}
                disabled={isSubmitting}
                className="btn-pill py-3 text-sm font-semibold text-white border-2 border-neutral-950 bg-neutral-950 hover:bg-neutral-800"
              >
                {isSubmitting ? "Placing..." : "Yes, Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}