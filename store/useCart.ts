// frontend/store/useCart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type CartItemInput = Pick<CartItem, 'id' | 'name' | 'price'>;

interface CartState {
  items: CartItem[];
  addItem: (product: CartItemInput) => void;
  removeItem: (id: string) => void;
  getTotalItems: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: 'thai-market-storage' } // This saves the cart in the browser's localStorage
  )
);