import { Settings } from './types';
import { GBA_ZONES, CABA_POSTAL_CODES, ShippingZone } from './geography';

/**
 * Normalizes text to ensure robust matching (removes accents, lowercase, trims).
 */
function normalizeText(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Advanced resolver for Argentine shipping zones.
 * Priority: 1. Postal Code (most reliable) | 2. Locality matched with Province context.
 */
export function getZoneByAddress(params: {
    locality: string,
    province: string,
    postalCode?: string | number
}): ShippingZone {
    const loc = normalizeText(params.locality);
    const prov = normalizeText(params.province);
    const cp = typeof params.postalCode === 'string' ? parseInt(params.postalCode.replace(/\D/g, '')) : params.postalCode;

    // --- STEP 1: RESOLVE BY POSTAL CODE (HIGH CONFIDENCE) ---
    if (cp) {
        if (cp >= CABA_POSTAL_CODES.min && cp <= CABA_POSTAL_CODES.max) return 'caba';

        for (const gba of GBA_ZONES) {
            if (gba.postalCodeRanges.some(range => cp >= range.min && cp <= range.max)) {
                return gba.zone;
            }
        }
    }

    // --- STEP 2: RESOLVE BY PROVINCE & LOCALITY (MEDIUM CONFIDENCE) ---

    // CABA check
    const isCabaProv = prov.includes('caba') || prov.includes('capital federal');
    const isCabaLoc = loc === 'caba' || loc === 'capital federal' || loc === 'ciudad autonoma de buenos aires';
    if (isCabaProv || isCabaLoc) return 'caba';

    // BUENOS AIRES PROVINCE check (GBA Cordones)
    if (prov.includes('buenos aires')) {
        for (const gba of GBA_ZONES) {
            // Check if locality matches any municipality name exactly or partially
            if (gba.municipalities.some(m => loc.includes(m))) {
                return gba.zone;
            }
        }

        // Special fallback: Most people in "Buenos Aires" are GBA. 
        // If we found nothing but it IS Buenos Aires, we could default to rest, 
        // but let's be more specific with most common names again.
        if (loc.includes('pilar')) return 'gba3';
        if (loc.includes('tigre')) return 'gba2';
        if (loc.includes('quilmes')) return 'gba2';
        if (loc.includes('matanza')) return 'gba1'; // Default Matanza to C1 for proximity
    }

    // --- STEP 3: FALLBACK TO REST OF COUNTRY ---
    return 'rest';
}

/**
 * Enhanced shipping cost calculation with multiple fall and error prevention.
 */
export function calculateShippingCost(params: {
    locality: string,
    province: string,
    postalCode?: string | number
}, settings: Settings): number {
    // If global Free Shipping is enabled, cost is always 0
    if (settings.isFreeShippingEnabled) {
        return 0;
    }

    try {
        const zone = getZoneByAddress(params);

        // Ensure we always have a numeric fallback if the JSON structure is broken
        const regionalCost = settings.shippingJson?.[zone];
        if (typeof regionalCost === 'number') return regionalCost;

        // If specific zone fails, use the global base shipping cost
        return settings.shippingCost || 0;
    } catch (error) {
        console.error("Shipping Calculation Error:", error);
        return settings.shippingCost || 0;
    }
}

export type { ShippingZone };
