"use server";

import { getAllProducts, getSettings } from "@/lib/db";
import { Product } from "@/lib/types";

export async function searchProducts(query: string): Promise<Product[]> {
    const products = await getAllProducts();
    const searchLower = query.toLowerCase();

    return products.filter(p =>
        p.isActive !== false && (
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        )
    );
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const products = await getAllProducts();
    return products
        .filter(p => p.isActive !== false)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const products = await getAllProducts();
    return products.filter(p =>
        p.isActive !== false &&
        p.category.toLowerCase() === category.toLowerCase()
    );
}

export async function getRelatedProducts(productId: string, category: string): Promise<Product[]> {
    const products = await getAllProducts();
    return products
        .filter(p =>
            p.isActive !== false &&
            p.id !== productId &&
            p.category === category
        )
        .slice(0, 4);
}

import { getCityZone } from "@/lib/locations";

export async function getShippingRate(province: string, city: string = ""): Promise<number> {
    const settings = await getSettings();
    const zone = getCityZone(province, city);

    switch (zone) {
        case 'caba': return settings.shippingJson.caba;
        case 'gba1': return settings.shippingJson.gba1;
        case 'gba2': return settings.shippingJson.gba2;
        case 'gba3': return settings.shippingJson.gba3;
        case 'rest':
        default:
            return settings.shippingJson.rest;
    }
}
