"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

export default function Header() {
    const { count } = useCart();

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
                        <Image
                            src="/bolushop.png"
                            alt="BoluShop Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                        Bolu<span className="text-primary">Shop</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Inicio</Link>
                    <Link href="/categorias" className="text-gray-600 hover:text-primary font-medium transition-colors">Categorías</Link>
                    <Link href="/#viral" className="text-gray-600 hover:text-primary font-medium transition-colors">Virales</Link>
                </nav>

                {/* Cart & Mobile Menu Trigger */}
                <div className="flex items-center gap-4">
                    <Link href="/carrito" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {count > 0 && (
                            <span className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse-once">
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
