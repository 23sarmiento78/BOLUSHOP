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
        <section aria-label="Suscripción al newsletter" className="w-full px-4 sm:px-6 py-10 md:py-14 bg-[#f4f4ed]">
            <div className="container-shop">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#deded4] bg-white shadow-[0_20px_60px_rgba(10,22,40,0.06)]">
                    {/* Decoración de fondo */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c8f31d]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#bca7ff]/15 blur-3xl" />

                    <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10 md:p-10 lg:p-12">
                        {/* Texto */}
                        <div className="min-w-0">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff8f0] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c8f31d]">
                                <Sparkles size={13} />
                                Club Exclusivo
                            </div>

                            <h2
                                className="mb-3 text-2xl font-semibold leading-tight text-[#11110f] sm:text-3xl md:text-[2rem]"
                                style={{ fontFamily: "var(--font-display)" }}
                            >
                                Unite al Club{" "}
                                <span className="text-gradient">Exclusivo</span>
                            </h2>

                            <p className="max-w-md text-sm leading-relaxed text-[#6d726a] sm:text-base">
                                Recibí ofertas relámpago, nuevos lanzamientos y consejos de organización en tu inbox.
                                Sin spam, solo calidad.
                            </p>

                            <div className="mt-5 hidden flex-wrap gap-4 text-xs text-[#8d9388] sm:flex">
                                <span className="flex items-center gap-1.5">
                                    <Zap size={13} className="text-[#c8f31d]" /> Ofertas exclusivas
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={13} className="text-[#c8f31d]" /> 1 email por semana
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
                                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8d9388]"
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
                                            className="w-full min-w-0 rounded-xl border border-[#deded4] bg-[#f4f4ed] py-3.5 pl-11 pr-4 text-sm text-[#11110f] outline-none transition placeholder:text-[#8d9388] focus:border-[#c8f31d] focus:ring-2 focus:ring-[#c8f31d]/20 disabled:opacity-60"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#c8f31d] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#e85a28] disabled:opacity-60 sm:w-auto"
                                    >
                                        {isLoading ? "Enviando..." : "Suscribirme"}
                                        {!isLoading && <ArrowRight size={16} />}
                                    </button>
                                </div>
                                <p className="text-center text-[11px] leading-relaxed text-[#8d9388] sm:text-left">
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
