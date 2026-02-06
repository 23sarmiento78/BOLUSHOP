"use client";

import { useState } from "react";
import { useHolidayTheme } from "@/lib/hooks/useHolidayTheme";
import { toast } from "sonner";

export default function NewsletterForm() {
    const { holiday, primary, secondary, icon } = useHolidayTheme();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error("Por favor ingresa un email válido");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("¡Suscripción exitosa! 🎉");
                setEmail("");
            } else {
                if (response.status === 409) {
                    toast.error("Este email ya está suscrito");
                } else {
                    toast.error(data.error || "Error al suscribirte");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Error al procesar la suscripción");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Background with gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: holiday
                        ? `linear-gradient(135deg, ${primary}, ${secondary})`
                        : 'linear-gradient(135deg, #0F172A, #1E293B)'
                }}
            />

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 p-10 md:p-16 lg:p-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Icon/Badge */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl mb-6">
                        <span className="text-3xl">{holiday ? icon : '📬'}</span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        {holiday ? (
                            <>No te pierdas las ofertas de <br className="hidden md:block" />{holiday.label}</>
                        ) : (
                            <>Enterate antes <br className="hidden md:block" />que nadie</>
                        )}
                    </h2>

                    {/* Description */}
                    <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        Suscribite y recibí ofertas exclusivas, lanzamientos anticipados y descuentos especiales directo en tu bandeja de entrada.
                    </p>

                    {/* Newsletter Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
                        <input
                            type="email"
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-4 rounded-full text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-full font-black text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? "Suscribiendo..." : "Suscribirme 🎁"}
                        </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Ofertas exclusivas</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Sin spam</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
                        <div className="flex items-center gap-2">
                            <span>✓</span>
                            <span>Cancelá cuando quieras</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
