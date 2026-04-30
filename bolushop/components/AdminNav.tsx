"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Tag,
    Settings,
    Users,
    BarChart3,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Package,
    Store
} from "lucide-react";
import { useState } from "react";
import Logo from "./shop/Logo";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/products", icon: ShoppingBag },
    { name: "Mercado Libre", href: "/admin/mercado-libre", icon: Package },
    { name: "Pedidos", href: "/admin/pedidos", icon: Tag },
    { name: "Usuarios", href: "/admin/usuarios", icon: Users },
    { name: "Reseñas", href: "/admin/resenas", icon: MessageSquare },
    { name: "Estadísticas", href: "/admin/stats", icon: BarChart3 },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminNav() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-900"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 z-50
                w-72 bg-white border-r border-gray-100 flex flex-col
                transition-transform duration-500 ease-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 pb-12">
                    <Logo variant="full" />
                    <div className="mt-2 px-1">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
                    <div className="mb-6 px-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Módulos de Gestión</p>
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all
                                    ${isActive
                                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                                <span className="text-sm">{item.name}</span>
                                {item.name === "Mercado Libre" && !isActive && (
                                    <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-50">
                    <Link
                        href="/"
                        className="flex items-center gap-4 px-4 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                    >
                        <Store size={20} />
                        <span className="text-sm">Ver Tienda</span>
                    </Link>
                    <button className="flex items-center gap-4 px-4 py-4 w-full text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">
                        <LogOut size={20} />
                        <span className="text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}