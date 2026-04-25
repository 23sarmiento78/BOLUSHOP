import { NextResponse } from 'next/server';
import { getAllProducts, saveProducts } from '@/lib/db';
import { Product } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const products = await getAllProducts();

        // Create SEO Friendly Slug
        const slugBase = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let slug = slugBase;
        let count = 1;
        while (products.some(p => p.slug === slug)) {
            slug = `${slugBase}-${count}`;
            count++;
        }

        // Construct ML Product
        const newProduct: Product = {
            id: `ML-${data.id}`,
            name: data.title,
            slug,
            price: data.price,
            cost: data.price, // Same cost as ML
            image: data.pictures[0],
            images: data.pictures.slice(0, 5), // Max 5 images
            category: 'Referidos ML',
            categoryId: 'ml-referrals',
            description: `**Compra Segura**\nEste producto ha sido seleccionado especialmente por BoluShop y la transacción se procesa de forma 100% segura usando infraestructura y envíos exprés de Mercado Libre.\n\nAl hacer clic en Comprar, serás dirigido para aprovechar la red de envíos más rápida del país.`,
            features: [
                `Garantía: Compra Protegida de Mercado Libre`,
                `Beneficio Extra: Sumás Mercado Puntos`,
                `Condición Original: ${data.condition === 'new' ? 'Nuevo' : 'Usado'}`
            ],
            stock: 999, // Virtually unlimited for affiliate
            collections: [],
            createdAt: new Date().toISOString(),
            isActive: true,
            isMlReferral: true,
            mlItemId: data.id,
            mlAffiliateUrl: data.originalUrl
        };

        const result = await saveProducts([...products, newProduct]);
        if (!result.success) {
            return NextResponse.json({ error: 'Error guardando en Supabase' }, { status: 500 });
        }

        return NextResponse.json({ success: true, product: newProduct });
    } catch (e: any) {
        console.error('Save ML product error:', e);
        return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
    }
}
