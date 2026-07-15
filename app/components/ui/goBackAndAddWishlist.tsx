"use client";

import { useRouter } from "next/navigation";
import { Heart, CircleArrowLeft } from "lucide-react";
import { useWishlist } from "../../../stores/wishlistStore";

export function GoBackAndWishlist({
    productId,
    productTitle
}: {
    productId: string;
    productTitle: string;
}) {
    const router = useRouter();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const wishlisted = isWishlisted(productId);

    return (
        <div className="flex justify-between items-center mb-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase hover:text-accent transition-colors"
            >
                <CircleArrowLeft size={18} strokeWidth={1.5} />
                Back
            </button>
            <button
                onClick={() => toggleWishlist(productId, productTitle)}
                className="hover:text-accent transition-colors"
            >
                <Heart
                    size={18}
                    strokeWidth={1.5}
                    className={wishlisted ? "fill-accent text-accent" : ""}
                />
            </button>
        </div>
    );
}