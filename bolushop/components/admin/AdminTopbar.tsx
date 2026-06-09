"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, ExternalLink } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/products": "Productos",
    "/admin/categories": "Categorías",
    "/admin/collections": "Colecciones",
    "/admin/blog": "Blog",
    "/admin/orders": "Pedidos",
    "/admin/mercado-libre": "Mercado Libre",
    "/admin/newsletter": "Newsletter",
    "/admin/settings": "Configuración",
    "/admin/upload": "Importar datos",
};

function getPageTitle(pathname: string): string {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    const match = Object.entries(PAGE_TITLES).find(([path]) => path !== "/admin" && pathname.startsWith(path));
    return match ? match[1] : "Admin";
}

export default function AdminTopbar() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);
    const today = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <header className="admin-topbar">
            <div className="min-w-0 pl-12 lg:pl-0">
                <p className="text-[11px] text-[#94a3b8] capitalize hidden sm:block">{today}</p>
                <h1 className="text-base md:text-lg font-semibold text-[#0a1628] truncate" style={{ fontFamily: "var(--font-fraunces)" }}>
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Link
                    href="/"
                    target="_blank"
                    className="admin-btn admin-btn-ghost !py-2 !px-3 hidden sm:inline-flex"
                >
                    <ExternalLink size={14} />
                    Tienda
                </Link>
                <button
                    className="w-9 h-9 rounded-xl border border-[#e2e8f0] bg-[#f8f9fb] flex items-center justify-center text-[#94a3b8] hover:text-[#0a1628] hover:bg-white transition-colors"
                    aria-label="Notificaciones"
                >
                    <Bell size={16} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-[#0a1628] flex items-center justify-center text-white text-xs font-bold">
                    A
                </div>
            </div>
        </header>
    );
}
