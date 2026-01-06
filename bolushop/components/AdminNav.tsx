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
                fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-all duration-500 ease-in-out
                w-80 bg-white border-r border-gray-100 flex flex-col h-screen shadow-2xl lg:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="p-10">
                    <Link href="/" target="_blank" className="group block">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                                B
                            </div>
                            <div className="flex flex-col">
                                <h1 className="font-black text-2xl tracking-tighter leading-none text-gray-900">
                                    Bolu<span className="text-primary italic">Shop</span>
                                </h1>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Control Center</span>
                            </div>
                        </div>
                    </Link>
                    <div className="mt-6 flex items-center gap-2 p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-primary transition-colors cursor-pointer group">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">Sistema Operativo</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow px-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-4">Módulos Principales</p>
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center justify-between group px-5 py-4 rounded-[1.5rem] font-bold text-sm transition-all duration-300
                                    ${isActive
                                        ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20 scale-[1.02]'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={isActive ? 'font-black' : 'font-bold'}>{link.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} className="text-primary" />}
                            </Link>
                        )
                    })}
                </div>

                {/* Footer Section */}
                <div className="p-8 mt-auto">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-8 -mt-8" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80 mb-1">Status</p>
                            <h4 className="font-black text-sm mb-4">Servidor Online</h4>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 py-2.5 px-4 rounded-xl hover:bg-white/20 transition-all text-center justify-center"
                            >
                                Ver Tienda <ExternalLink size={12} />
                            </Link>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                        BoluShop Master v2.6.0
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
