"use client";

import { useState } from "react";
import { subscribeToNewsletterAction } from "@/app/actions/shop";
import { toast } from "sonner";
import { Mail, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await subscribeToNewsletterAction(email);
            toast.success("¡Gracias por suscribirte!");
            setEmail("");
        } catch {
            toast.error("Hubo un error al suscribirte. Intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section aria-label="Suscripción al newsletter" className="w-full px-4 sm:px-6 py-10 md:py-14 bg-[#faf9f7]">
            <div className="container-shop">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e8e4df] bg-white shadow-[0_20px_60px_rgba(10,22,40,0.06)]">
                    {/* Decoración de fondo */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ff6b35]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#f5c842]/15 blur-3xl" />

                    <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10 md:p-10 lg:p-12">
                        {/* Texto */}
                        <div className="min-w-0">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff8f0] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ff6b35]">
                                <Sparkles size={13} />
                                Club Exclusivo
                            </div>

                            <h2
                                className="mb-3 text-2xl font-semibold leading-tight text-[#0a1628] sm:text-3xl md:text-[2rem]"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Unite al Club{" "}
                                <span className="text-gradient">Exclusivo</span>
                            </h2>

                            <p className="max-w-md text-sm leading-relaxed text-[#64748b] sm:text-base">
                                Recibí ofertas relámpago, nuevos lanzamientos y consejos de organización en tu inbox.
                                Sin spam, solo calidad.
                            </p>

                            <div className="mt-5 hidden flex-wrap gap-4 text-xs text-[#94a3b8] sm:flex">
                                <span className="flex items-center gap-1.5">
                                    <Zap size={13} className="text-[#ff6b35]" /> Ofertas exclusivas
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={13} className="text-[#ff6b35]" /> 1 email por semana
                                </span>
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="w-full min-w-0">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <label htmlFor="newsletter-email" className="sr-only">
                                    Tu correo electrónico
                                </label>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                    <div className="relative min-w-0 flex-1">
                                        <Mail
                                            size={16}
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                                            aria-hidden
                                        />
                                        <input
                                            id="newsletter-email"
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            placeholder="tu@email.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            className="w-full min-w-0 rounded-xl border border-[#e8e4df] bg-[#faf9f7] py-3.5 pl-11 pr-4 text-sm text-[#0a1628] outline-none transition placeholder:text-[#94a3b8] focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 disabled:opacity-60"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#e85a28] disabled:opacity-60 sm:w-auto"
                                    >
                                        {isLoading ? "Enviando..." : "Suscribirme"}
                                        {!isLoading && <ArrowRight size={16} />}
                                    </button>
                                </div>
                                <p className="text-center text-[11px] leading-relaxed text-[#94a3b8] sm:text-left">
                                    Respetamos tu privacidad. Desuscribite cuando quieras.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
