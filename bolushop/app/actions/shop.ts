"use server";

import { headers } from "next/headers";
import { getAllProducts, getSettings, getProductReviews, addProductReview, subscribeToNewsletter } from "@/lib/db";
import { Product, Review } from "@/lib/types";

export async function searchProducts(query: string): Promise<Product[]> {
    const products = await getAllProducts();
    const normalize = (value: string) => value
        .toLocaleLowerCase("es-AR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const searchLower = normalize(query);

    return products.filter(p =>
        p.isActive !== false && [p.name, p.description, p.category]
            .filter(Boolean)
            .some(value => normalize(value).includes(searchLower))
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

    if (settings.isFreeShippingEnabled) return 0;

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

export async function getCheckoutSettings() {
    const settings = await getSettings();
    return {
        isFreeShippingEnabled: settings.isFreeShippingEnabled ?? true,
        minPurchaseAmount: settings.minPurchaseAmount ?? 35000,
    };
}

export async function getProductReviewsAction(productId: string) {
    return await getProductReviews(productId);
}

const requestAttempts = new Map<string, number[]>();

async function enforceRateLimit(scope: string, maxAttempts: number, windowMs: number) {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
    const address = forwarded || requestHeaders.get("x-real-ip") || "unknown";
    const key = `${scope}:${address}`;
    const now = Date.now();
    const recent = (requestAttempts.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

    if (recent.length >= maxAttempts) {
        throw new Error("Demasiados intentos. Probá nuevamente más tarde.");
    }

    recent.push(now);
    requestAttempts.set(key, recent);
}

export async function addProductReviewAction(review: Review) {
    await enforceRateLimit("review", 5, 60 * 60 * 1000);

    const userName = review.userName?.trim();
    const comment = review.comment?.trim();
    const rating = Number(review.rating);

    if (!userName || userName.length > 80) {
        throw new Error("El nombre debe tener entre 1 y 80 caracteres.");
    }
    if (!comment || comment.length < 8 || comment.length > 1000) {
        throw new Error("La opinión debe tener entre 8 y 1000 caracteres.");
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("La calificación no es válida.");
    }

    return await addProductReview({ ...review, userName, comment, rating });
}

export async function subscribeToNewsletterAction(email: string, honeypot = "") {
    if (honeypot.trim()) return false;
    await enforceRateLimit("newsletter", 3, 60 * 60 * 1000);

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        throw new Error("Ingresá un email válido.");
    }

    return await subscribeToNewsletter(normalizedEmail);
}
