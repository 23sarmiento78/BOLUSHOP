"use client";

import { useState } from "react";
import { subscribeToNewsletterAction } from "@/app/actions/shop";
import { toast } from "sonner";
import { Mail, ArrowRight } from "lucide-react";

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
        } catch (error) {
            toast.error("Hubo un error al suscribirte. Intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="container mx-auto px-4 py-24">
            <div className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-primary/20">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8 backdrop-blur-md">
                        <Mail className="text-white w-10 h-10" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                        Unuite al Club <span className="text-secondary italic">Exclusivo</span>
                    </h2>
                    <p className="text-white/70 text-lg md:text-xl font-medium mb-12">
                        Recibí ofertas relámpago, nuevos lanzamientos y consejos de organización directamente en tu inbox. Sin spam, solo calidad.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Tu mejor correo electrónico"
                            required
                            className="flex-grow bg-white/10 border-2 border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-secondary transition-all outline-none backdrop-blur-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-secondary text-primary font-black uppercase tracking-widest text-sm px-10 py-5 rounded-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 disabled:opacity-50"
                        >
                            {isLoading ? "Enviando..." : "Suscribirme"}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                    <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mt-8">
                        Respetamos tu privacidad. Desuscribite cuando quieras.
                    </p>
                </div>
            </div>
        </section>
    );
}
