import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.vercel.app';
    const products = await getAllProducts();
    const activeProducts = products.filter(p => p.isActive !== false);

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/productos`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/rastreo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Páginas de productos dinámicas
    const productPages: MetadataRoute.Sitemap = activeProducts.map((product) => {
        // Validar que createdAt sea una fecha válida
        let lastModified = new Date();
        try {
            const productDate = new Date(product.createdAt);
            if (!isNaN(productDate.getTime())) {
                lastModified = productDate;
            }
        } catch (e) {
            // Si hay error, usar fecha actual
        }

        return {
            url: `${siteUrl}/producto/${product.slug}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        };
    });

    return [...staticPages, ...productPages];
}
