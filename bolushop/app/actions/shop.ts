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

export async function getShippingRate(province: string): Promise<number> {
    const settings = await getSettings();
    const provinceKey = province.toLowerCase();

    // Map provinces to shipping zones
    const cabaProvinces = ['caba', 'capital federal', 'ciudad autónoma de buenos aires'];
    const gba1Provinces = ['vicente lópez', 'san isidro', 'san fernando', 'tigre', 'la matanza', 'tres de febrero'];
    const gba2Provinces = ['morón', 'hurlingham', 'ituzaingó', 'merlo', 'moreno', 'san miguel'];
    const gba3Provinces = ['esteban echeverría', 'lomas de zamora', 'lanús', 'avellaneda', 'quilmes'];

    if (cabaProvinces.some(p => provinceKey.includes(p))) {
        return settings.shippingJson.caba;
    } else if (gba1Provinces.some(p => provinceKey.includes(p))) {
        return settings.shippingJson.gba1;
    } else if (gba2Provinces.some(p => provinceKey.includes(p))) {
        return settings.shippingJson.gba2;
    } else if (gba3Provinces.some(p => provinceKey.includes(p))) {
        return settings.shippingJson.gba3;
    } else {
        return settings.shippingJson.rest;
    }
}
