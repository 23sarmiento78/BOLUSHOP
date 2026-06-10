import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllProducts, saveProducts } from '@/lib/db';
import { fetchDroppersProductImages } from '@/lib/services/droppers-scraper';

const BATCH_SIZE = 3;
const DELAY_BETWEEN_BATCHES = 2000;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productIds, allProducts = false } = body;

        const products = await getAllProducts();
        
        let targetProducts;
        if (allProducts) {
            targetProducts = products.filter(p => !p.image || p.image.includes('/icon.png'));
        } else if (Array.isArray(productIds)) {
            targetProducts = products.filter(p => productIds.includes(p.id));
        } else {
            return NextResponse.json({ error: 'Se requiere productIds o allProducts=true' }, { status: 400 });
        }

        const results: { id: string; name: string; imagesFound: number; image?: string }[] = [];

        for (let i = 0; i < targetProducts.length; i += BATCH_SIZE) {
            const batch = targetProducts.slice(i, i + BATCH_SIZE);
            
            for (const product of batch) {
                try {
                    const result = await fetchDroppersProductImages(product.name, product.slug, product.id);
                    
                    if (result.images.length > 0) {
                        const productIndex = products.findIndex(p => p.id === product.id);
                        if (productIndex !== -1) {
                            products[productIndex] = {
                                ...products[productIndex],
                                image: result.images[0],
                                images: result.images
                            };
                        }
                        results.push({
                            id: product.id,
                            name: product.name,
                            imagesFound: result.images.length,
                            image: result.images[0]
                        });
                    } else {
                        results.push({
                            id: product.id,
                            name: product.name,
                            imagesFound: 0
                        });
                    }
                } catch (error) {
                    results.push({
                        id: product.id,
                        name: product.name,
                        imagesFound: 0
                    });
                }

                await new Promise(resolve => setTimeout(resolve, 300));
            }

            if (i + BATCH_SIZE < targetProducts.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
            }
        }

        const saveResult = await saveProducts(products);
        if (!saveResult.success) {
            return NextResponse.json({ error: saveResult.error || 'Error al guardar productos' }, { status: 500 });
        }

        revalidatePath('/admin/products');
        revalidatePath('/');
        revalidatePath('/productos');

        return NextResponse.json({
            success: true,
            total: targetProducts.length,
            processed: results.length,
            imagesFound: results.filter(r => r.imagesFound > 0).length,
            results
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Fetch images error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}