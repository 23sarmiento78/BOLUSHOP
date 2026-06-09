import { getAllProducts, getProductReviews } from "@/lib/db";
import { getRelatedProducts } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/shop/JsonLd";
import type { Metadata } from "next";
import { buildPageMetadata, buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return buildPageMetadata({
            title: "Producto no encontrado",
            description: "El producto que buscás no está disponible en BoluShop.",
            path: `/producto/${slug}`,
            noIndex: true,
        });
    }

    const cleanDescription = product.description
        ? product.description.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim().slice(0, 160)
        : `${product.name} — regalo original con envío gratis a todo Argentina. Comprá en BoluShop con cuotas sin interés.`;

    return buildPageMetadata({
        title: `Comprar ${product.name}`,
        description: cleanDescription,
        path: `/producto/${product.slug}`,
        image: product.image,
        keywords: [product.name, product.category, "comprar online argentina", "bolushop"],
    });
}

export async function generateStaticParams() {
    const products = await getAllProducts();
    return products
        .filter((p) => p.isActive !== false)
        .map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product || product.isActive === false) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, product.category);
    const reviews = await getProductReviews(product.id);

    const structuredData = [
        buildProductJsonLd(product, reviews),
        buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: product.name, path: `/producto/${product.slug}` },
        ]),
    ];

    return (
        <>
            <JsonLd data={structuredData} />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />
        </>
    );
}
