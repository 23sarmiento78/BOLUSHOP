import type { Category, Product } from "./types";
import { getActiveStoreProducts, productMatchesCategory } from "./category-utils";
import { COMMON_FAQ, type FaqItem } from "./faqs";

export type LandingFaq = FaqItem;

export interface LandingPageConfig {
    slug: string;
    title: string;
    h1: string;
    metaDescription: string;
    intro: string;
    paragraphs: string[];
    faq: LandingFaq[];
    keywords: string[];
    breadcrumbLabel: string;
    filterProducts: (products: Product[], categories: Category[]) => Product[];
}

export { COMMON_FAQ };

export const LANDING_PAGES: LandingPageConfig[] = [
    {
        slug: "originales-argentina",
        title: "Regalos originales en Argentina",
        h1: "Regalos originales en Argentina",
        metaDescription:
            "Comprá regalos originales online en Argentina con envío gratis. Ideas únicas para cumpleaños, aniversarios y fechas especiales en BoluShop.",
        intro: "Encontrá regalos que sorprenden de verdad: productos curados, precios en pesos y envío a todo el país.",
        paragraphs: [
            "En BoluShop seleccionamos regalos originales pensados para sorprender. Desde accesorios para el hogar hasta productos únicos que no vas a encontrar en cualquier lado.",
            "Comprá online con total seguridad: pagos protegidos con Mercado Pago, envío gratis y atención personalizada por WhatsApp desde Córdoba, Argentina.",
        ],
        keywords: ["regalos originales argentina", "regalos online", "ideas de regalos", "comprar regalos"],
        breadcrumbLabel: "Regalos originales",
        faq: [
            ...COMMON_FAQ,
            {
                question: "¿Qué regalo original recomiendan para un cumpleaños?",
                answer: "Depende de la persona, pero nuestros más elegidos son accesorios de hogar, organizadores y productos de diseño. Podés ver la selección completa en esta página o explorar por categoría.",
            },
        ],
        filterProducts: (products) =>
            getActiveStoreProducts(products).filter(
                (p) =>
                    /regalo|original|único|unico|sorpresa/i.test(p.name) ||
                    ["Varios", "Hogar", "Regalos"].some((c) => p.category.toLowerCase().includes(c.toLowerCase()))
            ),
    },
    {
        slug: "para-cumpleanos",
        title: "Regalos para cumpleaños",
        h1: "Regalos para cumpleaños",
        metaDescription:
            "Ideas de regalos para cumpleaños con envío gratis en Argentina. Encontrá el regalo perfecto en BoluShop con cuotas sin interés.",
        intro: "Ideas de regalos para cumpleaños que llegan a la puerta de tu casa, listos para sorprender.",
        paragraphs: [
            "Elegir un regalo de cumpleaños no tiene por qué ser complicado. En BoluShop reunimos productos originales, útiles y con buena presentación para acertar siempre.",
            "Todos los pedidos incluyen embalaje cuidado y envío a domicilio en Argentina. Pagá en cuotas y recibí tu compra sin salir de casa.",
        ],
        keywords: ["regalos cumpleaños", "ideas regalo cumpleaños", "regalo cumpleaños argentina"],
        breadcrumbLabel: "Regalos para cumpleaños",
        faq: [
            ...COMMON_FAQ,
            {
                question: "¿Llega a tiempo si compro cerca del cumpleaños?",
                answer: "Despachamos en 1 a 3 días hábiles. Te recomendamos comprar con al menos 5 días de anticipación para asegurar la entrega a tiempo.",
            },
        ],
        filterProducts: (products) =>
            getActiveStoreProducts(products)
                .filter(
                    (p) =>
                        p.price <= 80000 ||
                        /regalo|set|kit|combo/i.test(p.name)
                )
                .slice(0, 24),
    },
    {
        slug: "para-el-hogar",
        title: "Regalos y accesorios para el hogar",
        h1: "Regalos y accesorios para el hogar",
        metaDescription:
            "Accesorios y regalos para el hogar con envío gratis en Argentina. Decoración, organización y productos prácticos en BoluShop.",
        intro: "Regalos útiles y decorativos para transformar cualquier rincón del hogar.",
        paragraphs: [
            "Los regalos para el hogar son ideales para inauguraciones, bodas o simplemente para darle un toque especial a tu espacio. En BoluShop encontrás organizadores, accesorios de baño, cocina y más.",
            "Cada producto fue seleccionado por calidad y relación precio-valor. Envío gratis a todo el país y garantía BoluShop en cada compra.",
        ],
        keywords: ["regalos hogar", "accesorios hogar argentina", "regalos casa", "decoración hogar"],
        breadcrumbLabel: "Regalos para el hogar",
        faq: [
            ...COMMON_FAQ,
            {
                question: "¿Son buenos regalos para una housewarming o inauguración?",
                answer: "Sí, los organizadores, accesorios de cocina y productos de decoración son excelentes opciones para regalar en una inauguración de casa.",
            },
        ],
        filterProducts: (products, categories) => {
            const hogar = categories.find((c) => c.slug === "hogar");
            const base = getActiveStoreProducts(products);
            if (hogar) {
                return base.filter((p) => productMatchesCategory(p, hogar));
            }
            return base.filter((p) => /hogar|baño|bano|cocina|organiz/i.test(p.category + p.name));
        },
    },
    {
        slug: "dia-de-la-madre",
        title: "Regalos para el Día de la Madre",
        h1: "Regalos para el Día de la Madre",
        metaDescription:
            "Regalos para el Día de la Madre con envío gratis en Argentina. Sorprendé a mamá con productos originales de BoluShop.",
        intro: "Selección especial para el Día de la Madre: regalos con estilo, calidad y envío a todo el país.",
        paragraphs: [
            "El Día de la Madre merece un regalo especial. En BoluShop encontrás productos prácticos y originales que mamá va a usar y disfrutar todos los días.",
            "Comprá con anticipación para asegurar la entrega antes de la fecha. Cuotas sin interés y envío gratis en Argentina.",
        ],
        keywords: ["regalos dia de la madre", "regalo mama argentina", "ideas regalo madre"],
        breadcrumbLabel: "Día de la Madre",
        faq: [
            ...COMMON_FAQ,
            {
                question: "¿Cuándo debería comprar para el Día de la Madre?",
                answer: "Te recomendamos comprar al menos una semana antes del Día de la Madre para asegurar stock y tiempos de entrega cómodos.",
            },
        ],
        filterProducts: (products) =>
            getActiveStoreProducts(products).filter(
                (p) =>
                    p.price <= 100000 &&
                    !/ml|mercado/i.test(p.category)
            ),
    },
    {
        slug: "accesorios-cocina",
        title: "Accesorios de cocina online",
        h1: "Accesorios de cocina online",
        metaDescription:
            "Comprá accesorios de cocina online en Argentina con envío gratis. Utensilios, organizadores y productos prácticos en BoluShop.",
        intro: "Accesorios de cocina que hacen más fácil y ordenado el día a día.",
        paragraphs: [
            "Equipá tu cocina con accesorios prácticos y de calidad. Desde organizadores hasta utensilios inteligentes, en BoluShop encontrás todo para optimizar tu espacio culinario.",
            "Envío gratis a todo Argentina, pagos seguros y atención al cliente por WhatsApp para resolver cualquier duda antes de comprar.",
        ],
        keywords: ["accesorios cocina online", "utensilios cocina argentina", "organizadores cocina"],
        breadcrumbLabel: "Accesorios de cocina",
        faq: [
            ...COMMON_FAQ,
            {
                question: "¿Los accesorios de cocina son aptos para regalo?",
                answer: "Sí, muchos de nuestros accesorios de cocina vienen en presentación ideal para regalar en cumpleaños, Navidad o inauguraciones.",
            },
        ],
        filterProducts: (products) =>
            getActiveStoreProducts(products).filter(
                (p) =>
                    /cocina|kitchen|utensil|organiz/i.test(p.name + p.description) ||
                    /hogar|organiz/i.test(p.category)
            ),
    },
];

export function getLandingPageBySlug(slug: string): LandingPageConfig | undefined {
    return LANDING_PAGES.find((p) => p.slug === slug);
}

export function landingPath(slug: string): string {
    return `/regalos/${slug}`;
}
