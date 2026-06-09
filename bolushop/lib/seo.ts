import type { Metadata } from "next";
import type { BlogPost, Product, Review } from "./types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bolushop.com";
export const SITE_NAME = "BoluShop";

export function absoluteUrl(path = ""): string {
    const base = SITE_URL.replace(/\/$/, "");
    if (!path || path === "/") return `${base}/`;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    image?: string;
    noIndex?: boolean;
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
}

export function buildPageMetadata({
    title,
    description,
    path = "/",
    keywords,
    image = "/icon.png",
    noIndex = false,
    type = "website",
    publishedTime,
    modifiedTime,
}: PageMetadataOptions): Metadata {
    const url = absoluteUrl(path);
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    return {
        metadataBase: new URL(SITE_URL),
        title: fullTitle,
        description,
        ...(keywords ? { keywords: keywords.join(", ") } : {}),
        alternates: { canonical: url },
        robots: noIndex
            ? { index: false, follow: false, googleBot: { index: false, follow: false } }
            : { index: true, follow: true },
        openGraph: {
            type,
            locale: "es_AR",
            url,
            title: fullTitle,
            description,
            siteName: SITE_NAME,
            images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: SITE_NAME }],
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [absoluteUrl(image)],
        },
    };
}

export function buildWebSiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description:
            "Tienda online de regalos originales y accesorios para el hogar en Argentina. Envío gratis, cuotas sin interés y compra protegida.",
        inLanguage: "es-AR",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function buildOrganizationJsonLd(settings: { siteName: string; siteDescription: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: settings.siteName,
        url: SITE_URL,
        logo: absoluteUrl("/icon.png"),
        description: settings.siteDescription,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Villa Carlos Paz",
            addressRegion: "Córdoba",
            addressCountry: "AR",
        },
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+54-9-3541-237972",
            contactType: "customer service",
            availableLanguage: "Spanish",
            areaServed: "AR",
        },
        sameAs: ["https://instagram.com/bolushop.arg", "https://wa.me/543541237972"],
    };
}

export function buildOnlineStoreJsonLd(settings: { siteName: string }) {
    return {
        "@context": "https://schema.org",
        "@type": "OnlineStore",
        name: settings.siteName,
        url: SITE_URL,
        logo: absoluteUrl("/icon.png"),
        description:
            "Tienda online de regalos originales y accesorios para el hogar en Argentina. Envío gratis, cuotas sin interés y compra 100% protegida.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Villa Carlos Paz",
            addressRegion: "Córdoba",
            addressCountry: "AR",
        },
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+54-9-3541-237972",
            contactType: "customer service",
            availableLanguage: "Spanish",
        },
        sameAs: ["https://instagram.com/bolushop.arg"],
    };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function buildProductJsonLd(product: Product, reviews: Review[]) {
    const imageUrls = [product.image, ...(product.images || [])].filter(Boolean);
    const cleanDescription = product.description
        .replace(/<[^>]*>?/gm, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500);

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: cleanDescription,
        image: imageUrls,
        sku: product.id,
        brand: { "@type": "Brand", name: "BoluShop" },
        offers: {
            "@type": "Offer",
            url: absoluteUrl(`/producto/${product.slug}`),
            priceCurrency: "ARS",
            price: product.price,
            availability:
                product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: "BoluShop" },
        },
    };

    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: String(reviews.length),
            bestRating: "5",
            worstRating: "1",
        };
        jsonLd.review = reviews.slice(0, 10).map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.userName },
            datePublished: review.date,
            reviewBody: review.comment,
            reviewRating: {
                "@type": "Rating",
                ratingValue: String(review.rating),
                bestRating: "5",
                worstRating: "1",
            },
        }));
    }

    return jsonLd;
}

export function buildBlogPostJsonLd(post: BlogPost) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription || post.excerpt || post.title,
        image: post.image ? absoluteUrl(post.image) : absoluteUrl("/icon.png"),
        datePublished: post.createdAt,
        dateModified: post.createdAt,
        author: {
            "@type": "Organization",
            name: post.author || SITE_NAME,
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": absoluteUrl(`/blog/${post.slug}`),
        },
        inLanguage: "es-AR",
        ...(post.category ? { articleSection: post.category } : {}),
    };
}

export const NOINDEX_PATHS = [
    "/carrito",
    "/checkout",
    "/exito",
    "/rechazado",
    "/buscar",
    "/admin",
    "/api",
];
