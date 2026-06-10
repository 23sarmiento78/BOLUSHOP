import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiSeoResult, MeliProductInput } from '@/lib/types/meli-scout';

const MODEL = 'models/gemini-2.5-flash';

function buildPrompt(product: MeliProductInput): string {
    const productData = JSON.stringify({
        id: product.id,
        title: product.title,
        price: product.price,
        sold_quantity: product.sold_quantity ?? 0,
        permalink: product.permalink,
    }, null, 2);

    return `Actúa como un experto en SEO para E-commerce. Redacta un título optimizado para Mercado Libre, una descripción persuasiva para Google Merchant Center y keywords para AdSense, basándote en este producto: ${productData}

Respondé ÚNICAMENTE con un JSON válido (sin markdown) con esta estructura exacta:
{
  "seo_title": "título optimizado para Mercado Libre (máx 60 caracteres)",
  "seo_description": "descripción persuasiva para Google Merchant Center (150-300 palabras)",
  "adsense_keywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;
}

function parseGeminiJson(text: string): GeminiSeoResult {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Gemini no devolvió JSON válido');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.seo_title || !parsed.seo_description) {
        throw new Error('Respuesta de Gemini incompleta');
    }

    return {
        seo_title: String(parsed.seo_title).trim(),
        seo_description: String(parsed.seo_description).trim(),
        adsense_keywords: String(parsed.adsense_keywords ?? '').trim(),
    };
}

export async function optimizeProductSeo(product: MeliProductInput): Promise<GeminiSeoResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY no configurada en Vercel');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent(buildPrompt(product));
    const text = result.response.text();

    return parseGeminiJson(text);
}
