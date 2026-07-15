import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export interface CartItem {
    variantId: string;
    productTitle: string;
    variantTitle: string;
    price: string;
    currencyCode: string;
    image: string;
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
    isCartOpen: boolean;
    toggleCart: () => void;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (variantId: string) => void;
}

export const useCart = create<CartState>()(
    persist(
        set => ({
            cartItems: [],
            isCartOpen: false,
            toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
            addToCart: newItem => {
                set(state => {
                    const existing = state.cartItems.find(
                        item => item.variantId === newItem.variantId
                    );
                    const cartItems = existing
                        ? state.cartItems.map(item =>
                              item.variantId === newItem.variantId
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item
                          )
                        : [...state.cartItems, { ...newItem, quantity: 1 }];
                    return { cartItems, isCartOpen: true };
                });
                toast.success(`${newItem.productTitle} issued to cart`);
            },
            removeFromCart: variantId =>
                set(state => ({
                    cartItems: state.cartItems.filter(
                        item => item.variantId !== variantId
                    )
                }))
        }),
        {
            name: "cart-store"
        }
    )
);

 