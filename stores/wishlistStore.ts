import { create } from "zustand";
import toast from "react-hot-toast";

interface WishlistState {
    wishlistIds: string[];
    toggleWishlist: (id: string, title: string) => void;
    isWishlisted: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>((set, get) => ({
    wishlistIds: [],
    toggleWishlist: (id, title) => {
        const already = get().wishlistIds.includes(id);
        set(state => ({
            wishlistIds: already
                ? state.wishlistIds.filter(i => i !== id)
                : [...state.wishlistIds, id]
        }));
        toast.success(
            already
                ? `${title} removed from wishlist`
                : `${title} added to wishlist`
        );
    },
    isWishlisted: id => get().wishlistIds.includes(id)
}));
