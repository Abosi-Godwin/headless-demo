"use client";

import { useState } from "react";
import { useCart } from "../../../stores/cartStore";

interface Variant {
    id: string;
    title: string;
    price: {
        amount: string;
        currencyCode: string;
    };
}

export function ProductForm({
    variants,
    productTitle,
    mainImage
}: {
    variants: Variant[];
    productTitle: string;
    mainImage: string;
}) {
    const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            variantId: selectedVariant.id,
            productTitle,
            variantTitle: selectedVariant.title,
            price: selectedVariant.price.amount,
            currencyCode: selectedVariant.price.currencyCode,
            image: mainImage,
        });
    };

    return (
        <div className="mt-6">
            <p className="font-mono text-xl text-foreground/80 mb-6">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}{" "}
                <span className="text-sm text-foreground/50">{selectedVariant.price.currencyCode}</span>
            </p>

            {variants.length > 1 && (
                <div className="mb-8">
                    <span className="font-mono text-xs tracking-widest uppercase text-foreground/60 block mb-3">
                        Select Option
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {variants.map((variant) => {
                            const isSelected = selectedVariant.id === variant.id;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`py-2 px-4 font-mono text-xs tracking-wider uppercase border transition-all ${
                                        isSelected
                                            ? "border-foreground bg-foreground text-background"
                                            : "border-border-soft bg-transparent text-foreground hover:border-foreground/50"
                                    }`}
                                >
                                    {variant.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <button
                onClick={handleAddToCart}
                className="w-full bg-accent text-accent-foreground py-4 font-mono text-xs font-medium tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
                Add to Cart
            </button>
        </div>
    );
}