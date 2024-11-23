import { create } from 'zustand'
import { Course } from '@/types/types'

interface WishlistState {
    wishlist: Course[];
    addToWishlist: (course: Course) => void;
    removeFromWishList: (courseId: number) => void;
    isInWishlist: (courseId: number) => boolean
}

export const useWishlistStore = create<WishlistState>(
    (set, get) => ({
        wishlist: [],
        addToWishlist: (course) =>
            set((state) => ({ wishlist: [...state.wishlist, course] })),
        removeFromWishList: (courseId) =>
            set((state) => ({ wishlist: state.wishlist.filter((c) => c.id !== courseId) })),
        isInWishlist: (courseId) =>
            get().wishlist.some((c) => c.id === courseId)
    })
)