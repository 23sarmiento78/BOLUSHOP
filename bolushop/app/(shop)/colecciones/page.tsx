import { getAllCollections, getAllProducts } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Colecciones Exclusivas | BoluShop",
    description: "Descubrí nuestros packs y colecciones limitadas. Ofertas únicas en muebles, tecnología y hogar.",
};

export default async function CollectionsPage() {
    const collections = await getAllCollections();
    const allProducts = await getAllProducts(); // We need this to find cover images if not manual

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-950 text-white pt-32 pb-24">
                {/* Intro Hero */}
                <div className="container mx-auto px-6 mb-20 text-center relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[#ffe600] font-bold tracking-[0.2em] text-[10px] uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Experiencia Premium
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                        Nuestras <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 italic">Colecciones</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                        Cada pack cuenta una historia. Selecciones curadas por expertos para transformar tu estilo de vida con un solo click.
                    </p>
                </div>

                {/* Collections Bento Grid */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[500px]">
                        {collections.map((coll, idx) => {
                            // Smart Image Logic: Use collection image or fall back to first product image
                            let bgImage = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop";

                            if (coll.image && !coll.image.includes('icon.png')) {
                                bgImage = coll.image;
                            } else {
                                const productsInColl = allProducts.filter(p =>
                                    p.isActive !== false &&
                                    ((coll.productIds || []).includes(p.id) ||
                                        (p.collections || []).includes(coll.id) ||
                                        (p.collections || []).includes(coll.slug))
                                );
                                if (productsInColl.length > 0) bgImage = productsInColl[0].image;
                            }

                            // Bento Layout Logic: Varied span sizes for visual rhythm
                            // Pattern: Big (8) - Small (4) | Small (4) - Small (4) - Small (4) ...
                            const isBig = idx % 5 === 0 || idx % 5 === 3;
                            const spanClass = isBig ? "lg:col-span-8 md:col-span-2" : "lg:col-span-4 md:col-span-1";

                            return (
                                <Link
                                    key={coll.id}
                                    href={`/coleccion/${coll.slug}`}
                                    className={`relative group rounded-[2.5rem] overflow-hidden border border-white/10 ${spanClass} shadow-2xl hover:shadow-[#ffe600]/20 transition-shadow duration-500`}
                                >
                                    <Image
                                        src={bgImage}
                                        alt={coll.name}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105 filter brightness-75 group-hover:brightness-100"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end h-full">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {coll.isFeatured && (
                                                <span className="bg-[#ffe600] text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                                    Destacado
                                                </span>
                                            )}

                                            <h2 className={`font-black tracking-tight leading-[0.9] mb-4 text-white ${isBig ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                                                {coll.name}
                                            </h2>

                                            {/* Price/Offer badge if applicable */}
                                            {coll.discountType !== 'none' && (
                                                <div className="mb-6 inline-block">
                                                    <span className="text-emerald-400 font-bold text-sm uppercase tracking-wider border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 rounded-lg">
                                                        {coll.discountType === 'percentage' ? `${coll.discountValue}% OFF` : `Ahorrá $${coll.discountValue}`}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-gray-300 line-clamp-2 mb-8 text-sm md:text-base opacity-0 max-h-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-700 ease-out">
                                                {coll.description}
                                            </p>

                                            <div className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs group-hover:gap-6 transition-all border-b border-white/30 pb-1 group-hover:border-[#ffe600]">
                                                Ver Pack <span className="text-[#ffe600] text-lg">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Empty State */}
                        {collections.length === 0 && (
                            <div className="col-span-full h-96 flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-800 rounded-[3rem] bg-gray-900/50">
                                <p className="text-gray-500 mb-4 text-xl">Próximamente lanzaremos nuevas colecciones</p>
                                <Link href="/productos" className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                    Ver productos individuales
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
