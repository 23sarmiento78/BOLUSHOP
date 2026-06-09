import { getAllCollections, getAllProducts } from "@/lib/db";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Colecciones Temáticas",
    description: "Explorá colecciones curadas de regalos originales y accesorios para el hogar en BoluShop Argentina.",
    path: "/colecciones",
});

export const dynamic = 'force-dynamic';

const gradients = [
    'from-[#0f2044] to-[#1a3a6b]',
    'from-[#4a1b0c] to-[#993c1d]',
    'from-[#173404] to-[#3b6d11]',
    'from-[#26215c] to-[#534ab7]',
];

export default async function CollectionsPage() {
    const collections = await getAllCollections();
    const allProducts = await getAllProducts();

    const getCollectionImage = (coll: any) => {
        if (coll.image && !coll.image.includes('icon.png')) return coll.image;
        if ((coll.productIds || []).length > 0) {
            const product = allProducts.find(p => coll.productIds.includes(p.id));
            if (product) return product.image;
        }
        return "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop";
    };

    return (
        <>
            <main className="min-h-screen bg-[#f7f7f7]">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-10 md:py-14 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-white/70">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Colecciones</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3">Nuestras colecciones</h1>
                        <p className="max-w-3xl text-sm md:text-base text-white/80">
                            Selecciones curadas para cada estilo y ocasión, con un look moderno y una experiencia de compra clara.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {collections.map((coll, index) => (
                            <Link
                                key={coll.id}
                                href={`/coleccion/${coll.slug}`}
                                className="group"
                            >
                                <article className="h-full rounded-[1.75rem] overflow-hidden border border-[#e2e8f0] bg-white shadow-sm transition hover:shadow-lg">
                                    <div className="flex h-full flex-col">
                                        <div className={`min-h-[220px] p-8 flex flex-col justify-end gap-4 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
                                            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white font-semibold">
                                                {coll.discountValue && coll.discountValue > 0 ? 'Destacada' : 'Colección'}
                                            </span>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">{coll.name}</h2>
                                                <p
                                                    className="text-sm text-white/80 leading-relaxed max-w-full overflow-hidden"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {coll.description || 'Selección exclusiva para cada ocasión.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white px-6 py-5 border-t border-[#eef2f7] flex items-center justify-between gap-4">
                                            <span className="text-xs text-[#64748b] flex items-center gap-2">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-[#0f2044]" />
                                                {(coll.productIds || []).length} productos
                                            </span>
                                            <span className="text-xs font-bold text-[#e8630a]">Ver colección →</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 rounded-[1.5rem] bg-[#fff9e6] border border-[#f0c040] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-[#f0c040] px-3 py-1 text-[11px] font-semibold text-[#7a4f00] uppercase tracking-[0.35em] mb-2">
                                Mercado Libre
                            </span>
                            <h2 className="text-xl md:text-2xl font-black text-[#0f2044]">Imperdibles seleccionados</h2>
                            <p className="text-sm text-[#64748b] mt-2 max-w-2xl">
                                Los mejores productos de ML con nuestro criterio de selección. Enlaces de afiliado con recomendaciones confiables.
                            </p>
                        </div>
                        <Link href="/productos?seccion=mercado-libre" className="btn btn-primary whitespace-nowrap">
                            Ver selección →
                        </Link>
                    </div>
                </section>
            </main>        </>
    );
}
