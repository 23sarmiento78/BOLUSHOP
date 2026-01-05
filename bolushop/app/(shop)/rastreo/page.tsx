import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import TrackingPageClient from "./TrackingPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seguí tu Pedido | BoluShop",
    description: "Consultá el estado de tu compra en tiempo real.",
};

export default function RastreoPage() {
    return (
        <>
            <Header />
            <main className="relative min-h-screen pt-28 pb-12 px-4 overflow-hidden">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-105 blur-sm"
                    >
                        <source src="/videohero.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-sand-white/80 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10">
                    <TrackingPageClient />
                </div>
            </main>
            <Footer />
        </>
    );
}
