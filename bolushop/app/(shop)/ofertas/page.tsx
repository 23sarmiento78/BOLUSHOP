import { getAllCollections } from "@/lib/db";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Ofertas y descuentos",
    description: "Explorá ofertas y descuentos en regalos originales y accesorios para el hogar en BoluShop Argentina.",
    path: "/ofertas",
});

export const dynamic = "force-dynamic";

const gradients = [
    "from-[#0f2044] to-[#1a3a6b]",
    "from-[#4a1b0c] to-[#993c1d]",
    "from-[#173404] to-[#3b6d11]",
    "from-[#26215c] to-[#534ab7]",
];

export default async function OfertasPage() {
    const collections = await getAllCollections();

    return (
        <main className="min-h-screen bg-[#f7f7f7]">
            <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-10 md:py-14 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-4 text-xs text-white/70">
                        <Link href="/" className="hover:text-white">Inicio</Link>
                        <ChevronRight size={14} />
                        <span>Ofertas y descuentos</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-3">Ofertas y descuentos</h1>
                    <p className="max-w-3xl text-sm md:text-base text-white/80">
                        Promociones curadas para cada estilo y ocasión, con precios especiales y envío gratis.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                {collections.length === 0 ? (
                    <div className="text-center py-16 rounded-[1.5rem] bg-white border border-[#e2e8f0]">
                        <p className="text-[#64748b] font-medium">Próximamente nuevas ofertas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {collections.map((coll, index) => (
                            <Link key={coll.id} href={`/oferta/${coll.slug}`} className="group">
                                <article className="h-full rounded-[1.75rem] overflow-hidden border border-[#e2e8f0] bg-white shadow-sm transition hover:shadow-lg">
                                    <div className="flex h-full flex-col">
                                        <div
                                            className={`min-h-[220px] p-8 flex flex-col justify-end gap-4 bg-gradient-to-br ${gradients[index % gradients.length]}`}
                                        >
                                            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white font-semibold">
                                                {coll.discountType && coll.discountType !== "none"
                                                    ? coll.discountType === "percentage"
                                                        ? `${coll.discountValue}% OFF`
                                                        : `$${coll.discountValue} OFF`
                                                    : "Oferta"}
                                            </span>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                                                    {coll.name}
                                                </h2>
                                                <p
                                                    className="text-sm text-white/80 leading-relaxed max-w-full overflow-hidden"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {coll.description || "Selección exclusiva con descuento especial."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white px-6 py-5 border-t border-[#eef2f7] flex items-center justify-between gap-4">
                                            <span className="text-xs text-[#64748b] flex items-center gap-2">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-[#0f2044]" />
                                                {(coll.productIds || []).length} productos
                                            </span>
                                            <span className="text-xs font-bold text-[#e8630a]">Ver oferta →</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
