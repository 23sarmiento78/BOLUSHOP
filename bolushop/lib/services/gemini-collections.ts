import type { Collection, Product } from '@/lib/types';
import type { GeminiCollectionProposal } from '@/lib/types/collection-ai';
import { HOLIDAYS } from '@/lib/holidays';
import { generateGeminiContent } from '@/lib/services/gemini-product';

const VALID_HOLIDAYS = new Set(['none', ...HOLIDAYS.map((h) => h.id)]);

function slugify(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .slice(0, 60);
}

function uniqueSlug(base: string, used: Set<string>): string {
    let slug = slugify(base) || 'coleccion';
    let suffix = 1;
    while (used.has(slug)) {
        slug = `${slugify(base)}-${suffix}`;
        suffix += 1;
    }
    used.add(slug);
    return slug;
}

function buildPrompt(
    products: Product[],
    existingCollections: Collection[],
): string {
    const catalog = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
    }));

    const existing = existingCollections.map((c) => ({
        name: c.name,
        slug: c.slug,
        productCount: c.productIds?.length ?? 0,
    }));

    const holidayOptions = HOLIDAYS.map((h) => h.id).join(', ');

    return `Sos un experto en marketing y promociones para e-commerce en Argentina (BoluShop — regalos y hogar).

Catálogo actual (${catalog.length} productos):
${JSON.stringify(catalog, null, 2)}

Colecciones ya publicadas (no repetir nombres ni slugs):
${JSON.stringify(existing, null, 2)}

Creá entre 3 y 4 colecciones/ofertas temáticas atractivas agrupando productos del catálogo por afinidad (categoría, ocasión, precio, temporada).

Reglas:
- Usá SOLO ids de productos del catálogo
- Mínimo 2 y máximo 8 productos por colección
- Un producto puede aparecer en más de una colección
- Español argentino persuasivo (vos, comprá, oferta)
- discountType: "percentage" (5-20), "fixed" (monto ARS) o "none"
- isFeatured: true solo para la mejor oferta
- holiday: uno de [none, ${holidayOptions}] según temporada actual (hoy es junio en Argentina)
- Incluí "reason" explicando la estrategia de la oferta

Respondé ÚNICAMENTE JSON válido (sin markdown):
{
  "collections": [
    {
      "name": "Nombre comercial de la oferta",
      "description": "Descripción persuasiva 2-3 oraciones",
      "slug": "slug-url-amigable",
      "productIds": ["id1", "id2"],
      "discountType": "percentage",
      "discountValue": 10,
      "isFeatured": false,
      "holiday": "none",
      "reason": "Por qué agrupa estos productos"
    }
  ]
}`;
}

function parseResponse(text: string): GeminiCollectionProposal[] {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Gemini no devolvió JSON válido');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed.collections)) {
        throw new Error('Respuesta de Gemini incompleta');
    }

    return parsed.collections as GeminiCollectionProposal[];
}

function normalizeProposal(
    raw: GeminiCollectionProposal,
    validProductIds: Set<string>,
    usedSlugs: Set<string>,
    existingSlugs: Set<string>,
): GeminiCollectionProposal | null {
    const productIds = (raw.productIds || []).filter((id) => validProductIds.has(String(id)));
    if (productIds.length < 2) return null;

    const discountType = ['percentage', 'fixed', 'none'].includes(raw.discountType)
        ? raw.discountType
        : 'none';

    let discountValue = Number(raw.discountValue) || 0;
    if (discountType === 'percentage') {
        discountValue = Math.min(30, Math.max(5, discountValue));
    } else if (discountType === 'fixed') {
        discountValue = Math.max(0, discountValue);
    } else {
        discountValue = 0;
    }

    const holiday = VALID_HOLIDAYS.has(raw.holiday) ? raw.holiday : 'none';
    const baseSlug = raw.slug || raw.name;
    let slug = slugify(baseSlug);
    if (!slug || existingSlugs.has(slug) || usedSlugs.has(slug)) {
        slug = uniqueSlug(raw.name, usedSlugs);
    } else {
        usedSlugs.add(slug);
    }

    return {
        name: String(raw.name ?? '').trim().slice(0, 80),
        description: String(raw.description ?? '').trim(),
        slug,
        productIds,
        discountType,
        discountValue,
        isFeatured: Boolean(raw.isFeatured),
        holiday,
        reason: String(raw.reason ?? '').trim(),
    };
}

export async function generateCollectionProposals(
    products: Product[],
    existingCollections: Collection[],
): Promise<GeminiCollectionProposal[]> {
    const eligible = products.filter(
        (p) => !p.isMlReferral && p.isActive !== false && p.stock > 0 && p.price > 0,
    );

    if (eligible.length < 2) {
        throw new Error('Se necesitan al menos 2 productos activos con stock para generar ofertas');
    }

    const text = await generateGeminiContent(buildPrompt(eligible, existingCollections));
    const raw = parseResponse(text);

    const validIds = new Set(eligible.map((p) => p.id));
    const existingSlugs = new Set(existingCollections.map((c) => c.slug));
    const usedSlugs = new Set<string>();

    const normalized = raw
        .map((item) => normalizeProposal(item, validIds, usedSlugs, existingSlugs))
        .filter((item): item is GeminiCollectionProposal => item !== null && Boolean(item.name));

    if (normalized.length === 0) {
        throw new Error('Gemini no generó ofertas válidas con los productos disponibles');
    }

    const featuredCount = normalized.filter((c) => c.isFeatured).length;
    if (featuredCount === 0) {
        normalized[0].isFeatured = true;
    } else if (featuredCount > 1) {
        let kept = false;
        for (const col of normalized) {
            if (col.isFeatured && !kept) {
                kept = true;
            } else {
                col.isFeatured = false;
            }
        }
    }

    return normalized.slice(0, 4);
}
