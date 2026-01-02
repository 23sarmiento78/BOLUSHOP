"use server";

import { revalidatePath } from "next/cache";
import {
    getAllProducts,
    saveProducts,
    getAllOrders,
    getSettings,
    getAllCollections,
    saveCollections,
    getAllCategories,
    saveCategories,
    updateOrder
} from "@/lib/db";
import { Product, Collection, Category, Order } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";

export async function deleteProductAction(id: string) {
    const products = await getAllProducts();
    const newProducts = products.filter(p => p.id !== id);
    const success = await saveProducts(newProducts);

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteAllProductsAction() {
    const success = await saveProducts([]); // Clear all

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteMultipleProductsAction(idsToDelete: string[]) {
    const products = await getAllProducts();
    const newProducts = products.filter(p => !idsToDelete.includes(p.id));
    const success = await saveProducts(newProducts);

    if (!success) return { success: false, error: "Vercel no permite borrar archivos en tiempo real. Esto solo funciona localmente." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function updateProductAction(updatedProduct: Product) {
    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index !== -1) {
        products[index] = updatedProduct;
        const success = await saveProducts(products);
        if (!success) return { success: false, error: "Vercel no permite editar archivos en tiempo real. Esto solo funciona localmente." };

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath(`/producto/${updatedProduct.slug}`);
        return { success: true };
    }
    return { success: false, error: "Producto no encontrado" };
}

export async function createProductAction(product: Omit<Product, 'id' | 'createdAt'>) {
    const products = await getAllProducts();
    const newProduct: Product = {
        ...product,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        stock: product.stock || 0,
        collections: product.collections || []
    };

    products.push(newProduct);
    const success = await saveProducts(products);

    if (!success) return { success: false, error: "No se pudo guardar el producto." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, product: newProduct };
}

export async function importProductsAction(rawProducts: any[], source: string) {
    try {
        const settings = await getSettings();
        const PROFIT_MARGIN = settings.profitMargin;
        const SHIPPING_COST = settings.shippingCost;

        // Get existing products to preserve custom images
        const existingProducts = await getAllProducts();
        const existingProductsMap = new Map(
            existingProducts.map(p => [p.id, p])
        );

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

                const MIN_BASE_PRICE = 100;
                let features = [];

                if (price > 0) {
                    // Business Rule: Skip products below $15,000 base price
                    if (price < MIN_BASE_PRICE) return null;

                    // Formula: (Base + Shipping) * Profit
                    price = Math.round((price + SHIPPING_COST) * PROFIT_MARGIN);
                    features.push("Envío Gratis 🚚");
                }

                const description = row['Descripción'] || '';
                const image = row['Imagen'] || '/bolushop.png';

                // Clean HTML from description
                const cleanHtmlDescription = (html: string): string => {
                    if (!html) return '';

                    // Remove HTML tags but preserve content
                    let text = html
                        .replace(/<div[^>]*>/gi, '')
                        .replace(/<\/div>/gi, '\n')
                        .replace(/<p[^>]*>/gi, '')
                        .replace(/<\/p>/gi, '\n')
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]+>/g, '') // Remove any other HTML tags
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .trim();

                    // Clean up multiple newlines and spaces
                    text = text
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join('. ');

                    return text;
                };

                const cleanDescription = cleanHtmlDescription(description);

                // Fallback logical for category
                const categoryRaw = row['Categorias'] || row['Tags'] || '';
                let category = categoryRaw.trim();

                // AUTO-CATEGORIZATION: Simple fallback if no category
                if (!category || category.toLowerCase() === 'varios') {
                    category = 'Varios';
                }

                // Preserve custom image if product already exists
                const productId = String(row['SKU'] || uuidv4());
                const existingProduct = existingProductsMap.get(productId);

                // Use existing custom image if:
                // 1. Product already exists
                // 2. Existing image is not the default bolushop.png
                // 3. Existing image is not empty
                let finalImage = image;
                if (existingProduct &&
                    existingProduct.image &&
                    existingProduct.image !== '/bolushop.png' &&
                    !existingProduct.image.includes('dropers')) {
                    finalImage = existingProduct.image; // Preserve custom image
                }

                return {
                    id: productId,
                    name: row['Nombre'] || 'Sin Nombre',
                    slug: row['Identificador de URL'] || (row['Nombre'] ? row['Nombre'].toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : uuidv4()),
                    price: price,
                    image: finalImage,
                    category: category,
                    description: cleanDescription,
                    features: features,
                    stock: 99, // Standard stock for imports
                    createdAt: existingProduct?.createdAt || new Date().toISOString(),
                    collections: existingProduct?.collections || [],
                    isActive: existingProduct?.isActive ?? true
                } as Product;
            });
        }

        const validProducts = (mappedProducts.filter(p => p !== null && p.name && p.name !== 'Sin Nombre' && p.price > 0) as Product[]);

        if (validProducts.length > 0) {
            const success = await saveProducts(validProducts);
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

// Collection Actions
export async function createCollectionAction(collection: Omit<Collection, 'id'>) {
    const collections = await getAllCollections();
    const newCollection: Collection = {
        ...collection,
        id: uuidv4(),
    };

    collections.push(newCollection);
    const success = await saveCollections(collections);
    if (!success) return { success: false, error: "Error al guardar colección" };
    revalidatePath("/admin/collections");
    return { success: true, collection: newCollection };
}

export async function deleteCollectionAction(id: string) {
    const collections = await getAllCollections();
    const newCollections = collections.filter(c => c.id !== id);
    const success = await saveCollections(newCollections);
    if (!success) return { success: false, error: "Error al borrar colección" };
    revalidatePath("/admin/collections");
    return { success: true };
}

export async function updateCollectionAction(updatedCollection: Collection) {
    const collections = await getAllCollections();
    const index = collections.findIndex(c => c.id === updatedCollection.id);

    if (index !== -1) {
        collections[index] = updatedCollection;
        const success = await saveCollections(collections);
        revalidatePath("/admin/collections");
        return { success: true };
    }
    return { success: false, error: "Colección no encontrada" };
}

// Category Actions
export async function createCategoryAction(category: Omit<Category, 'id'>) {
    const categories = await getAllCategories();
    const newCategory: Category = {
        ...category,
        id: uuidv4(),
    };

    categories.push(newCategory);
    const success = await saveCategories(categories);
    if (!success) return { success: false, error: "Error al guardar categoría" };
    revalidatePath("/admin/products");
    return { success: true, category: newCategory };
}

export async function deleteCategoryAction(id: string) {
    const categories = await getAllCategories();
    const newCategories = categories.filter(c => c.id !== id);
    const success = await saveCategories(newCategories);
    if (!success) return { success: false, error: "Error al borrar categoría" };
    revalidatePath("/admin/products");
    return { success: true };
}

export async function updateCategoryAction(updatedCategory: Category) {
    const categories = await getAllCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);

    if (index !== -1) {
        categories[index] = updatedCategory;
        const success = await saveCategories(categories);
        revalidatePath("/admin/products");
        return { success: true };
    }
    return { success: false, error: "Categoría no encontrada" };
}

// Bulk Actions
export async function bulkUpdatePricesAction(percentage: number, categoryId?: string) {
    const products = await getAllProducts();
    const multiplier = 1 + (percentage / 100);

    const updatedProducts = products.map(p => {
        if (!categoryId || p.categoryId === categoryId || p.category === categoryId) {
            return { ...p, price: Math.round(p.price * multiplier) };
        }
        return p;
    });

    const success = await saveProducts(updatedProducts);
    if (!success) return { success: false, error: "Error al actualizar precios masivamente" };

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, count: updatedProducts.length };
}

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: "No file provided" };

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (e: any) {
        console.error("❌ Storage Upload Error:", e);
        return { success: false, error: e.message || "Error al subir imagen" };
    }
}

export async function getCategoriesAction() {
    return await getAllCategories();
}

// Orders Actions
export async function updateOrderStatusAction(orderId: string, newStatus: string) {
    try {
        await updateOrder(orderId, { status: newStatus as Order['status'] });
        revalidatePath('/admin/orders');
        revalidatePath('/rastreo');
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getAllOrdersAction() {
    return await getAllOrders();
}
