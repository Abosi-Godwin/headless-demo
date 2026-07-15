"use client";

import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { useCart } from "../../../stores/cartStore";

export function CartDrawer() {
    const { cartItems, isCartOpen, toggleCart, removeFromCart } = useCart();

    const subtotal = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
    );
    const currency = cartItems[0]?.currencyCode ?? "USD";

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={toggleCart}
            />

            <div className="relative w-full max-w-md bg-background h-full flex flex-col z-10 border-l border-border-soft">
                <div className="p-6 border-b border-border-soft flex justify-between items-center">
                    <h2 className="font-mono text-xs tracking-widest uppercase">
                        Cart Manifest
                    </h2>
                    <button
                        onClick={toggleCart}
                        className="hover:text-accent transition-colors"
                    >
                        <X size={16} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <p className="font-mono text-xs tracking-wide text-foreground/50 text-center pt-12">
                            No items issued yet.
                        </p>
                    ) : (
                        cartItems.map(item => (
                            <div
                                key={item.variantId}
                                className="flex gap-4 tear-line pt-4"
                            >
                                <div className="relative h-20 w-16 bg-paper overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.productTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-mono text-[9px] text-foreground/40 uppercase">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-medium uppercase tracking-wider line-clamp-1">
                                            {item.productTitle}
                                        </h4>
                                        <p className="text-[11px] text-foreground/50 uppercase tracking-widest mt-0.5">
                                            {item.variantTitle}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-xs text-foreground/70">
                                            {item.quantity} × $
                                            {parseFloat(item.price).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.variantId)
                                            }
                                            className="text-foreground/40 hover:text-accent transition-colors"
                                        >
                                            <Trash2
                                                size={14}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-border-soft bg-paper">
                        <div className="flex justify-between font-mono text-sm uppercase tracking-wider mb-4">
                            <span>Subtotal</span>
                            <span>
                                ${subtotal.toFixed(2)} {currency}
                            </span>
                        </div>
                        <p className="text-[11px] text-foreground/50 tracking-wide mb-4">
                            Taxes and shipping calculated at checkout.
                        </p>
                        <button className="w-full bg-accent text-accent-foreground font-mono text-xs tracking-widest uppercase py-4 hover:opacity-90 transition-opacity">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}