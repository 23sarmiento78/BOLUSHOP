"use server";

import { revalidatePath } from "next/cache";
import { getAllProducts, saveProducts, Product } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

export async function deleteProductAction(id: string) {
    const products = getAllProducts();
    const newProducts = products.filter(p => p.id !== id);
    const success = saveProducts(newProducts);

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteAllProductsAction() {
    const success = saveProducts([]); // Clear all

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteMultipleProductsAction(idsToDelete: string[]) {
    const products = getAllProducts();
    const newProducts = products.filter(p => !idsToDelete.includes(p.id));
    const success = saveProducts(newProducts);

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function updateProductAction(updatedProduct: Product) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index !== -1) {
        products[index] = updatedProduct;
        const success = saveProducts(products);
        if (!success) return { success: false, error: "Vercel no permite editar archivos en tiempo real. Esto solo funciona localmente." };

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath(`/producto/${updatedProduct.slug}`);
        return { success: true };
    }
    return { success: false, error: "Producto no encontrado" };
}

export async function importProductsAction(rawProducts: any[], source: string) {
    try {
        let mappedProducts: (Product | null)[] = [];

        if (source === 'dropers-csv') {
            mappedProducts = rawProducts.map((row: any) => {
                // Parse Price logic
                let price = 0;
                let priceRaw = row['Precio'];

                if (priceRaw) {
                    if (typeof priceRaw === 'number') {
                        price = priceRaw;
                    } else if (typeof priceRaw === 'string') {
                        const cleanPrice = priceRaw.replace(/\./g, '').replace(',', '.');
                        price = parseFloat(cleanPrice);
                    }
                }
                if (isNaN(price)) price = 0;

                const SHIPPING_COST = 9000;
                const MIN_BASE_PRICE = 15000;
                let features = [];

                if (price > 0) {
                    // Business Rule: Skip products below $15,000 base price
                    if (price < MIN_BASE_PRICE) return null;

                    // Universal Strategy: Every product includes shipping and 5% profit
                    // Formula: (Base + Shipping) + 5% Profit
                    price = Math.round((price + SHIPPING_COST) * 1.05);
                    features.push("Envío Gratis 🚚");
                }

                const description = row['Descripción'] || '';
                const image = row['Imagen'] || '/bolushop.png';

                // Fallback logical for category
                const categoryRaw = row['Categorias'] || row['Tags'] || '';
                let category = categoryRaw.trim();

                // AUTO-CATEGORIZATION: If no category or generic 'varios', utilize smart detector
                if (!category || category.toLowerCase() === 'varios') {
                    const { detectCategory } = require("@/lib/auto-category");
                    category = detectCategory(row['Nombre'], description);
                }

                return {
                    id: String(row['SKU'] || uuidv4()),
                    name: row['Nombre'] || 'Sin Nombre',
                    slug: row['Identificador de URL'] || (row['Nombre'] ? row['Nombre'].toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : uuidv4()),
                    price: price,
                    image: image,
                    category: category,
                    description: description,
                    features: features
                } as Product;
            });
        }

        const validProducts = (mappedProducts.filter(p => p !== null && p.name && p.name !== 'Sin Nombre' && p.price > 0) as Product[]);

        if (validProducts.length > 0) {
            const success = saveProducts(validProducts);
            if (!success) return { success: false, error: "Vercel no permite crear archivos en tiempo real. Subí tus productos al GitHub para que aparezcan." };

            revalidatePath("/admin/products");
            revalidatePath("/admin");
            revalidatePath("/");
            return { success: true, count: validProducts.length };
        }

        return { success: false, error: "No se encontraron productos validos" };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al procesar datos" };
    }
}
