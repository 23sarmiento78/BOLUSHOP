
interface CategoryRule {
    category: string;
    keywords: string[];
    weight: number;
}

const RULES: CategoryRule[] = [
    {
        category: 'cocina',
        keywords: [
            'sarten', 'olla', 'cuchillo', 'afilador', 'molde', 'rallador', 'picadora',
            'churrera', 'batidora', 'hornalla', 'plato', 'vajilla', 'cocina', 'asera',
            'silicona', 'utensilio', 'espumadera', 'cucharon', 'cubetera', 'hielo', 'mate'
        ],
        weight: 2
    },
    {
        category: 'hogar',
        keywords: [
            'organizador', 'cepillo', 'limpieza', 'baño', 'estuche', 'mopa', 'taza',
            'vaso', 'termo', 'canilla', 'grifo', 'ducha', 'jabon', 'toalla', 'percha',
            'almohada', 'saca pelusa', 'dispenser', 'rociador'
        ],
        weight: 1
    },
    {
        category: 'tech',
        keywords: [
            'reloj', 'auricular', 'cable', 'cargador', 'usb', 'bluetooth', 'parlante',
            'smart', 'digital', 'led', 'foco', 'lampara', 'mouse', 'teclado', 'gamer',
            'celular', 'funda', 'soporte'
        ],
        weight: 2
    },
    {
        category: 'aire-libre',
        keywords: [
            'anafe', 'camping', 'carpa', 'linterna', 'botella', 'vianda', 'lonchera',
            'termico', 'pesca', 'jardin', 'parrilla', 'asado', 'exterior', 'mosquit'
        ],
        weight: 2
    },
    {
        category: 'belleza',
        keywords: [
            'maquillaje', 'espejo', 'cosmetico', 'crema', 'perfume', 'masajeador',
            'facial', 'uñas', 'pelo', 'secador', 'bdepiladora'
        ],
        weight: 2
    }
];

export function detectCategory(name: string, description: string = ''): string {
    const text = (name + ' ' + description).toLowerCase();

    let bestCategory = 'varios';
    let maxScore = 0;

    for (const rule of RULES) {
        let score = 0;
        for (const keyword of rule.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                score += rule.weight;
            }
        }

        if (score > maxScore) {
            maxScore = score;
            bestCategory = rule.category;
        }
    }

    // Threshold to accept categorization (optional)
    if (maxScore > 0) {
        return bestCategory;
    }

    return 'varios';
}
