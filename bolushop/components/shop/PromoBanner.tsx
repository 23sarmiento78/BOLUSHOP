"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, CreditCard, Shield, X } from "lucide-react";

const MESSAGES = [
    { icon: Truck, text: "Envío gratis en todos los productos", highlight: "Envío gratis" },
    { icon: CreditCard, text: "Hasta 12 cuotas sin interés", highlight: "cuotas sin interés" },
    { icon: Shield, text: "Compra 100% protegida", highlight: "protegida" },
];

export default function PromoBanner() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;
        const timer = setInterval(() => {
            setActiveIndex((i) => (i + 1) % MESSAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [dismissed]);

    if (dismissed) return null;

    const current = MESSAGES[activeIndex];
    const Icon = current.icon;

    return (
        <div className="relative z-50 overflow-hidden bg-[#0a1628] text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/20 via-transparent to-[#f5c842]/10" />

            <div className="container-shop relative flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden sm:justify-start sm:gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ff6b35]/20">
                        <Icon size={14} className="text-[#ff6b35]" />
                    </div>
                    <p className="truncate text-xs font-medium text-white/85 sm:text-sm">
                        <span className="hidden sm:inline">{current.text}</span>
                        <span className="sm:hidden">
                            <span className="font-bold text-[#ff8c5a]">{current.highlight}</span>
                            {" — "}BoluShop
                        </span>
                    </p>
                </div>

                <div className="hidden items-center gap-4 sm:flex">
                    <Link
                        href="/productos"
                        className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#ff6b35] hover:text-[#ff8c5a] transition-colors"
                    >
                        Ver ofertas →
                    </Link>
                    <button
                        onClick={() => setDismissed(true)}
                        aria-label="Cerrar banner"
                        className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <button
                    onClick={() => setDismissed(true)}
                    aria-label="Cerrar banner"
                    className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors sm:hidden"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Indicadores */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-0.5 sm:hidden">
                {MESSAGES.map((_, i) => (
                    <span
                        key={i}
                        className={`h-0.5 w-4 rounded-full transition-all ${
                            i === activeIndex ? "bg-[#ff6b35]" : "bg-white/20"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
