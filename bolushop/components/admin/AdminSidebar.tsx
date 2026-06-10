"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    FolderTree,
    Layers,
    FileText,
    Truck,
    Package,
    Mail,
    Settings,
    Upload,
    Store,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Radar,
} from "lucide-react";

const NAV_SECTIONS = [
    {
        label: "General",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        label: "Catálogo",
        items: [
            { name: "Productos", href: "/admin/products", icon: ShoppingBag },
            { name: "Categorías", href: "/admin/categories", icon: FolderTree },
            { name: "Colecciones", href: "/admin/collections", icon: Layers },
            { name: "Mercado Libre", href: "/admin/mercado-libre", icon: Package, badge: "ML" },
            { name: "Product Scout", href: "/admin/meli/research", icon: Radar, badge: "AI" },
            { name: "Optimizados ML", href: "/admin/meli/optimized", icon: Package },
            { name: "CSV Dropers + IA", href: "/admin/upload", icon: Upload },
        ],
    },
    {
        label: "Ventas",
        items: [
            { name: "Pedidos", href: "/admin/orders", icon: Truck },
        ],
    },
    {
        label: "Contenido",
        items: [
            { name: "Blog", href: "/admin/blog", icon: FileText },
            { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
        ],
    },
    {
        label: "Sistema",
        items: [
            { name: "Configuración", href: "/admin/settings", icon: Settings },
        ],
    },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/admin/login");
        router.refresh();
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <>
            <div className="admin-sidebar-brand">
                <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#ff6b35] rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#ff6b35]/25">
                        B
                    </div>
                    <div>
                        <div className="font-semibold text-white text-[15px]" style={{ fontFamily: "var(--font-fraunces)" }}>
                            BoluShop
                        </div>
                        <div className="text-[10px] text-white/40 font-medium tracking-wide">Panel Admin</div>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-3">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.label}>
                        <div className="admin-nav-section">{section.label}</div>
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    className={`admin-nav-link ${active ? "active" : ""}`}
                                >
                                    <Icon size={17} />
                                    <span className="flex-1">{item.name}</span>
                                    {"badge" in item && item.badge && (
                                        <span className="text-[9px] font-bold bg-[#fff8e6] text-[#c47a00] px-1.5 py-0.5 rounded">
                                            {item.badge}
                                        </span>
                                    )}
                                    {active && <ChevronRight size={14} className="text-white/30" />}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-3 border-t border-white/6 space-y-1">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="admin-nav-link"
                >
                    <Store size={17} />
                    Ver tienda
                </Link>
                <button onClick={handleLogout} className="admin-nav-link w-full text-left !text-red-400 hover:!text-red-300 hover:!bg-red-500/10">
                    <LogOut size={17} />
                    Cerrar sesión
                </button>
            </div>
        </>
    );
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (mobileOpen) {
            setMobileOpen(false);
        }
    }, [pathname, mobileOpen]);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-center shadow-md"
                aria-label="Abrir menú"
            >
                <Menu size={20} className="text-[#0a1628]" />
            </button>

            {/* Desktop sidebar */}
            <aside className="admin-sidebar hidden lg:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="admin-sidebar-mobile lg:hidden">
                    <div className="admin-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
                    <aside className="admin-sidebar flex flex-col w-[280px] shadow-2xl">
                        <div className="flex justify-end p-3">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10"
                                aria-label="Cerrar menú"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <SidebarContent onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}
