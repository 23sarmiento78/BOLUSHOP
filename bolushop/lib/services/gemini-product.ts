import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Product } from '@/lib/types';

const MODEL = 'models/gemini-2.5-flash';

export interface ProductCopyOptimization {
    description: string;
    features: string[];
    seoKeywords: string;
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY no configurada');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(buildPrompt(product));
    return parseResponse(result.response.text());
}
