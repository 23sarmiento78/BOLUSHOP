import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Product } from '@/lib/types';

const MODELS = [
    'models/gemini-2.5-flash',
    'models/gemini-2.5-flash-lite',
    'models/gemini-3.5-flash',
] as const;

export class GeminiQuotaError extends Error {
    readonly isDailyQuota: boolean;

    constructor(message: string, isDailyQuota = false) {
        super(message);
        this.name = 'GeminiQuotaError';
        this.isDailyQuota = isDailyQuota;
    }
}

export interface ProductCopyOptimization {
    description: string;
    features: string[];
    seoKeywords: string;
}

export interface GoogleFeedsOptimization {
    title: string;
    description: string;
    features: string[];
    adsenseKeywords: string;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return msg.includes('429') || /quota exceeded/i.test(msg);
}

function isDailyQuotaError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return /PerDayPerProject|free_tier_requests/i.test(msg);
}

function isModelUnavailableError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return msg.includes('404') || /not found/i.test(msg) || /not supported/i.test(msg);
}

function extractRetryDelayMs(error: unknown): number {
    const msg = error instanceof Error ? error.message : String(error);
    const match = msg.match(/retry in (\d+(?:\.\d+)?)s/i);
    if (match) return Math.ceil(parseFloat(match[1]) * 1000) + 1000;
    return 15000;
}

export async function generateGeminiContent(prompt: string, maxRetriesPerModel = 3): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY no configurada');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError: unknown;
    let dailyQuotaModels = 0;

    for (const modelName of MODELS) {
        const model = genAI.getGenerativeModel({ model: modelName });

        for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
            try {
                const result = await model.generateContent(prompt);
                return result.response.text();
            } catch (error) {
                lastError = error;

                if (isModelUnavailableError(error)) {
                    break;
                }

                if (isDailyQuotaError(error)) {
                    dailyQuotaModels += 1;
                    break;
                }

                if (isRateLimitError(error)) {
                    await sleep(extractRetryDelayMs(error));
                    continue;
                }

                break;
            }
        }
    }

    if (dailyQuotaModels > 0) {
        throw new GeminiQuotaError(
            'Cuota de Gemini agotada. Plan gratuito: ~20 req/día por modelo. Reintentá mañana o activá billing.',
            true,
        );
    }

    if (lastError instanceof Error) {
        throw new Error(lastError.message.split('\n')[0].slice(0, 200));
    }

    throw new Error('Error al llamar a Gemini');
}

function buildPrompt(product: Pick<Product, 'name' | 'category' | 'price' | 'description' | 'features'>): string {
    return `Sos un experto en e-commerce y copywriting para tiendas online en Argentina.

Producto:
- Nombre: ${product.name}
- Categoría: ${product.category || 'Sin categoría'}
- Precio: $${product.price || 0}
- Descripción actual: ${product.description || 'Sin descripción'}
- Características actuales: ${product.features?.join(', ') || 'Sin características'}

Respondé ÚNICAMENTE con JSON válido (sin markdown):
{
  "description": "Descripción persuasiva y SEO de 2-4 oraciones en español argentino",
  "features": ["Característica 1", "Característica 2", "Característica 3", "Característica 4"],
  "seoKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;
}

function parseResponse(text: string): ProductCopyOptimization {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Gemini no devolvió JSON válido');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        description: String(parsed.description ?? '').trim(),
        features: Array.isArray(parsed.features) ? parsed.features.map(String) : [],
        seoKeywords: String(parsed.seoKeywords ?? '').trim(),
    };
}

export async function optimizeProductCopy(
    product: Pick<Product, 'name' | 'category' | 'price' | 'description' | 'features'>,
): Promise<ProductCopyOptimization> {
    const text = await generateGeminiContent(buildPrompt(product));
    return parseResponse(text);
}

function buildGoogleFeedsPrompt(
    product: Pick<Product, 'name' | 'category' | 'price' | 'description' | 'features'>,
): string {
    return `Sos un experto en SEO para e-commerce en Argentina, especializado en Google Merchant Center y Google AdSense.

Producto:
- Nombre: ${product.name}
- Categoría: ${product.category || 'Sin categoría'}
- Precio: $${product.price || 0} ARS
- Descripción actual: ${product.description || 'Sin descripción'}
- Características actuales: ${product.features?.join(', ') || 'Sin características'}

Redactá contenido optimizado para:
1. Google Merchant Center: título claro (máx 150 caracteres) y descripción persuasiva (150-300 palabras) que destaque beneficios, materiales/uso y por qué comprarlo. Sin HTML.
2. Google AdSense: keywords relevantes para búsquedas en Argentina.

Reglas:
- Español argentino natural (vos, comprá, envío gratis)
- No inventar especificaciones técnicas que no estén en los datos
- Las características deben ser 4-6 bullets cortos y útiles para el comprador
- Si el producto tiene envío gratis, incluilo en features

Respondé ÚNICAMENTE con JSON válido (sin markdown):
{
  "title": "título optimizado para Merchant Center",
  "description": "descripción persuasiva de 150-300 palabras",
  "features": ["Característica 1", "Característica 2", "Característica 3", "Característica 4"],
  "adsenseKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;
}

function parseGoogleFeedsResponse(text: string): GoogleFeedsOptimization {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Gemini no devolvió JSON válido');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        title: String(parsed.title ?? '').trim().slice(0, 150),
        description: String(parsed.description ?? '').trim(),
        features: Array.isArray(parsed.features) ? parsed.features.map(String) : [],
        adsenseKeywords: String(parsed.adsenseKeywords ?? parsed.seoKeywords ?? '').trim(),
    };
}

export async function optimizeProductForGoogleFeeds(
    product: Pick<Product, 'name' | 'category' | 'price' | 'description' | 'features'>,
): Promise<GoogleFeedsOptimization> {
    const text = await generateGeminiContent(buildGoogleFeedsPrompt(product));
    return parseGoogleFeedsResponse(text);
}
