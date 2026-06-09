import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowLeft, Search } from "lucide-react";

export const metadata = buildPageMetadata({
    title: "Página no encontrada",
    description: "La página que buscás no existe o fue movida. Volvé al inicio de BoluShop para seguir explorando regalos y accesorios para el hogar.",
    path: "/404",
    noIndex: true,
});

export default function NotFound() {
    return (
        <>
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-8xl font-bold text-[#e8e4df] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    404
                </p>
                <h1 className="text-2xl font-semibold text-[#0a1628] mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Página no encontrada
                </h1>
                <p className="text-[#64748b] mb-8">
                    La página que buscás no existe o fue movida. Probá buscar en nuestro catálogo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="btn btn-primary">
                        <ArrowLeft size={16} /> Volver al inicio
                    </Link>
                    <Link href="/productos" className="btn btn-outline">
                        <Search size={16} /> Ver productos
                    </Link>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}
