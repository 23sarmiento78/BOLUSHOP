import { MetadataRoute } from "next";
import { getAllProducts, getAllCategories, getAllCollections, getAllPosts } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { LANDING_PAGES, landingPath } from "@/lib/landing-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
        { path: "", priority: 1, changeFrequency: "daily" },
        { path: "/productos", priority: 0.9, changeFrequency: "daily" },
        { path: "/ofertas", priority: 0.8, changeFrequency: "weekly" },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
        { path: "/nosotros", priority: 0.6, changeFrequency: "monthly" },
        { path: "/contacto", priority: 0.6, changeFrequency: "monthly" },
        { path: "/guias", priority: 0.7, changeFrequency: "monthly" },
        { path: "/garantias", priority: 0.6, changeFrequency: "monthly" },
        { path: "/rastreo", priority: 0.5, changeFrequency: "monthly" },
        { path: "/politica-de-privacidad", priority: 0.3, changeFrequency: "yearly" },
        { path: "/terminos-y-condiciones", priority: 0.3, changeFrequency: "yearly" },
    ];

    const routes = staticRoutes.map(({ path, priority, changeFrequency }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    const products = await getAllProducts();
    const productEntries = products
        .filter((p) => p.isActive !== false)
        .map((product) => ({
            url: `${SITE_URL}/producto/${product.slug}`,
            lastModified: new Date(product.createdAt),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    const categories = await getAllCategories();
    const categoryEntries = categories.map((category) => ({
        url: `${SITE_URL}/categoria/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const collections = await getAllCollections();
    const collectionEntries = collections.map((collection) => ({
        url: `${SITE_URL}/oferta/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    const posts = await getAllPosts();
    const postEntries = posts
        .filter((p) => p.isPublished)
        .map((post) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }));

    const landingEntries = LANDING_PAGES.map((landing) => ({
        url: `${SITE_URL}${landingPath(landing.slug)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
    }));

    return [...routes, ...productEntries, ...categoryEntries, ...collectionEntries, ...postEntries, ...landingEntries];
}
