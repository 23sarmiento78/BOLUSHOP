"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminNav() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (pathname === '/admin/login') return null;

    const links = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/products', label: 'Productos', icon: '📦' },
        { href: '/admin/orders', label: 'Pedidos', icon: '🚚' },
        { href: '/admin/collections', label: 'Colecciones', icon: '🏷️' },
        { href: '/admin/settings', label: 'Ajustes', icon: '⚙️' },
        { href: '/admin/upload', label: 'Importar CSV', icon: '📥' },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
                <div className="font-black text-xl tracking-tighter">
                    Admin<span className="text-primary italic">Panel</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white/10 rounded-xl"
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300
                w-72 bg-gray-900 text-white flex flex-col h-screen
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-8 hidden lg:block">
                    <div className="font-black text-2xl tracking-tighter mb-1">
                        Admin<span className="text-primary italic">Panel</span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        BoluShop Management
                    </div>
                </div>

                <div className="flex-grow px-4 space-y-2 mt-4 lg:mt-0 overflow-y-auto">
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all
                                    ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className="text-xl">{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-8 border-t border-white/5">
                    <div className="bg-white/5 rounded-3xl p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Versión</div>
                        <div className="text-xs font-bold text-gray-300 italic">BoluShop v2.0 Premium</div>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
