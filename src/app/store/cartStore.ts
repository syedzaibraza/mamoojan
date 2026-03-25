import { create } from "zustand";
import type { Product } from "../data/products";

interface CartItem {
  id: string; // unique line id (product + variation)
  product: Product;
  quantity: number;
  unitPrice: number;
  image: string;
  name: string;
  variationId?: string;
  variationAttributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      variation?: {
        id: string;
        price: number;
        image?: string;
        attributes: Record<string, string>;
      };
    },
  ) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  couponCode: "",
  discount: 0,

  addToCart: (product, options) => {
    const quantity = options?.quantity ?? 1;
    const variation = options?.variation;
    set((state) => {
      const lineId = `${product.id}:${variation?.id ?? "base"}`;
      const existing = state.items.find((i) => i.id === lineId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === lineId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }

      const unitPrice = variation?.price ?? product.price;
      const image = variation?.image ?? product.image;
      const name = product.name;
      return {
        items: [
          ...state.items,
          {
            id: lineId,
            product,
            quantity,
            unitPrice,
            image,
            name,
            variationId: variation?.id,
            variationAttributes: variation?.attributes,
          },
        ],
      };
    });
  },

  removeFromCart: (lineId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== lineId),
    }));
  },

  updateQuantity: (lineId, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((i) => i.id !== lineId),
      }));
      return;
    }

    set((state) => ({
      items: state.items.map((i) =>
        i.id === lineId ? { ...i, quantity } : i,
      ),
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
