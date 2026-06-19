"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type Product, type Shade } from "@/lib/data";

export interface CartItem {
  product: Product;
  selectedShade: Shade | null;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, shade: Shade | null, quantity: number) => void;
  removeFromCart: (productId: string, shadeName: string | null) => void;
  updateQuantity: (productId: string, shadeName: string | null, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aura_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("aura_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, shade: Shade | null, quantity: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product._id === product._id &&
          ((!item.selectedShade && !shade) ||
            (item.selectedShade && shade && item.selectedShade.name === shade.name))
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, selectedShade: shade, quantity }];
    });
    setIsCartOpen(true); // Open the cart drawer when an item is added
  };

  const removeFromCart = (productId: string, shadeName: string | null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            ((!item.selectedShade && !shadeName) ||
              (item.selectedShade && item.selectedShade.name === shadeName))
          )
      )
    );
  };

  const updateQuantity = (productId: string, shadeName: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, shadeName);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        const matches =
          item.product._id === productId &&
          ((!item.selectedShade && !shadeName) ||
            (item.selectedShade && item.selectedShade.name === shadeName));
        return matches ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
