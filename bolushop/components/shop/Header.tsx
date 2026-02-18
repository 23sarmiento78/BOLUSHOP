"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { getCart } from "@/lib/cart";
import Logo from "./Logo";
import { getCurrentHoliday, HolidayConfig } from "@/lib/holidays";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [holiday, setHoliday] = useState<HolidayConfig | null>(null);
    const [hasInternational, setHasInternational] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        // Load holiday client-side to avoid hydration mismatch
        setHoliday(getCurrentHoliday());

        // Check for international products
        fetch('/api/products')
            .then(res => res.json())
            .then(products => {
                const international = products.some((p: any) => p.isInternational && p.isActive !== false);
                setHasInternational(international);
            })
            .catch(() => setHasInternational(false));

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const updateCartCount = () => {
            const cart = getCart();
            const count = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("cartUpdated", updateCartCount);
        updateCartCount();

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

    // Theme logic
    const themeColor = holiday ? holiday.colors.primary : '#ffe600'; // Default yellow
    const themeIcon = holiday ? holiday.icon : '⚡';

    return (
        <>
            {/* Top Bar (Only visible at very top) */}
            <div className={`fixed top-0 inset-x-0 z-[60] h-9 flex items-center justify-center transition-transform duration-500 overflow-hidden bg-black text-white ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="flex gap-8 animate-marquee whitespace-nowrap text-[10px] font-bold tracking-[0.2em] uppercase">
                    <span>🇦🇷 Envíos a todo el país</span>
                    <span className="opacity-30">|</span>
                    <span>💳 Pagá en cuotas sin interés</span>
                    <span className="opacity-30">|</span>
                    <span>{holiday ? `${holiday.icon} Temporada de ${holiday.label}` : '🚀 Nueva Colección 2026'}</span>
                </div>
            </div>

            {/* Floating Island Header */}
            <header
                className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex justify-center ${isScrolled
                    ? "top-4 px-4"
                    : "top-12 px-6"
                    }`}
            >
                <div
                    className={`relative w-full max-w-7xl rounded-[2rem] transition-all duration-500 flex items-center justify-between px-6 md:px-8 ${isScrolled || !isHome
                        ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/5 py-3 border border-white/40"
                        : "bg-transparent py-4 border border-transparent"
                        }`}
                    style={isScrolled && holiday ? { borderColor: holiday.colors.secondary, boxShadow: `0 10px 40px -10px ${holiday.colors.secondary}40` } : {}}
                >
                    {/* Logo & Holiday Badge */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="relative z-10 hover:scale-105 transition-transform">
                            <Logo size={32} className={(isScrolled || !isHome) ? 'text-black' : 'text-white'} />
                        </Link>
                        {holiday && (
                            <div
                                className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all ${(isScrolled || !isHome) ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'
                                    }`}
                            >
                                <span className="text-sm">{holiday.icon}</span>
                                {holiday.label}
                            </div>
                        )}
                    </div>

                    {/* Desktop Center Nav */}
                    <nav className="hidden lg:flex items-center gap-1 bg-black/5 backdrop-blur-sm p-1.5 rounded-full border border-white/10 mx-auto absolute left-1/2 -translate-x-1/2">
                        {[
                            { label: 'Inicio', href: '/' },
                            { label: 'Colecciones', href: '/colecciones' },
                            { label: 'Productos', href: '/productos' },
                            ...(hasInternational ? [{ label: 'Compra Internacional', href: '/internacional' }] : []),
                        ].map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${pathname === link.href
                                    ? 'bg-white text-black shadow-lg'
                                    : (isScrolled || !isHome ? 'text-gray-600 hover:text-black hover:bg-white/50' : 'text-white/80 hover:text-white hover:bg-white/10')
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right UI (Search, Cart, Mobile Menu) */}
                    <div className="flex items-center gap-3">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)} // Open menu to search for now, could be a modal
                            className={`p-2.5 rounded-full transition-all ${isScrolled || !isHome
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            <Search size={18} />
                        </button>

                        <Link
                            href="/carrito"
                            className={`relative p-2.5 rounded-full transition-all group ${isScrolled || !isHome
                                ? 'bg-black text-white hover:bg-gray-800' // Always dark button for contrast
                                : 'bg-white text-black hover:bg-gray-100' // Always light button on dark bg
                                }`}
                            style={cartCount > 0 && holiday ? { backgroundColor: holiday.colors.primary, color: 'white' } : {}}
                        >
                            <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in spin-in-12">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-1 transition-transform active:scale-90 ${isScrolled || !isHome ? 'text-black' : 'text-white'}`}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay with Holiday Theme */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col animate-in fade-in duration-300">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <Logo size={32} className="text-black" />
                        <button onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-black">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSearch} className="mb-10 relative">
                            <input
                                type="text"
                                placeholder="¿Qué buscás hoy?"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl py-5 pl-6 pr-14 text-lg font-bold outline-none transition-all"
                                style={holiday ? { caretColor: themeColor } : {}}
                            />
                            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={22} />
                            </button>
                        </form>

                        <div className="space-y-2">
                            {[
                                { label: 'Inicio', href: '/', icon: '🏠' },
                                { label: 'Colecciones VIP', href: '/colecciones', icon: themeIcon },
                                { label: 'Todos los Productos', href: '/productos', icon: '📦' },
                                ...(hasInternational ? [{ label: 'Compra Internacional', href: '/internacional', icon: '🌎' }] : []),
                                { label: 'Seguir mi Pedido', href: '/rastreo', icon: '🚚' },
                            ].map((item, i) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-6 p-5 rounded-[2rem] hover:bg-gray-50 text-2xl font-black tracking-tight transition-all active:scale-95 text-gray-900 group"
                                >
                                    <span className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {holiday && (
                            <div className="mt-10 p-6 rounded-3xl relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${holiday.colors.primary}, ${holiday.colors.secondary})` }}>
                                <div className="relative z-10 text-white">
                                    <p className="font-bold text-xs uppercase tracking-widest opacity-80 mb-2">Evento Especial</p>
                                    <p className="text-3xl font-black">{holiday.label}</p>
                                    <p className="mt-2 text-sm font-medium opacity-90">{holiday.message}</p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 text-9xl opacity-20 rotate-12">{holiday.icon}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
