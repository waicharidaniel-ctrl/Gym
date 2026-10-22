import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { CartItem, Supplement } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (supplement: Supplement, quantity?: number) => void;
  removeFromCart: (supplementId: string) => void;
  updateQuantity: (supplementId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((supplement: Supplement, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.supplement.id === supplement.id);
      if (existing) {
        return prev.map((i) =>
          i.supplement.id === supplement.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { supplement, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((supplementId: string) => {
    setItems((prev) => prev.filter((i) => i.supplement.id !== supplementId));
  }, []);

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.supplement.id !== supplementId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.supplement.id === supplementId ? { ...i, quantity } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.supplement.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
