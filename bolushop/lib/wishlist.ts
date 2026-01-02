export interface WishlistItem {
    productId: string;
}

const WISHLIST_KEY = 'bolushop_wishlist';

export function getWishlist(): string[] {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
}

export function saveWishlist(wishlist: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
}

export function toggleWishlist(productId: string): boolean {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    let isAdded = false;

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
        isAdded = true;
    }

    saveWishlist(wishlist);
    return isAdded;
}

export function isInWishlist(productId: string): boolean {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}
