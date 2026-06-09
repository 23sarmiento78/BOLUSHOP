import type { Category } from "./types";

const CATEGORY_PARAGRAPHS: Record<string, string[]> = {
    hogar: [
        "Encontrá accesorios, decoración y soluciones prácticas para cada ambiente de tu casa. Desde la cocina hasta el living, seleccionamos productos que combinan diseño, funcionalidad y precio accesible.",
        "Todos los productos de hogar en BoluShop incluyen envío gratis a todo el país, cuotas sin interés con Mercado Pago y la garantía de una compra 100% protegida.",
    ],
    organizacion: [
        "Organizá tu espacio con cajoneras, organizadores y soluciones inteligentes que maximizan cada metro cuadrado. Ideal para placards, cocina, baño y escritorio.",
        "Comprá online con envío a domicilio en Argentina y recibí tu pedido en la puerta de tu casa sin costo adicional de envío.",
    ],
    oficina: [
        "Equipá tu home office o espacio de trabajo con productos que mejoran tu productividad y comodidad. Soportes, organizadores y accesorios pensados para el día a día.",
        "En BoluShop encontrás precios en pesos argentinos, múltiples medios de pago y atención personalizada desde Villa Carlos Paz, Córdoba.",
    ],
    bano: [
        "Transformá tu baño en un espacio más funcional y agradable con accesorios, organizadores y detalles de calidad a precios accesibles.",
        "Enviamos a todo Argentina con seguimiento de pedido y soporte por WhatsApp para resolver cualquier consulta antes y después de tu compra.",
    ],
    limpieza: [
        "Productos de limpieza y organización que hacen más fácil el mantenimiento diario de tu hogar. Soluciones prácticas, duraderas y con excelente relación precio-calidad.",
        "Comprá desde cualquier parte del país con envío gratis y devolución garantizada según nuestras políticas de garantía BoluShop.",
    ],
    varios: [
        "Descubrí productos únicos y originales que no encajan en una sola categoría pero que merecen un lugar en tu hogar o en tu lista de regalos.",
        "Ideal para sorprender en cumpleaños, aniversarios o simplemente darte un gusto. Envío gratis y cuotas sin interés en toda Argentina.",
    ],
    telefonos: [
        "Accesorios y complementos para tu celular: fundas, soportes, cargadores y más. Productos seleccionados con la calidad que esperás de BoluShop.",
        "Comprá con confianza: envío a todo el país, pagos seguros con Mercado Pago y atención al cliente por WhatsApp.",
    ],
};

export function getCategoryMetaDescription(category: Category, productCount: number): string {
    const base = category.seoDescription ||
        `Comprá ${category.name} online en BoluShop. ${productCount} productos con envío gratis a todo Argentina, cuotas sin interés y compra protegida.`;
    const withDesc = category.description?.trim()
        ? `${base} ${category.description.trim()}`
        : base;
    return withDesc.replace(/\s+/g, " ").trim().slice(0, 160);
}

export function getCategoryTitle(category: Category): string {
    return category.seoTitle || `${category.name} — Comprar online en Argentina`;
}

export function getCategoryLongContent(category: Category, productCount: number): string[] {
    if (category.seoContent?.trim()) {
        return category.seoContent
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean);
    }

    const intro = category.description?.trim()
        ? [category.description.trim()]
        : [];

    const specific = CATEGORY_PARAGRAPHS[category.slug.toLowerCase()] || [
        `Explorá nuestra selección de ${category.name.toLowerCase()} con ${productCount} productos disponibles en BoluShop. Cada artículo fue elegido por nuestro equipo para ofrecerte calidad, diseño y precios competitivos en pesos argentinos.`,
        "Comprá con envío gratis a todo el país, pagá en cuotas sin interés con Mercado Pago y contá con la garantía BoluShop en cada pedido. Despachamos desde Córdoba, Argentina.",
    ];

    return [...intro, ...specific];
}
