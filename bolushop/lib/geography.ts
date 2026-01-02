/**
 * Standardized data for Argentine Geography to avoid "confusion at all costs".
 */

export const PROVINCIAS_ARGENTINA = [
    "CABA",
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán"
];

export type ShippingZone = 'caba' | 'gba1' | 'gba2' | 'gba3' | 'rest';

export interface GbaMapping {
    zone: 'gba1' | 'gba2' | 'gba3';
    municipalities: string[];
    postalCodeRanges: { min: number, max: number }[];
}

export const GBA_ZONES: GbaMapping[] = [
    {
        zone: 'gba1',
        municipalities: [
            'avellaneda', 'lanus', 'lomas de zamora', 'moron', 'tres de febrero',
            'san martin', 'vicente lopez', 'san isidro', 'san justo', 'ramos mejia',
            'haedo', 'villa madero', 'tapiales', 'alina', 'florida', 'olivos'
        ],
        postalCodeRanges: [
            { min: 1602, max: 1609 }, // Vicente Lopez area
            { min: 1640, max: 1644 }, // San Isidro area
            { min: 1822, max: 1826 }, // Lanus area
            { min: 1870, max: 1875 }, // Avellaneda area
            { min: 1702, max: 1708 }  // Moron/Matanza Norte
        ]
    },
    {
        zone: 'gba2',
        municipalities: [
            'quilmes', 'berazategui', 'florencio varela', 'almirante brown',
            'esteban echeverria', 'ezeiza', 'moreno', 'merlo', 'ituzaingo',
            'hurlingham', 'san miguel', 'jose c paz', 'malvinas argentinas',
            'tigre', 'san fernando'
        ],
        postalCodeRanges: [
            { min: 1876, max: 1888 }, // Quilmes/Berazategui
            { min: 1842, max: 1856 }, // Almirante Brown
            { min: 1712, max: 1723 }, // Ituzaingo/Merlo
            { min: 1611, max: 1618 }, // Tigre/San Fernando
            { min: 1661, max: 1665 }  // San Miguel/Malvinas
        ]
    },
    {
        zone: 'gba3',
        municipalities: [
            'san vicente', 'presidente peron', 'marcos paz', 'general rodriguez',
            'escobar', 'pilar', 'lujan', 'cañuelas', 'la plata', 'ensenada',
            'berisso', 'brandsen', 'exaltacion de la cruz'
        ],
        postalCodeRanges: [
            { min: 1625, max: 1635 }, // Escobar
            { min: 1900, max: 1925 }, // La Plata
            { min: 1629, max: 1634 }, // Pilar
            { min: 1748, max: 1750 }  // Gral Rodriguez
        ]
    }
];

export const CABA_POSTAL_CODES = { min: 1000, max: 1499 };

/**
 * Returns all unique municipalities listed in the GBA mapping.
 */
export function getAllGbaMunicipalities(): string[] {
    return GBA_ZONES.flatMap(z => z.municipalities).sort();
}

/**
 * Returns the list of provinces formatted for a <select> component.
 */
export function getProvinceOptions() {
    return PROVINCIAS_ARGENTINA.map(p => ({ label: p, value: p }));
}
