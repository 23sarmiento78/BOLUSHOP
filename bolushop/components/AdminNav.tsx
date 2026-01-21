"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Truck,
    Tags,
    Settings,
    Mail,
    FileUp,
    Menu,
    X,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

export default function AdminNav() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (pathname === '/admin/login') return null;

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Productos', icon: Package },
        { href: '/admin/categories', label: 'Categorías', icon: FolderTree },
        { href: '/admin/orders', label: 'Pedidos', icon: Truck },
        { href: '/admin/collections', label: 'Colecciones', icon: Tags },
        { href: '/admin/settings', label: 'Ajustes', icon: Settings },
        { href: '/admin/newsletter', label: 'Marketing', icon: Mail },
        { href: '/admin/upload', label: 'Importar CSV', icon: FileUp },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-[60]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">
                        B
                    </div>
                    <div className="font-black text-lg tracking-tighter text-gray-900">
                        Admin<span className="text-primary italic">Panel</span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2.5 bg-gray-50 text-gray-900 rounded-xl active:scale-95 transition-all"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className={`
                fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out
                w-72 bg-white border-r border-gray-100 flex flex-col h-screen
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="p-8">
                    <Link href="/" target="_blank" className="group block">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/10 transition-transform duration-300">
                                B
                            </div>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-xl tracking-tight leading-none text-gray-900">
                                    Bolu<span className="text-primary">Shop</span>
                                </h1>
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Admin</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 opacity-70">Menú Administrador</p>
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center justify-between group px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/15'
                                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                        <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                                    </div>
                                    <span className={isActive ? 'font-semibold' : 'font-medium'}>{link.label}</span>
                                </div>
                                {isActive && <ChevronRight size={14} className="opacity-70" />}
                            </Link>
                        )
                    })}
                </div>

                {/* Footer Section */}
                <div className="p-6 mt-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-primary rounded-2xl p-4 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-semibold text-xs mb-3">BoluShop v2.6</h4>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-white/10 py-2 rounded-lg hover:bg-white/20 transition-all text-center justify-center"
                            >
                                Ver Tienda <ExternalLink size={10} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
