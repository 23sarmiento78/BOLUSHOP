import { getCategoryBySlug, getAllCategories, getAllProducts } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import JsonLd from "@/components/shop/JsonLd";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import type { Metadata } from "next";
import {
    buildPageMetadata,
    buildBreadcrumbJsonLd,
    buildCollectionPageJsonLd,
    buildFaqJsonLd,
} from "@/lib/seo";
import {
    getCategoryLongContent,
    getCategoryMetaDescription,
    getCategoryTitle,
} from "@/lib/category-content";
import { getProductsByCategory, categoryPath } from "@/lib/category-utils";
import { COMMON_FAQ } from "@/lib/faqs";
import FaqSection from "@/components/shop/FaqSection";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = await getAllCategories();
    return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return buildPageMetadata({
            title: "Categoría no encontrada",
            description: "La categoría que buscás no está disponible en BoluShop.",
            path: `/categoria/${slug}`,
            noIndex: true,
        });
    }

    const products = await getAllProducts();
    const categoryProducts = getProductsByCategory(products, category);

    return buildPageMetadata({
        title: getCategoryTitle(category),
        description: getCategoryMetaDescription(category, categoryProducts.length),
        path: categoryPath(category.slug),
        keywords: [
            category.name,
            `comprar ${category.name.toLowerCase()} online`,
            `${category.name.toLowerCase()} argentina`,
            "envio gratis",
            "bolushop",
        ],
        image: category.image || "/icon.png",
    });
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const [products, allCategories] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
    ]);

    const categoryProducts = getProductsByCategory(products, category);
    const longContent = getCategoryLongContent(category, categoryProducts.length);
    const relatedCategories = allCategories
        .filter((c) => c.id !== category.id)
        .slice(0, 4);

    const categoryFaqs = [
        ...COMMON_FAQ,
        {
            question: `¿Cuántos productos de ${category.name.toLowerCase()} tienen disponibles?`,
            answer: `Actualmente tenemos ${categoryProducts.length} productos de ${category.name.toLowerCase()} disponibles en BoluShop con envío a todo Argentina.`,
        },
    ];

    const structuredData = [
        buildCollectionPageJsonLd(
            category.name,
            getCategoryMetaDescription(category, categoryProducts.length),
            categoryPath(category.slug),
            categoryProducts.map((p) => ({ name: p.name, slug: p.slug }))
        ),
        buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: category.name, path: categoryPath(category.slug) },
        ]),
        buildFaqJsonLd(categoryFaqs),
    ];

    return (
        <>
            <JsonLd data={structuredData} />
            <main className="min-h-screen bg-[#faf9f7]">
                <section className="hero-mesh text-white py-10 md:py-14">
                    <div className="container-shop">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs text-white/60">
                            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                            <ChevronRight size={12} className="text-white/30" />
                            <Link href="/productos" className="hover:text-white transition-colors">Productos</Link>
                            <ChevronRight size={12} className="text-white/30" />
                            <span className="text-white/90">{category.name}</span>
                        </nav>

                        <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1] mb-3">Categoría</p>
                        <h1
                            className="text-3xl md:text-5xl font-semibold leading-tight mb-4"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {category.name}
                        </h1>
                        {category.description?.trim() && (
                            <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
                                {category.description.trim()}
                            </p>
                        )}
                        <p className="mt-4 text-sm text-white/50">
                            {categoryProducts.length} producto{categoryProducts.length !== 1 ? "s" : ""} disponible{categoryProducts.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16">
                    {categoryProducts.length === 0 ? (
                        <div className="card text-center py-16">
                            <p className="text-[#64748b] mb-6">
                                No hay productos en esta categoría por el momento.
                            </p>
                            <Link href="/productos" className="btn btn-primary">
                                Ver todos los productos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                            {categoryProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="bg-white border-t border-[#e8e4df]">
                    <div className="container-shop py-12 md:py-16">
                        <div className="max-w-3xl">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#0a1628] mb-6" style={{ fontFamily: "var(--font-display)" }}>
                                Comprar {category.name.toLowerCase()} online en BoluShop
                            </h2>
                            <div className="space-y-4 text-sm md:text-base text-[#64748b] leading-relaxed">
                                {longContent.map((paragraph, i) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-3xl">
                            {[
                                { icon: Truck, label: "Envío gratis", desc: "A todo Argentina" },
                                { icon: CreditCard, label: "Cuotas sin interés", desc: "Con Mercado Pago" },
                                { icon: ShieldCheck, label: "Compra protegida", desc: "Garantía BoluShop" },
                            ].map(({ icon: Icon, label, desc }) => (
                                <div key={label} className="flex items-center gap-3 p-4 rounded-2xl bg-[#faf9f7] border border-[#e8e4df]">
                                    <Icon size={20} className="text-[#ff6b35] shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#0a1628]">{label}</p>
                                        <p className="text-xs text-[#94a3b8]">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {relatedCategories.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] mb-4">
                                    Otras categorías
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {relatedCategories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={categoryPath(cat.slug)}
                                            className="inline-flex px-4 py-2 rounded-full text-sm font-medium bg-[#faf9f7] border border-[#e8e4df] text-[#0a1628] hover:border-[#ff6b35]/40 hover:text-[#ff6b35] transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        <FaqSection
                            faqs={categoryFaqs}
                            title={`Preguntas frecuentes sobre ${category.name.toLowerCase()}`}
                            className="mt-12 max-w-3xl"
                        />
                    </div>
                </section>
            </main>
        </>
    );
}
