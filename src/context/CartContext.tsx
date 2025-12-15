'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// 1. Define what a "Cart Item" looks like
export type CartItem = {
  id: string;          // Unique ID (Product ID + Variant String)
  productId: string;   // Sanity Document ID
  title: string;       // "The Karoo"
  price: number;       // Final price (Base + Modifiers)
  image: string;       // Image URL
  optionsText: string; // "Width: Skinny"
  quantity: number;
};

// 2. Define the Actions available
interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('knots_cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('knots_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  // Logic: Add Item
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === newItem.id);
      if (existing) {
        // Increment quantity if it already exists
        return current.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Add new item
      return [...current, { ...newItem, quantity: 1 }];
    });
    setIsOpen(true); // Auto-open cart when adding
  };

  // Logic: Remove Item
  const removeItem = (id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  };

  // Calculate Total
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        total,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use the cart easily
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};