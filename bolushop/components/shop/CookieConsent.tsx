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
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                    <Cookie size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Cookie size={20} />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Privacidad y Cookies</h4>
                    </div>

                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                        En BoluShop cuidamos tu experiencia. Utilizamos cookies para personalizar anuncios y analizar nuestro tráfico según nuestra <Link href="/politica-de-privacidad" className="text-primary underline">Política de Privacidad</Link>.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                        >
                            Aceptar Todo
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="px-6 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
