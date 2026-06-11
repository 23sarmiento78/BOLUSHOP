import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, saveProducts } from '@/lib/db';
import { fetchDroppersProductDetailImages } from '@/lib/services/droppers-scraper';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId, imageUrl, images, productUrl, markUnavailable } = body;

        if (!productId) {
            return NextResponse.json({ error: 'Se requiere productId' }, { status: 400 });
        }

        const products = await getAllProducts();
        const productIndex = products.findIndex((p) => p.id === productId);

        if (productIndex === -1) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        if (markUnavailable) {
            products[productIndex] = {
                ...products[productIndex],
                stock: 0,
                isActive: false,
            };
        } else if (productUrl) {
            const detailImages = await fetchDroppersProductDetailImages(productUrl);
            const chosenImages = detailImages.length > 0 ? detailImages : images || (imageUrl ? [imageUrl] : []);
            products[productIndex] = {
                ...products[productIndex],
                image: chosenImages[0] || imageUrl || products[productIndex].image,
                images: chosenImages,
            };
        } else if (imageUrl && images) {
            products[productIndex] = {
                ...products[productIndex],
                image: imageUrl,
                images: images,
            };
        }

        const saveResult = await saveProducts(products);
        if (!saveResult.success) {
            return NextResponse.json({ error: saveResult.error || 'Error al guardar producto' }, { status: 500 });
        }

        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/productos');

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Save image error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
