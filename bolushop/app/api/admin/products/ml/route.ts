import { NextResponse } from 'next/server';
import { getAllProducts, saveProducts } from '@/lib/db';
import { Product } from '@/lib/types';

import { revalidatePath } from 'next/cache';

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
            image: data.pictures[0] || '',
            images: data.pictures.slice(0, 10), // Max 10 imágenes para mejor galería
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
            mlAffiliateUrl: data.permalink || data.originalUrl
        };

        // Si ya existe un producto referenciado con ese mismo ID de ML, lo actualizamos en la misma posición
        // para que la base de datos no reciba un array con 2 elementos de igual ID (lo que causa error en Supabase)
        const updatedProducts = [...products];
        const existingIndex = updatedProducts.findIndex(p => p.id === newProduct.id);
        if (existingIndex !== -1) {
            updatedProducts[existingIndex] = newProduct;
        } else {
            updatedProducts.push(newProduct);
        }

        const result = await saveProducts(updatedProducts);
        if (!result.success) {
            return NextResponse.json({ error: `Error guardando en Supabase: ${result.error || 'Desconocido'}` }, { status: 500 });
        }

        // ¡SÚPER IMPORTANTE! Forzar a Next.js a limpiar su caché interna en todas las páginas
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, product: newProduct });
    } catch (e: any) {
        console.error('Save ML product error:', e);
        return NextResponse.json({ error: e.message || 'Error interno del servidor.' }, { status: 500 });
    }
}
