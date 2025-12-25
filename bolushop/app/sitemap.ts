import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    const products = getProducts();

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/producto/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${SITE_URL}/categorias`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...productEntries,
    ];
}
