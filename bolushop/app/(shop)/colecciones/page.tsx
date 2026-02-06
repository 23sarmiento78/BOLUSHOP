import { getAllCollections, getAllProducts } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { Metadata } from "next";
import { getHolidayById, getCurrentHoliday } from "@/lib/holidays";

export const metadata: Metadata = {
    title: "Colecciones Temáticas | BoluShop",
    description: "Explorá nuestras colecciones temáticas curadas especialmente para cada ocasión.",
};

export default async function CollectionsPage() {
    const collections = await getAllCollections();
    const allProducts = await getAllProducts();
    const currentHoliday = getCurrentHoliday();

    const getCollectionImage = (coll: any) => {
        if (coll.image && !coll.image.includes('icon.png')) return coll.image;
        if ((coll.productIds || []).length > 0) {
            const product = allProducts.find(p => coll.productIds.includes(p.id));
            if (product) return product.image;
        }
        return "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop";
    };

    const getProductCount = (coll: any) => {
        return (coll.productIds || []).length;
    };

    // Sort: Holiday Collections FIRST
    const sortedCollections = [...collections].sort((a, b) => {
        const aIsHoliday = a.holiday && a.holiday !== 'none' ? 1 : 0;
        const bIsHoliday = b.holiday && b.holiday !== 'none' ? 1 : 0;
        return bIsHoliday - aIsHoliday;
    });

    return (
        <div className="bg-sand-white min-h-screen">
            <Header />

            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <div className="container mx-auto px-6 mb-16">
                    <div className="text-center max-w-4xl mx-auto">
                        {currentHoliday && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6" style={{
                                backgroundColor: `${currentHoliday.colors.primary}20`,
                                border: `2px solid ${currentHoliday.colors.primary}40`
                            }}>
                                <span className="text-2xl">{currentHoliday.icon}</span>
                                <span className="text-sm font-black uppercase tracking-wider" style={{ color: currentHoliday.colors.text }}>
                                    Edición Especial {currentHoliday.label}
                                </span>
                            </div>
                        )}

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Colecciones <br className="hidden md:block" />
                            <span className="italic" style={{ color: currentHoliday?.colors.primary || '#D4AF37' }}>Temáticas</span>
                        </h1>

                        <p className="text-xl text-gray-600 font-medium leading-relaxed">
                            Curaduría exclusiva de productos pensados para cada momento especial de tu vida.
                        </p>
                    </div>
                </div>

                {/* Collections Grid */}
                <div className="container mx-auto px-4">
                    {sortedCollections.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-3xl shadow-sm">
                            <p className="text-gray-400 text-xl font-bold">Aún no hay colecciones disponibles.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedCollections.map((coll) => {
                                const holidayTheme = getHolidayById(coll.holiday || 'none');
                                const bgImage = getCollectionImage(coll);
                                const productCount = getProductCount(coll);
                                const hasDiscount = coll.discountValue && coll.discountValue > 0;

                                return (
                                    <Link
                                        key={coll.id}
                                        href={`/coleccion/${coll.slug}`}
                                        className="group"
                                    >
                                        <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                            {/* Image Section */}
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <Image
                                                    src={bgImage}
                                                    alt={coll.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    unoptimized
                                                />

                                                {/* Gradient Overlay */}
                                                <div
                                                    className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-40"
                                                    style={{
                                                        background: holidayTheme
                                                            ? `linear-gradient(to bottom, ${holidayTheme.colors.primary}00, ${holidayTheme.colors.primary}99)`
                                                            : 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))'
                                                    }}
                                                />

                                                {/* Top Badges */}
                                                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                                                    {/* Holiday Badge */}
                                                    {holidayTheme && (
                                                        <div
                                                            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md"
                                                            style={{
                                                                backgroundColor: `${holidayTheme.colors.secondary}E6`,
                                                                color: holidayTheme.colors.text
                                                            }}
                                                        >
                                                            {holidayTheme.icon} {holidayTheme.label}
                                                        </div>
                                                    )}

                                                    {/* Discount Badge */}
                                                    {hasDiscount && (
                                                        <div
                                                            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ml-auto"
                                                            style={{
                                                                backgroundColor: holidayTheme?.colors.primary || '#D4AF37',
                                                                color: '#000'
                                                            }}
                                                        >
                                                            {coll.discountType === 'percentage' ? `-${coll.discountValue}%` : `$${coll.discountValue}`}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Count */}
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                                        <span className="text-gray-900 font-black text-sm">{productCount}</span>
                                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                                                            {productCount === 1 ? 'Producto' : 'Productos'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-8">
                                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                                                    style={holidayTheme ? {
                                                        backgroundImage: `linear-gradient(to right, ${holidayTheme.colors.primary}, ${holidayTheme.colors.secondary})`
                                                    } : {
                                                        backgroundImage: 'linear-gradient(to right, #000, #555)'
                                                    }}
                                                >
                                                    {coll.name}
                                                </h2>

                                                {/* Description with line clamp */}
                                                <p className="text-gray-600 font-medium leading-relaxed mb-6 line-clamp-3">
                                                    {coll.description || "Descubrí esta selección exclusiva de productos curados especialmente para vos."}
                                                </p>

                                                {/* CTA Button */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <span className="text-sm font-black uppercase tracking-wider text-gray-900">
                                                        Ver Colección
                                                    </span>
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                                        style={{
                                                            backgroundColor: holidayTheme?.colors.primary || '#000',
                                                            color: '#fff'
                                                        }}
                                                    >
                                                        →
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 container mx-auto px-4">
                    <div
                        className="relative rounded-[3rem] overflow-hidden shadow-2xl"
                        style={{
                            background: currentHoliday
                                ? `linear-gradient(135deg, ${currentHoliday.colors.primary}, ${currentHoliday.colors.secondary})`
                                : 'linear-gradient(135deg, #0F172A, #1E293B)'
                        }}
                    >
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '30px 30px'
                            }} />
                        </div>

                        <div className="relative z-10 p-12 md:p-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                ¿Buscás algo más específico?
                            </h2>
                            <p className="text-white/90 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                                Explorá nuestro catálogo completo con cientos de productos para todas las ocasiones.
                            </p>
                            <Link
                                href="/productos"
                                className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                Ver Catálogo Completo
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
