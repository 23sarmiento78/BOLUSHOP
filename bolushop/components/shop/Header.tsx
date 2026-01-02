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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/90 backdrop-blur-md shadow-lg py-3"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 group">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
                                <Image
                                    src="/bolushop.png"
                                    alt="BoluShop Logo"
                                    fill
                                    priority
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className={`font-black text-2xl tracking-tighter transition-colors ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'
                                }`}>
                                Bolu<span className="text-primary italic">Shop</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation & Search */}
                    <div className={`hidden md:flex items-center gap-8 rounded-full px-6 py-2 border transition-all duration-300 ${isScrolled || !isHome
                        ? "bg-white/50 backdrop-blur-md border-gray-200/50"
                        : "bg-white/10 backdrop-blur-sm border-white/20"
                        }`}>
                        <nav className="flex gap-6">
                            {[
                                { label: 'Inicio', href: '/' },
                                { label: 'Productos', href: '/productos' },
                                { label: 'Rastreo', href: '/rastreo' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-bold uppercase tracking-wide hover:text-primary transition-colors ${isScrolled || !isHome ? 'text-gray-800' : 'text-gray-200'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className={`h-4 w-px ${isScrolled || !isHome ? 'bg-gray-300' : 'bg-gray-300/30'}`} />

                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-transparent outline-none text-sm w-24 focus:w-48 transition-all duration-300 placeholder:text-gray-400 ${isScrolled || !isHome ? 'text-gray-900' : 'text-white'
                                    }`}
                            />
                            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors">
                                <Search size={16} />
                            </button>
                        </form>
                    </div>

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
