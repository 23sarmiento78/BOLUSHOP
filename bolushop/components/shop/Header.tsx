"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { getCart } from "@/lib/cart";
import PromoBanner from "./PromoBanner";

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const updateCartCount = () => {
            const cart = getCart();
            setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
        };
        window.addEventListener("cartUpdated", updateCartCount);
        updateCartCount();
        return () => window.removeEventListener("cartUpdated", updateCartCount);
    }, []);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const navLinks = [
        { label: "Inicio", href: "/" },
        { label: "Productos", href: "/productos" },
        { label: "Colecciones", href: "/colecciones" },
        { label: "Blog", href: "/blog" },
    ];

    return (
        <>
            <PromoBanner />

            {/* Main nav */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "glass shadow-md py-2"
                        : "bg-[#faf9f7]/95 backdrop-blur-sm py-3 border-b border-[#e8e4df]/60"
                }`}
            >
                <div className="container-shop">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="w-10 h-10 bg-[#0a1628] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>B</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-semibold text-[#0a1628]" style={{ fontFamily: "var(--font-display)" }}>
                                    BoluShop
                                </div>
                                <div className="text-[11px] text-[#ff6b35] font-medium tracking-wide">Regalos & Hogar</div>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        pathname === link.href
                                            ? "bg-[#0a1628] text-white"
                                            : "text-[#64748b] hover:text-[#0a1628] hover:bg-white"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4 relative">
                            <input
                                type="search"
                                placeholder="Buscar regalos, hogar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Buscar productos"
                                className="w-full bg-white border border-[#e8e4df] rounded-full py-2.5 pl-4 pr-11 text-sm outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all"
                            />
                            <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0a1628]">
                                <Search size={17} />
                            </button>
                        </form>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/carrito"
                                aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} productos` : ""}`}
                                className="relative flex items-center justify-center w-10 h-10 bg-[#0a1628] text-white rounded-xl hover:bg-[#152238] transition-all hover:scale-105"
                            >
                                <ShoppingCart size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#ff6b35] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-glow">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                                className="lg:hidden p-2 text-[#0a1628] rounded-xl hover:bg-white"
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="md:hidden mt-3 relative">
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Buscar productos"
                            className="w-full bg-white border border-[#e8e4df] rounded-full py-2.5 pl-4 pr-11 text-sm outline-none focus:border-[#ff6b35]"
                        />
                        <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            <Search size={17} />
                        </button>
                    </form>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-[#faf9f7]/98 backdrop-blur-md top-[120px] overflow-y-auto">
                    <div className="container-shop py-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-5 py-3.5 rounded-2xl text-base font-medium transition-all ${
                                    pathname === link.href
                                        ? "bg-[#0a1628] text-white"
                                        : "text-[#64748b] hover:bg-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-4 border-[#e8e4df]" />
                        {[
                            { label: "Seguir pedido", href: "/rastreo" },
                            { label: "Contacto", href: "/contacto" },
                            { label: "Sobre nosotros", href: "/nosotros" },
                            { label: "Guías y FAQ", href: "/guias" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-5 py-3 text-sm text-[#64748b] hover:bg-white rounded-xl"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
