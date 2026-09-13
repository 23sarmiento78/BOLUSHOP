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

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMobileMenuOpen(false);
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMobileMenuOpen]);

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
        { label: "Ofertas", href: "/ofertas" },
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
                        : "bg-[#f4f4ed]/95 backdrop-blur-sm py-3 border-b border-[#deded4]/60"
                }`}
            >
                <div className="container-shop">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="w-10 h-10 bg-[#11110f] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>B</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-semibold text-[#11110f]" style={{ fontFamily: "var(--font-display)" }}>
                                    BoluShop
                                </div>
                                <div className="text-[11px] text-[#c8f31d] font-medium tracking-wide">Regalos & Hogar</div>
                            </div>
                        </Link>

                        <nav className="shop-desktop-nav hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        pathname === link.href
                                            ? "bg-[#11110f] text-white"
                                            : "text-[#6d726a] hover:text-[#11110f] hover:bg-white"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <form onSubmit={handleSearch} className="shop-desktop-search hidden md:flex flex-1 max-w-sm mx-4 relative">
                            <input
                                type="search"
                                placeholder="Buscar regalos, hogar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Buscar productos"
                                className="w-full bg-white border border-[#deded4] rounded-full py-2.5 pl-4 pr-11 text-sm outline-none focus:border-[#c8f31d] focus:ring-2 focus:ring-[#c8f31d]/20 transition-all"
                            />
                            <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d9388] hover:text-[#11110f]">
                                <Search size={17} />
                            </button>
                        </form>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/carrito"
                                aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} productos` : ""}`}
                                className="relative flex items-center justify-center w-10 h-10 bg-[#11110f] text-white rounded-xl hover:bg-[#25251f] transition-all hover:scale-105"
                            >
                                <ShoppingCart size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#c8f31d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse-glow">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-shop-menu"
                                className="shop-mobile-toggle lg:hidden p-2 text-[#11110f] rounded-xl hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8f31d]"
                            >
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="shop-mobile-search md:hidden mt-3 relative">
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Buscar productos"
                            className="w-full bg-white border border-[#deded4] rounded-full py-2.5 pl-4 pr-11 text-sm outline-none focus:border-[#c8f31d]"
                        />
                        <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d9388]">
                            <Search size={17} />
                        </button>
                    </form>
                </div>
            </header>

            {isMobileMenuOpen && (
                <div id="mobile-shop-menu" className="shop-mobile-menu lg:hidden fixed inset-x-0 bottom-0 z-40 bg-[#f4f4ed]/98 backdrop-blur-md top-[10rem] md:top-[7.5rem] overflow-y-auto border-t border-[#deded4]">
                    <div className="container-shop py-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-5 py-3.5 rounded-2xl text-base font-medium transition-all ${
                                    pathname === link.href
                                        ? "bg-[#11110f] text-white"
                                        : "text-[#6d726a] hover:bg-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-4 border-[#deded4]" />
                        {[
                            { label: "Seguir pedido", href: "/rastreo" },
                            { label: "Contacto", href: "/contacto" },
                            { label: "Sobre nosotros", href: "/nosotros" },
                            { label: "Guías y FAQ", href: "/guias" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-5 py-3 text-sm text-[#6d726a] hover:bg-white rounded-xl"
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
