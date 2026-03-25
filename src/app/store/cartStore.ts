import { create } from "zustand";
import type { Product } from "../data/products";

interface CartItem {
  product: Product;
  quantity: number;
  subscription?: boolean;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
  addToCart: (product: Product, quantity?: number, subscription?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: "",
  discount: 0,

  addToCart: (product, quantity = 1, subscription = false) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity, subscription: subscription || i.subscription }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity, subscription }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((i) => i.product.id !== productId),
      }));
      return;
    }

    set((state) => ({
      items: state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => {
    set(() => ({ items: [] }));
  },

  setCouponCode: (code) => {
    set(() => ({ couponCode: code }));
  },

  applyCoupon: () => {
    const code = get().couponCode.toUpperCase();
    if (code === "MAMOOJAN10" || code === "HEALTH10") {
      set(() => ({ discount: 10 }));
    } else if (code === "SAVE20") {
      set(() => ({ discount: 20 }));
    } else {
      set(() => ({ discount: 0 }));
    }
  },
}));

