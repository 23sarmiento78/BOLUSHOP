"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al suscribirse");
            }

            setStatus("success");
            setMessage("¡Gracias por suscribirte!");
            setEmail("");
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "Ocurrió un error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu mejor email..."
                    className="block w-full pl-12 pr-32 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm"
                    required
                    disabled={status === "loading" || status === "success"}
                />
                <div className="absolute inset-y-2 right-2">
                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="h-full px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {status === "loading" ? (
                            "Enviando..."
                        ) : status === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <>Unirme <ArrowRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
            {message && (
                <div className={`mt-3 text-sm font-medium flex items-center gap-2 ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {status === "success" ? <CheckCircle2 size={16} /> : null}
                    {message}
                </div>
            )}
        </form>
    );
}
