import { getAllProducts } from "@/lib/db";
import { getRelatedProducts } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find(p => p.slug === slug);

    if (!product) {
        return {
            title: "Producto no encontrado | BoluShop",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.vercel.app';

    return {
        title: `${product.name} | BoluShop`,
        description: product.description.slice(0, 160),
        keywords: `${product.name}, ${product.category}, comprar online, argentina, envío gratis, ${product.features.join(', ')}`,
        openGraph: {
            type: 'website',
            url: `${siteUrl}/producto/${product.slug}`,
            title: `${product.name} - Comprá Online en BoluShop`,
            description: product.description,
            images: [{
                url: product.image,
                width: 800,
                height: 800,
                alt: product.name,
            }],
            siteName: 'BoluShop',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description.slice(0, 160),
            images: [product.image],
        },
    };
}

export async function generateStaticParams() {
    const products = await getAllProducts();
    return products
        .filter(p => p.isActive !== false)
        .map((product) => ({
            slug: product.slug,
        }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const products = await getAllProducts();
    const product = products.find(p => p.slug === slug);

    if (!product || product.isActive === false) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.id, product.category);

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
