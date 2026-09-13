import TrackingPageClient from "./TrackingPageClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seguí tu Pedido | BoluShop Argentina",
    description: "Rastreá tu envío de BoluShop. Moto mensajería en CABA/GBA y Correo Argentino al interior. Ingresá tu número de pedido y consultá el estado de tu compra.",
};

export default function RastreoPage() {
    return (
        <>            <main className="min-h-screen bg-[#faf9f7]">
                <section className="hero-mesh text-white py-12 md:py-16">
                    <div className="container-shop">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Rastreo</span>
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Rastreo de Pedidos</h1>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                            Consultá el estado de tu envío y recibí información actualizada al instante.
                        </p>
                    </div>
                </section>

                <section className="container-shop py-10 md:py-14">
                    <div className="rounded-[1.75rem] border border-[#e8e4df] bg-white p-5 shadow-sm md:p-8">
                        <h2 className="text-2xl font-semibold text-[#0f2044] mb-6">Ingresá tu número de pedido</h2>
                        <TrackingPageClient />
                    </div>
                </section>
            </main>        </>
    );
}
