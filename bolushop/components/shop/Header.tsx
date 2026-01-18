"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Package } from "lucide-react";
import { getCart } from "@/lib/cart";
import Logo from "./Logo";

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
        <>
            {/* Top Info Bar */}
            <div className={`fixed top-0 left-0 right-0 z-[60] py-2 px-4 transition-all duration-500 overflow-hidden ${isScrolled || !isHome ? 'bg-black text-white' : 'bg-white/10 backdrop-blur-md text-white border-b border-white/10'
                }`}>
                <div className="container mx-auto">
                    <div className="flex items-center justify-center gap-6 whitespace-nowrap animate-marquee">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                            IMPORTANTE: Al comprar, esperá la redirección y confirmá por WhatsApp
                        </span>
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em] opacity-30">|</span>
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em]">Envíos a todo el país</span>
                        <span className="hidden md:inline text-[10px] font-black uppercase tracking-[0.2em] opacity-30">|</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Soporte 24/7 vía WhatsApp</span>
                    </div>
                </div>
            </div>

            <header
                className={`fixed left-0 right-0 z-50 transition-all duration-500 ${isScrolled || !isHome
                    ? "bg-white/80 backdrop-blur-xl shadow-2xl py-4 top-[34px]"
                    : "bg-transparent py-8 md:py-10 top-[40px]"
                    }`}
            >
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="relative z-50 group">
                            <Logo size={40} className={isScrolled || !isHome ? 'text-gray-900' : 'text-white'} />
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
                                <button type="submit" aria-label="Buscar" className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isScrolled || !isHome ? 'text-gray-400 hover:text-primary' : 'text-white/70 hover:text-white'}`}>
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
                            <Link href="/carrito" aria-label="Ver carrito" className="relative group p-2">
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
                                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
                    <div
                        className="fixed inset-0 top-[70px] bg-white/95 backdrop-blur-lg z-50 md:hidden animate-in fade-in slide-in-from-right-full duration-500 ease-out"
                        style={{ height: 'calc(100vh - 70px)' }}
                    >
                        <div className="p-6 h-full overflow-y-auto">
                            <form onSubmit={handleSearch} className="mb-8 relative group">
                                <input
                                    type="text"
                                    placeholder="¿Qué estás buscando?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-6 pr-14 font-bold outline-none focus:ring-4 ring-primary/10 transition-all"
                                />
                                <button type="submit" aria-label="Buscar" className="absolute right-5 top-1/2 -translate-y-1/2 text-primary">
                                    <Search size={24} />
                                </button>
                            </form>

                            <nav className="flex flex-col gap-3">
                                {[
                                    { label: '🏠 Inicio', href: '/' },
                                    { label: '📦 Productos', href: '/productos' },
                                    { label: '🚚 Rastreo de Pedido', href: '/rastreo' },
                                    { label: '🛒 Mi Carrito', href: '/carrito', suffix: `(${cartCount})` }
                                ].map((item, idx) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-primary hover:text-white font-black text-lg transition-all active:scale-95 group"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <span>{item.label} {item.suffix}</span>
                                        <span className="text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-12 p-8 bg-primary rounded-[2.5rem] text-white text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Ayuda Directa</p>
                                <a href="https://wa.me/3541237972" className="text-xl font-black block mb-2">WhatsApp 24/7</a>
                                <p className="text-sm opacity-80">Estamos online para ayudarte</p>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
