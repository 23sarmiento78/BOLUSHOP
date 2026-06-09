"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { subscribeToNewsletterAction } from "@/app/actions/shop";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            await subscribeToNewsletterAction(email);
            setStatus("success");
            setMessage("¡Gracias por suscribirte!");
            setEmail("");
        } catch (error: unknown) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Ocurrió un error");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="blog-newsletter-email" className="sr-only">
                    Tu correo electrónico
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <Mail
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                            aria-hidden
                        />
                        <input
                            id="blog-newsletter-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            disabled={status === "loading" || status === "success"}
                            className="w-full min-w-0 rounded-xl border border-[#e8e4df] bg-white py-3.5 pl-11 pr-4 text-sm text-[#0a1628] outline-none transition placeholder:text-[#94a3b8] focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 disabled:opacity-60"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0a1628] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#152238] disabled:opacity-60 sm:w-auto"
                    >
                        {status === "loading" ? (
                            "Enviando..."
                        ) : status === "success" ? (
                            <>
                                <CheckCircle2 size={16} /> ¡Listo!
                            </>
                        ) : (
                            <>
                                Unirme <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
                {message && (
                    <p
                        className={`text-sm font-medium ${
                            status === "success" ? "text-[#10b981]" : "text-[#ef4444]"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
