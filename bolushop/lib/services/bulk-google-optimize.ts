import { getAllProducts, saveProducts } from '@/lib/db';
import type { Product } from '@/lib/types';
import { GeminiQuotaError, optimizeProductForGoogleFeeds } from '@/lib/services/gemini-product';

const REQUEST_DELAY_MS = 5000;

export interface BulkGoogleOptimizeOptions {
    force?: boolean;
}

export interface BulkGoogleOptimizeResult {
    success: boolean;
    total: number;
    optimized: number;
    skipped: number;
    alreadyOptimized: number;
    pending: number;
    quotaExceeded: boolean;
    errors: string[];
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function mergeFeatures(existing: string[], optimized: string[]): string[] {
    const preserved = existing.filter((f) => /env[ií]o/i.test(f));
    const merged = [...preserved, ...optimized.filter((f) => !preserved.some((p) => p === f))];
    return merged.length > 0 ? merged : optimized;
}

function isAlreadyOptimized(product: Product): boolean {
    return Boolean(product.seoKeywords?.trim());
}

export async function bulkOptimizeProductsForGoogle(
    options: BulkGoogleOptimizeOptions = {},
): Promise<BulkGoogleOptimizeResult> {
    const { force = false } = options;

    if (!process.env.GEMINI_API_KEY) {
        return {
            success: false,
            total: 0,
            optimized: 0,
            skipped: 0,
            alreadyOptimized: 0,
            pending: 0,
            quotaExceeded: false,
            errors: ['GEMINI_API_KEY no configurada'],
        };
    }

    let allProducts = await getAllProducts();
    const mlReferrals = allProducts.filter((p) => p.isMlReferral).length;
    const catalogProducts = allProducts.filter((p) => !p.isMlReferral);

    const alreadyDone = force ? 0 : catalogProducts.filter(isAlreadyOptimized).length;
    const toProcess = force
        ? catalogProducts
        : catalogProducts.filter((p) => !isAlreadyOptimized(p));

    const result: BulkGoogleOptimizeResult = {
        success: false,
        total: catalogProducts.length,
        optimized: 0,
        skipped: mlReferrals,
        alreadyOptimized: alreadyDone,
        pending: toProcess.length,
        quotaExceeded: false,
        errors: [],
    };

    if (toProcess.length === 0) {
        result.success = true;
        result.pending = 0;
        if (alreadyDone > 0) {
            result.errors.push('Todos los productos ya están optimizados. Usá "forzar" para reoptimizar.');
        } else {
            result.errors.push('No hay productos de catálogo para optimizar');
        }
        return result;
    }

    let quotaExceeded = false;

    for (let i = 0; i < toProcess.length; i++) {
        const product = toProcess[i];

        if (quotaExceeded) {
            break;
        }

        try {
            const copy = await optimizeProductForGoogleFeeds(product);
            const updated: Product = {
                ...product,
                name: copy.title || product.name,
                description: copy.description || product.description,
                features: mergeFeatures(product.features ?? [], copy.features),
                seoKeywords: copy.adsenseKeywords || product.seoKeywords,
            };

            allProducts = allProducts.map((p) => (p.id === product.id ? updated : p));
            const saveResult = await saveProducts(allProducts);

            if (!saveResult.success) {
                result.errors.push(`${product.name}: ${saveResult.error ?? 'Error al guardar'}`);
                continue;
            }

            result.optimized += 1;
            result.pending = toProcess.length - result.optimized - result.errors.length;

            if (i < toProcess.length - 1) {
                await sleep(REQUEST_DELAY_MS);
            }
        } catch (error) {
            if (error instanceof GeminiQuotaError) {
                quotaExceeded = true;
                result.quotaExceeded = true;
                result.errors.push(
                    `Cuota diaria agotada tras ${result.optimized} productos. ` +
                    `${toProcess.length - result.optimized} pendientes. ` +
                    'Reintentá mañana o activá billing en Google AI Studio.',
                );
                break;
            }

            result.errors.push(
                `${product.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            );
        }
    }

    result.pending = toProcess.length - result.optimized;
    result.success = result.optimized > 0 || (result.alreadyOptimized > 0 && result.pending === 0);
    return result;
}
