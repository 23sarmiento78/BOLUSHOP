import { searchProducts } from "@/app/actions/shop";
import ProductCard from "@/components/shop/ProductCard";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export const metadata = buildPageMetadata({
    title: "Buscar productos",
    description: "Encontrá regalos originales y accesorios para el hogar en BoluShop.",
    path: "/buscar",
    noIndex: true,
});

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: Props) {
    const params = await searchParams;
    const query = (params.q || "").trim();
    const results = query ? await searchProducts(query) : [];

    return (
        <main className="min-h-screen bg-[#faf9f7] py-12 md:py-16">
            <div className="container-shop">
                <div className="mb-10 max-w-3xl">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-10 bg-[#ff6b35]" />
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6b35]">Catálogo</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#0a1628] md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                        {query ? <>Resultados para <span className="text-[#ff6b35]">“{query}”</span></> : "Buscar productos"}
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-[#64748b] md:text-base">
                        {query ? `${results.length} resultado${results.length === 1 ? "" : "s"} encontrado${results.length === 1 ? "" : "s"}.` : "Buscá por nombre, categoría o tipo de producto."}
                    </p>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                        {results.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-[#e8e4df] bg-white px-6 py-16 text-center shadow-sm md:px-12">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ea] text-[#ff6b35]"><Search size={24} /></div>
                        <h2 className="text-2xl font-semibold text-[#0a1628]" style={{ fontFamily: "var(--font-display)" }}>
                            {query ? "No encontramos ese producto" : "¿Qué estás buscando?"}
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#64748b]">
                            {query ? `No hay productos que coincidan con “${query}”. Probá con otros términos o explorá el catálogo.` : "Escribí una búsqueda desde el encabezado para encontrar productos rápidamente."}
                        </p>
                        <Link href="/productos" className="btn btn-primary mt-8">
                            Ver catálogo <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
