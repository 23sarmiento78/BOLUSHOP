import { v4 as uuidv4 } from 'uuid';
import { getAllProducts, saveProducts } from '@/lib/db';
import type { Product } from '@/lib/types';
import { checkDroppersAvailability, type DroppersAvailabilityResult, fetchDroppersProductImages } from '@/lib/services/droppers-scraper';
import { optimizeProductCopy } from '@/lib/services/gemini-product';

const MIN_BASE_PRICE = 100;
const CONCURRENCY = 3;
const IMAGE_FETCH_DELAY = 800;

export interface DropersCsvRow {
    [key: string]: string | number | undefined;
}

export interface DropersImportOptions {
    replaceCatalog?: boolean;
    skipAi?: boolean;
    skipDroppersCheck?: boolean;
    skipImageFetch?: boolean;
}

export interface DropersImportResult {
    success: boolean;
    total: number;
    imported: number;
    available: number;
    unavailable: number;
    optimized: number;
    skipped: number;
    imagesFetched?: number;
    errors: string[];
}

function parsePrice(raw: unknown): number {
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
        const clean = raw.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '');
        const value = parseFloat(clean);
        return isNaN(value) ? 0 : value;
    }
    return 0;
}

function cleanHtmlDescription(html: string): string {
    if (!html) return '';

    return html
        .replace(/<div[^>]*>/gi, '')
        .replace(/<\/div>/gi, '\n')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('. ');
}

function mapCsvRowToProduct(row: DropersCsvRow, existing?: Product): Product | null {
    const price = parsePrice(row['Precio']);
    if (price < MIN_BASE_PRICE) return null;

    const name = String(row['Nombre'] ?? '').trim();
    if (!name || name === 'Sin Nombre') return null;

    const slugRaw = String(row['Identificador de URL'] ?? '').trim();
    const slug = slugRaw || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const description = cleanHtmlDescription(String(row['Descripción'] ?? ''));
    const image = String(row['Imagen'] ?? '/icon.png');
    const categoryRaw = String(row['Categorias'] || row['Tags'] || '').trim();

    let category = categoryRaw || existing?.category || 'Varios';
    let categoryId = existing?.categoryId;

    if ((!category || category.toLowerCase() === 'varios') && existing?.category) {
        category = existing.category;
        categoryId = existing.categoryId;
    }

    const productId = String(row['SKU'] || existing?.id || uuidv4());

    let finalImage = image;
    if (
        existing?.image &&
        existing.image !== '/icon.png' &&
        !existing.image.includes('dropers') &&
        image.includes('dropers')
    ) {
        finalImage = existing.image;
    }

    if (finalImage === '/icon.png' || !finalImage) {
        finalImage = '/placeholder.png';
    }

    return {
        id: productId,
        name,
        slug,
        price,
        cost: parsePrice(row['Costo']) || Math.round(price / 1.15),
        image: finalImage,
        category,
        categoryId,
        description,
        features: ['Envío Gratis 🚚'],
        stock: 99,
        collections: existing?.collections ?? [],
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        isActive: true,
        isMlReferral: false,
    };
}

async function processInBatches<T, R>(
    items: T[],
    batchSize: number,
    handler: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map((item, offset) => handler(item, i + offset)),
        );
        results.push(...batchResults);
    }

    return results;
}

async function fetchImagesProgressively(products: Product[], onProgress?: (done: number, total: number) => void): Promise<Product[]> {
    const updated = [...products];
    const productsNeedingImages = products.filter(
        p => p.image === '/placeholder.png' || p.image === '/icon.png' || !p.image
    );

    for (let i = 0; i < productsNeedingImages.length; i++) {
        const product = productsNeedingImages[i];
        const index = updated.findIndex(p => p.id === product.id);
        
        if (index !== -1) {
            try {
                const imageResult = await fetchDroppersProductImages(product.name, product.slug);
                if (imageResult.images.length > 0) {
                    updated[index] = {
                        ...updated[index],
                        image: imageResult.images[0],
                        images: imageResult.images
                    };
                }
            } catch (error) {
                console.warn(`No se obtuvieron imágenes para ${product.name}:`, error);
            }
        }

        if (onProgress) onProgress(i + 1, productsNeedingImages.length);
        
        await new Promise(resolve => setTimeout(resolve, IMAGE_FETCH_DELAY));
    }

    return updated;
}

export async function importDropersCsv(
    rows: DropersCsvRow[],
    options: DropersImportOptions = {},
): Promise<DropersImportResult> {
    const { replaceCatalog = true, skipAi = false, skipDroppersCheck = false, skipImageFetch = false } = options;

    const existingProducts = await getAllProducts();
    const existingMap = new Map(existingProducts.map((p) => [p.id, p]));
    const mlReferrals = existingProducts.filter((p) => p.isMlReferral);

    const mapped = rows
        .map((row) => mapCsvRowToProduct(row, existingMap.get(String(row['SKU'] ?? ''))))
        .filter((p): p is Product => p !== null);

    const result: DropersImportResult = {
        success: false,
        total: rows.length,
        imported: 0,
        available: 0,
        unavailable: 0,
        optimized: 0,
        skipped: rows.length - mapped.length,
        errors: [],
    };

    if (mapped.length === 0) {
        result.errors.push('No se encontraron productos válidos en el CSV');
        return result;
    }

    const processed = await processInBatches(mapped, CONCURRENCY, async (product) => {
        let optimized = false;

        try {
            let availability: DroppersAvailabilityResult = { available: true, matchedBy: 'none', resultCount: 0 };

            if (!skipDroppersCheck) {
                availability = await checkDroppersAvailability(product.name, product.slug, product.id);
            }

            if (!availability.available) {
                return {
                    product: {
                        ...product,
                        stock: 0,
                        isActive: false,
                        features: [...(product.features ?? []), 'No disponible en proveedor'],
                    },
                    optimized: false,
                };
            }

            let next = product;

            if (!skipAi && process.env.GEMINI_API_KEY) {
                try {
                    const copy = await optimizeProductCopy(product);
                    optimized = true;
                    next = {
                        ...product,
                        description: copy.description || product.description,
                        features: copy.features.length > 0 ? copy.features : product.features,
                    };
                } catch (aiError) {
                    result.errors.push(
                        `${product.name}: IA falló (${aiError instanceof Error ? aiError.message : 'error'})`,
                    );
                }
            }

            return { product: next, optimized };
        } catch (error) {
            result.errors.push(
                `${product.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            );
            return { product, optimized: false };
        }
    });

    let products = processed.map((entry) => entry.product);

    let imagesFetched = 0;
    if (!skipImageFetch) {
        products = await fetchImagesProgressively(products);
        imagesFetched = products.filter(
            p => !p.image.includes('/placeholder.png') && !p.image.includes('/icon.png')
        ).length;
    }

    for (const entry of processed) {
        result.imported++;
        if (entry.product.stock === 0 || entry.product.isActive === false) {
            result.unavailable++;
        } else {
            result.available++;
            if (entry.optimized) result.optimized++;
        }
    }

    const finalCatalog = replaceCatalog
        ? [...mlReferrals, ...products]
        : [
            ...existingProducts.filter((p) => p.isMlReferral || !products.some((n) => n.id === p.id)),
            ...products,
        ];

    const saveResult = await saveProducts(finalCatalog);
    if (!saveResult.success) {
        result.errors.push(saveResult.error ?? 'Error al guardar en Supabase');
        return result;
    }

    result.imagesFetched = imagesFetched;
    result.success = true;
    return result;
}