"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from './data';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    total: number;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setItems(prev => {
            const currentTotal = prev.reduce((sum, item) => sum + item.quantity, 0);
            if (currentTotal >= 15) {
                alert("Has alcanzado el límite máximo de 15 productos por compra.");
                return prev;
            }

            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                // Also check if adding 1 exceeds limit
                if (currentTotal + 1 > 15) {
                    alert("Has alcanzado el límite máximo de 15 productos por compra.");
                    return prev;
                }
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => {
            const currentTotal = prev.reduce((sum, item) => sum + item.quantity, 0);

            // Check limits if adding
            if (delta > 0 && currentTotal + delta > 15) {
                alert("Has alcanzado el límite máximo de 15 productos por compra.");
                return prev;
            }

            return prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
