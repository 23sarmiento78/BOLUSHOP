import { getAllProducts, getAllCategories } from "@/lib/db";
import ProductCard from "@/components/shop/ProductCard";
import JsonLd from "@/components/shop/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import FaqSection from "@/components/shop/FaqSection";
import type { Metadata } from "next";
import {
    buildPageMetadata,
    buildBreadcrumbJsonLd,
    buildFaqJsonLd,
    buildItemListJsonLd,
} from "@/lib/seo";
import {
    getLandingPageBySlug,
    LANDING_PAGES,
    landingPath,
} from "@/lib/landing-pages";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const landing = getLandingPageBySlug(slug);

    if (!landing) {
        return buildPageMetadata({
            title: "Página no encontrada",
            description: "La página que buscás no está disponible.",
            path: landingPath(slug),
            noIndex: true,
        });
    }

    return buildPageMetadata({
        title: landing.title,
        description: landing.metaDescription,
        path: landingPath(slug),
        keywords: landing.keywords,
    });
}

export default async function LandingPage({ params }: Props) {
    const { slug } = await params;
    const landing = getLandingPageBySlug(slug);

    if (!landing) {
        notFound();
    }

    const [products, categories] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
    ]);

    const landingProducts = landing.filterProducts(products, categories);
    const path = landingPath(slug);

    const structuredData = [
        buildFaqJsonLd(landing.faq),
        buildItemListJsonLd(
            landingProducts.map((p) => ({ name: p.name, slug: p.slug })),
            landing.title
        ),
        buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Regalos", path: "/regalos/originales-argentina" },
            { name: landing.breadcrumbLabel, path },
        ]),
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
                            <span className="text-white/90">{landing.breadcrumbLabel}</span>
                        </nav>

                        <h1
                            className="text-3xl md:text-5xl font-semibold leading-tight mb-4"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {landing.h1}
                        </h1>
                        <p className="text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
                            {landing.intro}
                        </p>
                    </div>
                </section>

                <section className="container-shop py-12 md:py-16">
                    <div className="max-w-3xl mb-10 space-y-4 text-sm md:text-base text-[#64748b] leading-relaxed">
                        {landing.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    {landingProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                            {landingProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <p className="text-[#64748b] mb-4">Estamos actualizando la selección.</p>
                            <Link href="/productos" className="btn btn-primary">Ver todos los productos</Link>
                        </div>
                    )}
                </section>

                <section className="bg-white border-t border-[#e8e4df]">
                    <div className="container-shop py-12 md:py-16 max-w-3xl">
                        <FaqSection faqs={landing.faq} />

                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link href="/productos" className="btn btn-primary">
                                Ver catálogo completo
                            </Link>
                            <Link href="/blog" className="btn btn-ghost">
                                Leer guías y tips
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
