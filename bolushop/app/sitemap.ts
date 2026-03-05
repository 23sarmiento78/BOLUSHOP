import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories, getAllCollections, getAllPosts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

    // Base routes
    const routes = [
        '',
        '/productos',
        '/blog',
        '/carrito',
        '/rastreo',
        '/nosotros',
        '/contacto',
        '/politica-de-privacidad',
        '/terminos-y-condiciones',
        '/garantias',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Products
    const products = await getAllProducts();
    const productEntries = products
        .filter(p => p.isActive !== false)
        .map((product) => ({
            url: `${baseUrl}/producto/${product.slug}`,
            lastModified: new Date(product.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    // Categories
    const categories = await getAllCategories();
    const categoryEntries = categories.map((category) => ({
        url: `${baseUrl}/productos?categoria=${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Collections (Dedicated Landing Pages)
    const collections = await getAllCollections();
    const collectionEntries = collections.map((collection) => ({
        url: `${baseUrl}/coleccion/${collection.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Blog Posts
    const posts = await getAllPosts();
    const postEntries = posts
        .filter(p => p.isPublished)
        .map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

    return [...routes, ...productEntries, ...categoryEntries, ...collectionEntries, ...postEntries];
}
