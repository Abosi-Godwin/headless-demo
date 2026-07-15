
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    variantId: string;
    productTitle: string;
    variantTitle: string;
    price: string;
    currencyCode: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    toggleCart: () => void;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (variantId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const addToCart = (newItem: Omit<CartItem, "quantity">) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.variantId === newItem.variantId);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.variantId === newItem.variantId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true); // Automatically open drawer when item is added
    };

    const removeFromCart = (variantId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
    };

    return (
        <CartContext.Provider value={{ cartItems, isCartOpen, toggleCart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
