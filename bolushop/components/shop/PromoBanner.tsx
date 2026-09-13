"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

const MESSAGES = [
    "Envíos según las condiciones vigentes",
    "Productos elegidos para tu casa",
    "Pago online durante el checkout",
];

export default function PromoBanner() {
    const [index, setIndex] = useState(0);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (hidden) return;
        const timer = window.setInterval(() => setIndex((value) => (value + 1) % MESSAGES.length), 4500);
        return () => window.clearInterval(timer);
    }, [hidden]);

    if (hidden) return null;

    return (
        <div className="new-promo-bar">
            <div className="container-shop new-promo-inner">
                <span className="new-promo-dot" aria-hidden="true" />
                <span className="new-promo-message">{MESSAGES[index]}</span>
                <Link href="/ofertas" className="new-promo-link">Ver ofertas <ArrowUpRight size={14} /></Link>
                <button type="button" onClick={() => setHidden(true)} aria-label="Cerrar anuncio" className="new-promo-close"><X size={15} /></button>
            </div>
        </div>
    );
}
