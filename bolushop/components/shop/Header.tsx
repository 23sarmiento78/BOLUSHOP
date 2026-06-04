"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, Truck, CreditCard, Shield } from "lucide-react";
import { getCart } from "@/lib/cart";
import Logo from "./Logo";

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const updateCartCount = () => {
            const cart = getCart();
            const count = cart.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(count);
        };

        window.addEventListener("cartUpdated", updateCartCount);
        updateCartCount();

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
            setSearchQuery("");
        }
    };

    const navLinks = [
        { label: 'Inicio', href: '/' },
        { label: 'Productos', href: '/productos' },
        { label: 'Colecciones', href: '/colecciones' },
        { label: 'Blog', href: '/blog' },
    ];

    return (
        <>
            {/* Topbar con beneficios */}
            <div className="sticky top-0 z-40 bg-[#0f2044] text-white py-3 px-4 md:px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-sm md:text-base gap-4 md:gap-8">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Truck size={16} />
                        <span className="font-medium">Envío gratis en todos los productos</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 md:gap-3">
                        <CreditCard size={16} />
                        <span className="font-medium">Cuotas sin interés</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2 md:gap-3 ml-auto">
                        <Shield size={16} />
                        <span className="font-medium">Compra 100% protegida</span>
                    </div>
                </div>
            </div>

            {/* Header Principal */}
            <header className="sticky top-[34px] md:top-[42px] z-50 bg-white border-b border-[#f1f5f9] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-[#0f2044] rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-bold text-[#0f2044]">BoluShop</div>
                                <div className="text-sm text-[#e8630a]">Regalos & Hogar</div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8 mx-auto">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-semibold transition-colors ${
                                        pathname === link.href
                                            ? 'text-[#0f2044]'
                                            : 'text-[#64748b] hover:text-[#0f2044]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                            <form onSubmit={handleSearch} className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#f8f9fb] border border-[#e2e8f0] rounded-full py-3 pl-4 pr-12 text-sm outline-none focus:border-[#0f2044] transition-colors"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                                    <Search size={18} />
                                </button>
                            </form>
                        </div>

                        {/* Cart Button */}
                        <Link
                            href="/carrito"
                            className="relative flex items-center justify-center w-10 h-10 bg-[#0f2044] text-white rounded-md hover:bg-opacity-90 transition-all flex-shrink-0"
                        >
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#e8630a] text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-[#0f2044]"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden mt-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#f8f9fb] border border-[#e2e8f0] rounded-full py-3 pl-4 pr-12 text-sm outline-none focus:border-[#0f2044] transition-colors"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-white top-[90px] md:top-[100px] overflow-y-auto">
                    <div className="p-4 space-y-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-md text-base font-semibold transition-colors ${
                                    pathname === link.href
                                        ? 'bg-[#f8f9fb] text-[#0f2044] font-bold'
                                        : 'text-[#64748b] hover:bg-[#f8f9fb]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-3" />
                        <Link
                            href="/rastreo"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-md text-sm font-medium text-[#64748b] hover:bg-[#f8f9fb]"
                        >
                            Seguir pedido
                        </Link>
                        <Link
                            href="/contacto"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-md text-sm font-medium text-[#64748b] hover:bg-[#f8f9fb]"
                        >
                            Contacto
                        </Link>
                        <Link
                            href="/nosotros"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-md text-sm font-medium text-[#64748b] hover:bg-[#f8f9fb]"
                        >
                            Sobre nosotros
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
