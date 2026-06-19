"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, ShoppingBag, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartCount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    // Simulate order placement database submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Generate a beautiful, realistic cosmetics order ID
      setOrderNumber("AURA-" + Math.floor(100000 + Math.random() * 900000));
      clearCart();
    }, 2000);
  };

  const shippingCost = cartSubtotal > 50 ? 0 : 5.99;
  const taxCost = cartSubtotal * 0.08; // 8% sales tax
  const totalCost = cartSubtotal + shippingCost + taxCost;

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-stone-50/50 py-16 sm:py-24 px-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-neutral-100 rounded-lg shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-600 font-bold">Order Confirmed</span>
              <h2 className="text-2xl font-light font-serif text-neutral-900">Thank you for your order!</h2>
              <p className="text-sm text-neutral-500 font-light">
                Your payment was processed successfully. We are preparing your cosmetics for express shipment.
              </p>
            </div>

            <div className="bg-neutral-50 rounded p-4 text-left border border-neutral-100 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Order Number:</span>
                <span className="font-semibold text-neutral-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Delivery Estimate:</span>
                <span className="font-semibold text-neutral-900">2-4 Business Days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Notification:</span>
                <span className="font-semibold text-brand-600">SMS / Email sent</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="w-full inline-block py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium transition text-sm rounded shadow"
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
      <Header />
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
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="Sarah"
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
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="Parker"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                      placeholder="sarah.parker@example.com"
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
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                      placeholder="123 Luxury Ave, Apt 4B"
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
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Secure Payment Details */}
                <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h3 className="text-lg font-medium text-neutral-950 font-serif flex items-center gap-1.5">
                      <CreditCard className="w-5 h-5 text-brand-600" /> Secure Card Payment
                    </h3>
                    <span className="text-[10px] text-green-600 font-bold tracking-widest uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> encrypted
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                      placeholder="Sarah Parker"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        maxLength={5}
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">CVV / CVC</label>
                      <input
                        type="password"
                        name="cardCvc"
                        required
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-brand-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition rounded ${
                    isSubmitting || cart.length === 0
                      ? "bg-neutral-300 text-neutral-400 cursor-not-allowed shadow-none"
                      : "bg-brand-600 hover:bg-brand-700 hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? "Encrypting & Placing Order..." : `Place Order • Rs. ${totalCost.toFixed(2)}`}
                </button>
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
                        <div className="w-12 h-14 bg-stone-100 rounded overflow-hidden relative flex-shrink-0">
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
                  <span className="font-semibold text-neutral-900">
                    {shippingCost === 0 ? "FREE" : `Rs. ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-neutral-900">Rs. {taxCost.toFixed(2)}</span>
                </div>
                <hr className="border-neutral-50 my-1" />
                <div className="flex justify-between text-base font-semibold text-neutral-950">
                  <span>Grand Total</span>
                  <span className="text-lg">Rs. {totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-100 rounded text-[11px] text-brand-700 flex items-start gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  <strong>Free Express Shipping:</strong> You qualify for free express shipping. Standard delivery occurs within 2-4 business days.
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
