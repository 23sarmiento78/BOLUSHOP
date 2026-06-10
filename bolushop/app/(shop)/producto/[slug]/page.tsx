import { getAllProducts, getProductReviews, getAllCategories } from "@/lib/db";
import { getRelatedProducts } from "@/app/actions/shop";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/shop/JsonLd";
import type { Metadata } from "next";
import { buildPageMetadata, buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { categoryPath, resolveCategorySlug } from "@/lib/category-utils";
import type { Product } from "@/lib/types";

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
    let products: Product[] = [];
    let product: Product | undefined;

    try {
        products = await getAllProducts();
        product = products.find((p) => p.slug === slug);
    } catch (error) {
        console.error('Error loading products:', error);
        notFound();
    }

    if (!product || product.isActive === false) {
        notFound();
    }

    let relatedProducts: Product[] = [];
    let reviews: any[] = [];
    let categories: any[] = [];
    let categoryHref = '/productos';

    try {
        relatedProducts = await getRelatedProducts(product.id, product.category);
    } catch (e) {
        relatedProducts = [];
    }
    
    try {
        reviews = await getProductReviews(product.id);
    } catch (e) {
        reviews = [];
    }
    
    try {
        categories = await getAllCategories();
        categoryHref = categoryPath(resolveCategorySlug(product.category, categories));
    } catch (e) {
        categoryHref = '/productos';
    }

    const structuredData: any[] = [];
    try {
        structuredData.push(
            buildProductJsonLd(product, reviews),
            buildBreadcrumbJsonLd([
                { name: "Inicio", path: "/" },
                { name: "Productos", path: "/productos" },
                { name: product.category, path: categoryHref },
                { name: product.name, path: `/producto/${product.slug}` },
            ])
        );
    } catch (e) {
        console.error('Error building structured data:', e);
    }

    return (
        <>
            <JsonLd data={structuredData} />
            <ProductDetailClient
                product={product}
                relatedProducts={relatedProducts}
                reviews={reviews}
                categoryHref={categoryHref}
            />
        </>
    );
}
