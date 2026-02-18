import { Product } from './types';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
    isCollection?: boolean;
    isInternational?: boolean;
}

const CART_KEY = 'bolushop_cart';

export function getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
}

export function addToCart(product: Product, quantity: number = 1): void {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            slug: product.slug,
            isInternational: product.isInternational
        });
    }

    saveCart(cart);
}

export function addCollectionToCart(collection: any, products: any[], totalPrice: number): void {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === collection.id && item.isCollection);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: collection.id,
            name: `Pack: ${collection.name}`,
            price: totalPrice,
            quantity: 1,
            image: collection.image || (products.length > 0 ? products[0].image : "/icon.png"),
            slug: collection.slug,
            isCollection: true
        });
    }

    saveCart(cart);
}

export function removeFromCart(productId: string): void {
    const cart = getCart();
    const newCart = cart.filter(item => item.productId !== productId);
    saveCart(newCart);
}

export function updateQuantity(productId: string, quantity: number): void {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

export function clearCart(): void {
    saveCart([]);
}

export function getCartTotal(): number {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount(): number {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}
