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
            <main className="min-h-screen bg-gray-50 py-12 px-4">
                <TrackingPageClient />
            </main>
            <Footer />
        </>
    );
}
