"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#deded4] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:p-6">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                    <Cookie size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ea] text-[#c8f31d]">
                            <Cookie size={20} />
                        </div>
                        <h4 className="text-lg font-semibold tracking-tight text-[#11110f]" style={{ fontFamily: "var(--font-display)" }}>Privacidad y Cookies</h4>
                    </div>

                    <p className="mb-5 text-sm leading-relaxed text-[#6d726a]">
                        En BoluShop cuidamos tu experiencia. Utilizamos cookies para personalizar anuncios y analizar nuestro tráfico según nuestra <Link href="/politica-de-privacidad" className="text-[#c8f31d] underline">Política de Privacidad</Link>.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 rounded-xl bg-[#11110f] py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#25251f] active:scale-95"
                        >
                            Aceptar Todo
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="rounded-xl bg-[#f5f3f0] px-4 text-[#6d726a] transition-colors hover:bg-[#deded4]"
                            aria-label="Cerrar aviso de cookies"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
