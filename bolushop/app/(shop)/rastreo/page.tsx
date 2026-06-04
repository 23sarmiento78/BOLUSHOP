import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import TrackingPageClient from "./TrackingPageClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seguí tu Pedido | BoluShop Argentina",
    description: "Rastreá tu envío de Correo Argentino o Andreani en tiempo real. Ingresá tu número de pedido y consultá el estado de tu compra en BoluShop.",
};

export default function RastreoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Rastreo</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Rastreo de Pedidos</h1>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                            Consultá el estado de tu envío y recibí información actualizada al instante.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8f9fb] p-8 shadow-card">
                        <h2 className="text-2xl font-black text-[#0f2044] mb-6">Ingresá tu número de pedido</h2>
                        <TrackingPageClient />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
