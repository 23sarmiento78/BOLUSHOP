"use server";

import { revalidatePath } from "next/cache";
import { getAllProducts, saveProducts, Product } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

export async function deleteProductAction(id: string) {
    const products = getAllProducts();
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteAllProductsAction() {
    saveProducts([]); // Clear all
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteMultipleProductsAction(idsToDelete: string[]) {
    const products = getAllProducts();
    const newProducts = products.filter(p => !idsToDelete.includes(p.id));
    saveProducts(newProducts);
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
        saveProducts(products);
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
        let mappedProducts: Product[] = [];

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
                const ABSORB_THRESHOLD = 20000; // Products above $20k absorb shipping
                let features = [];

                if (price > 0) {
                    if (price >= ABSORB_THRESHOLD) {
                        // Strategy: Absorb shipping, mark as Free Shipping
                        // Formula: (Base + Shipping) + 10% Profit
                        price = Math.round((price + SHIPPING_COST) * 1.10);
                        features.push("Envío Gratis 🚚");
                    } else {
                        // Strategy: Low cost item, just 10% Profit. Shipping paid by customer.
                        price = Math.round(price * 1.10);
                    }
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
                };
            });
        }

        mappedProducts = mappedProducts.filter(p => p.name && p.name !== 'Sin Nombre' && p.price > 0);

        if (mappedProducts.length > 0) {
            saveProducts(mappedProducts);

            revalidatePath("/admin/products");
            revalidatePath("/admin");
            revalidatePath("/");
            return { success: true, count: mappedProducts.length };
        }

        return { success: false, error: "No se encontraron productos validos" };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al procesar datos" };
    }
}
