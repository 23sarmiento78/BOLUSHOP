"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Package } from "lucide-react";
import { getCart } from "@/lib/cart";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const updateCartCount = () => {
            const cart = getCart();
            const count = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("cartUpdated", updateCartCount);
        updateCartCount(); // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHome
                ? "bg-white/90 backdrop-blur-md shadow-lg py-3"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                                B
                            </div>
                            <div className="flex flex-col -gap-1">
                                <span className={`font-black text-2xl tracking-tighter leading-none transition-colors ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}>
                                    BoluShop
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Premium Store</span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Search Center */}
                    <div className="hidden lg:flex flex-grow max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando hoy?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full rounded-2xl py-3 pl-6 pr-12 transition-all duration-300 outline-none border ${isScrolled || !isHome
                                    ? "bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 ring-primary/20 text-gray-900"
                                    : "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
                                    }`}
                            />
                            <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isScrolled || !isHome ? 'text-gray-400 hover:text-primary' : 'text-white/70 hover:text-white'}`}>
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 mr-6">
                        {[
                            { label: 'Productos', href: '/productos' },
                            { label: 'Rastreo', href: '/rastreo' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-black uppercase tracking-widest hover:text-primary transition-colors ${isScrolled || !isHome ? 'text-gray-600' : 'text-gray-200'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/carrito" className="relative group p-2">
                            <ShoppingCart
                                className={`w-6 h-6 transition-colors ${isScrolled || !isHome ? 'text-gray-900' : 'text-white group-hover:text-primary'
                                    }`}
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg scale-100 animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden p-2 transition-colors ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'}`}
                        >
                            {isMobileMenuOpen
                                ? <X />
                                : <Menu />
                            }
                        </button>

                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-2xl p-6 md:hidden animate-in slide-in-from-top-5">
                    <form onSubmit={handleSearch} className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl py-4 pl-4 pr-12 font-medium outline-none focus:ring-2 ring-primary/20"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </button>
                    </form>

                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-900 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            🏠 Inicio
                        </Link>
                        <Link
                            href="/productos"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-900 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            📦 Productos
                        </Link>
                        <Link
                            href="/rastreo"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-900 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            🚚 Rastreo de Pedido
                        </Link>
                        <Link
                            href="/carrito"
                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-900 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            🛒 Mi Carrito ({cartCount})
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
