import type { Category, Product } from "./types";

export function productMatchesCategory(product: Product, category: Category): boolean {
    if (product.isActive === false) return false;
    if (product.categoryId && product.categoryId === category.id) return true;
    if (product.category.toLowerCase() === category.name.toLowerCase()) return true;
    if (product.category.toLowerCase() === category.slug.toLowerCase()) return true;
    return false;
}

export function getProductsByCategory(products: Product[], category: Category): Product[] {
    return getActiveStoreProducts(products).filter((p) => productMatchesCategory(p, category));
}

export function getActiveStoreProducts(products: Product[]): Product[] {
    return products.filter((p) => p.isActive !== false && !p.isMlReferral && p.price > 0);
}

export function resolveCategorySlug(categoryLabel: string, categories: Category[]): string {
    const normalized = categoryLabel.toLowerCase().trim();
    const found = categories.find(
        (c) =>
            c.slug.toLowerCase() === normalized ||
            c.name.toLowerCase() === normalized ||
            c.id.toLowerCase() === normalized
    );
    return found?.slug || normalized.replace(/\s+/g, "-");
}

export function categoryPath(slug: string): string {
    return `/categoria/${slug}`;
}
