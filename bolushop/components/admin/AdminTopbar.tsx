"use client";

import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";

interface Props {
    onMenuOpen: () => void;
}

export default function AdminTopbar({ onMenuOpen }: Props) {
    const today = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <header className="admin-topbar">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onMenuOpen}
                    className="admin-topbar-menu lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu size={20} />
                </button>
                <div className="min-w-0">
                    <p className="text-[11px] text-[#94a3b8] capitalize truncate hidden sm:block">{today}</p>
                    <p className="text-sm font-semibold text-[#0a1628] lg:hidden truncate">Panel Admin</p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-ghost !py-2 !px-3"
                >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">Tienda</span>
                </Link>
                <div className="w-9 h-9 rounded-xl bg-[#0a1628] flex items-center justify-center text-white text-xs font-bold">
                    A
                </div>
            </div>
        </header>
    );
}
