"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, X, ArrowUpRight } from "lucide-react";
import { getCart } from "@/lib/cart";
import PromoBanner from "./PromoBanner";

export default function Header() {
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const update = () => setCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
        update();
        window.addEventListener("cartUpdated", update);
        return () => window.removeEventListener("cartUpdated", update);
    }, []);

    useEffect(() => setMenuOpen(false), [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const previous = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        router.push(`/buscar?q=${encodeURIComponent(query)}`);
        setSearchQuery("");
    };

    const navLinks = [
        { label: "Tienda", href: "/productos" },
        { label: "Ofertas", href: "/ofertas" },
        { label: "Ideas", href: "/blog" },
    ];

    return (
        <>
            <PromoBanner />
            <header className="new-site-header">
                <div className="container-shop new-header-main">
                    <Link href="/" className="new-brand" aria-label="BoluShop, inicio">
                        <span className="new-brand-mark">B</span>
                        <span className="new-brand-word">Bolu<span>Shop</span></span>
                    </Link>

                    <nav className="new-header-nav" aria-label="Navegación principal">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={pathname === link.href ? "is-active" : ""}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <form onSubmit={submitSearch} className="new-header-search new-header-search-desktop">
                        <Search size={17} aria-hidden="true" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="¿Qué estás buscando?" aria-label="Buscar productos" />
                        <kbd>⌘ K</kbd>
                    </form>

                    <div className="new-header-actions">
                        <Link href="/carrito" className="new-cart-button" aria-label={`Carrito${cartCount ? `, ${cartCount} productos` : ""}`}>
                            <ShoppingCart size={19} />
                            {cartCount > 0 && <span>{cartCount}</span>}
                        </Link>
                        <button type="button" className="new-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="new-mobile-menu" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
                            {menuOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </div>

                <div className="container-shop new-header-search-mobile-wrap">
                    <form onSubmit={submitSearch} className="new-header-search">
                        <Search size={17} aria-hidden="true" />
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar productos" aria-label="Buscar productos" />
                    </form>
                </div>
            </header>

            {menuOpen && (
                <div id="new-mobile-menu" className="new-mobile-menu" role="dialog" aria-modal="true">
                    <div className="new-mobile-menu-inner container-shop">
                        <p className="new-mobile-kicker">Explorá BoluShop</p>
                        {navLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={18} /></Link>)}
                        <div className="new-mobile-divider" />
                        {[{ label: "Seguir pedido", href: "/rastreo" }, { label: "Contacto", href: "/contacto" }, { label: "Sobre nosotros", href: "/nosotros" }].map((link) => <Link key={link.href} href={link.href} className="new-mobile-secondary">{link.label}<ArrowUpRight size={16} /></Link>)}
                    </div>
                </div>
            )}
        </>
    );
}
