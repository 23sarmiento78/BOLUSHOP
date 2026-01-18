import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';
import { supabaseReviews } from './supabase-reviews';

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

import { Category, Collection, Product, Order, Settings, Review, Newsletter } from './types';

const DEFAULT_SETTINGS: Settings = {
    profitMargin: 1.05,
    shippingCost: 5000,
    shippingJson: {
        caba: 3000,
        gba1: 5000,
        gba2: 5500,
        gba3: 8500,
        rest: 9000
    },
    siteName: "BoluShop",
    siteDescription: "Tu Marketplace Premium en Argentina. Calidad, confianza y envíos rápidos a todo el país.",
    whatsappNumber: "3541237972"
};

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.warn("⚠️ Could not create data directory (expected on Vercel):", e);
    }
}

// Helpers
function readJson<T>(file: string, defaultData: T): T {
    if (!fs.existsSync(file)) {
        try {
            fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
        } catch (e) {
            console.warn(`⚠️ Could not write default data to ${file} (expected on Vercel)`);
        }
        return defaultData;
    }
    try {
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`❌ Error reading ${file}:`, e);
        return defaultData;
    }
}

export function writeJson(file: string, data: any): boolean {
    const isVercel = process.env.VERCEL === '1';
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (e: any) {
        // Silently skip if on Vercel read-only filesystem
        if (isVercel || e.code === 'EROFS') {
            return false;
        }
        console.error(`❌ Error writing to ${file}:`, e);
        return false;
    }
}

// Settings API
export async function getSettings(): Promise<Settings> {
    const localSettings = readJson<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS);
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (data) {
            return {
                profitMargin: data.profit_margin,
                shippingCost: data.shipping_cost,
                shippingJson: data.shipping_json || DEFAULT_SETTINGS.shippingJson,
                siteName: data.site_name,
                siteDescription: data.site_description,
                whatsappNumber: data.whatsapp_number
            };
        }
    } catch (e) {
        console.warn("⚠️ Supabase Settings Fetch Error:", e);
    }
    return localSettings;
}

export async function saveSettings(settings: Settings): Promise<{ success: boolean, error?: string }> {
    const localSuccess = writeJson(SETTINGS_FILE, settings);
    try {
        const { error } = await supabase
            .from('settings')
            .upsert({
                id: 1,
                profit_margin: settings.profitMargin,
                shipping_cost: settings.shippingCost,
                shipping_json: settings.shippingJson,
                site_name: settings.siteName,
                site_description: settings.siteDescription,
                whatsapp_number: settings.whatsappNumber,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error("❌ Supabase Settings Sync Error:", error);
            return {
                success: localSuccess,
                error: (error as any).message || JSON.stringify(error)
            };
        }
        return { success: true };
    } catch (e: any) {
        console.error("❌ Supabase Settings Sync Error (Catch):", e);
        return {
            success: localSuccess,
            error: e.message || 'Unknown error'
        };
    }
}

// Products API
export async function getAllProducts(): Promise<Product[]> {
    const localProducts = readJson<Product[]>(PRODUCTS_FILE, []);
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            const supabaseProducts = data.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                image: p.image,
                category: p.category,
                categoryId: p.category_id,
                description: p.description,
                features: p.features || [],
                stock: p.stock,
                collections: p.collections || [],
                createdAt: p.created_at,
                isActive: p.is_active ?? true
            }));

            // Merge: Supabase takes precedence
            const productsMap = new Map<string, Product>();
            localProducts.forEach(p => productsMap.set(p.id, p));
            supabaseProducts.forEach(p => productsMap.set(p.id, p));
            return Array.from(productsMap.values()).sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
    } catch (e) {
        console.error("❌ Supabase Products Fetch Error:", e);
    }
    return localProducts;
}

export async function saveProducts(products: Product[]): Promise<{ success: boolean, error?: string }> {
    const localSuccess = writeJson(PRODUCTS_FILE, products);
    // Sync to Supabase - caution: this overwrites/upserts multiple
    try {
        const toUpsert = products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.image,
            category: p.category,
            category_id: p.categoryId,
            description: p.description,
            features: p.features,
            stock: p.stock,
            collections: p.collections,
            created_at: p.createdAt,
            is_active: p.isActive ?? true
        }));

        const { error } = await supabase.from('products').upsert(toUpsert, { onConflict: 'id' });
        if (error) {
            console.error("❌ Supabase Products Sync Error:", error);
            return {
                success: localSuccess,
                error: (error as any).message || JSON.stringify(error)
            };
        }
        return { success: true };
    } catch (e: any) {
        console.error("❌ Supabase Products Sync Error:", e);
        return {
            success: localSuccess,
            error: e.message || 'Unknown error'
        };
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    const products = await getAllProducts();
    const filtered = products.filter(p => p.id !== id);
    const localSuccess = writeJson(PRODUCTS_FILE, filtered);
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            console.error("❌ Supabase Product Delete Error:", error);
            return localSuccess;
        }
        return true;
    } catch (e) {
        console.error("❌ Supabase Product Delete Error:", e);
        return localSuccess;
    }
}

export async function deleteAllProducts(): Promise<boolean> {
    const localSuccess = writeJson(PRODUCTS_FILE, []);
    try {
        const { error } = await supabase.from('products').delete().neq('id', '0');
        if (error) {
            console.error("❌ Supabase Delete All Products Error:", error);
            return localSuccess;
        }
        return true;
    } catch (e) {
        console.error("❌ Supabase Delete All Products Error:", e);
        return localSuccess;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const products = await getAllProducts();
    return products.find(p => p.slug === slug);
}

// Orders API
export async function getAllOrders(): Promise<Order[]> {
    const localOrders = readJson<Order[]>(ORDERS_FILE, []);
    let supabaseOrders: Order[] = [];

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Supabase Fetch Error (Orders):", error);
            throw error;
        }

        if (data && data.length > 0) {
            console.log(`✅ Supabase: Fetched ${data.length} orders`);
            supabaseOrders = data.map(o => ({
                id: o.external_id || o.id,
                date: o.created_at,
                status: o.status,
                items: o.items,
                total: o.total,
                payer: {
                    name: o.payer_name,
                    email: o.payer_email,
                    dni: o.payer_dni,
                    address: o.payer_address,
                    phone: o.payer_phone
                },
                paymentId: o.payment_id
            }));
        }
    } catch (e) {
        console.error("❌ Supabase Fetch Error:", e);
    }

    // Smart Merge: Use a Map to keep unique orders, Supabase version takes precedence
    const allOrdersMap = new Map<string, Order>();
    localOrders.forEach(o => allOrdersMap.set(o.id, o));
    supabaseOrders.forEach(o => allOrdersMap.set(o.id, o));

    const totalOrders = Array.from(allOrdersMap.values()).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return totalOrders;
}

export async function createOrder(order: Order) {
    console.log(`🚀 Iniciando creación de orden ${order.id} en DB...`);

    // 1. Sync to Supabase - PRIORIDAD 1
    try {
        const { error } = await supabase.from('orders').insert([{
            created_at: order.date,
            status: order.status,
            total: order.total,
            payer_name: order.payer.name,
            payer_email: order.payer.email,
            payer_dni: order.payer.dni || 'N/A',
            payer_address: order.payer.address,
            payer_phone: order.payer.phone || 'N/A',
            items: order.items.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                image: i.image
            })), // Sanitizar items para asegurar JSON limpio
            payment_id: order.paymentId,
            external_id: order.id
        }]);

        if (error) {
            console.error("❌ Supabase Insertion Error Detail:", JSON.stringify(error, null, 2));
            // Show the actual payload for debugging
            console.log("Payload attempted:", JSON.stringify(order, null, 2));
            throw error;
        }
        console.log(`✅ Orden ${order.id} sincronizada correctamente en Supabase`);
    } catch (e) {
        console.error("❌ Fatal Supabase Sync Error:", e);
        // No lanzamos error aquí para permitir que el proceso local continúe si es posible,
        // pero registramos el fallo crítico.
    }

    // 2. Auto Subtract Stock (Optimized)
    try {
        // Ejecutar en paralelo pero no bloquear el retorno si falla alguno
        Promise.all(order.items.map(item => subtractStock(item.id, item.quantity || 1)))
            .then(() => console.log("📉 Stock actualizado en Supabase"))
            .catch(err => console.error("❌ Error actualizando stock:", err));
    } catch (e) {
        console.error("❌ Stock Subtraction Error:", e);
    }

    // 3. Minimal local save (para desarrollo)
    try {
        const localOrders = readJson<Order[]>(ORDERS_FILE, []);
        localOrders.push(order);
        writeJson(ORDERS_FILE, localOrders);
        console.log("💾 Orden guardada localmente");
    } catch (e) {
        // En Vercel esto fallará siempre, es normal
        console.warn("⚠️ Local JSON save failed (Expected on Vercel)");
    }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());

        let query = supabase.from('orders').select('*');

        if (isUUID) {
            query = query.eq('external_id', id.trim());
        } else {
            // If it looks like a number, try id eq
            if (/^\d+$/.test(id)) {
                query = query.eq('id', parseInt(id));
            } else {
                query = query.eq('external_id', id);
            }
        }

        const { data, error } = await query.single();

        if (data) {
            return {
                id: data.external_id || data.id,
                date: data.created_at,
                status: data.status,
                items: data.items,
                total: data.total,
                payer: {
                    name: data.payer_name,
                    email: data.payer_email,
                    dni: data.payer_dni,
                    address: data.payer_address,
                    phone: data.payer_phone
                },
                paymentId: data.payment_id
            };
        }
    } catch (e) {
        console.warn("⚠️ Supabase Fetch ID Error:", e);
    }

    const orders = await getAllOrders();
    return orders.find(o => o.id === id);
}

export async function updateOrder(id: string, updates: Partial<Order>) {
    const orders = await getAllOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        writeJson(ORDERS_FILE, orders.filter(o => o.id)); // Filter out potential errors

        // Sync to Supabase
        try {
            const cleanId = id.trim();
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

            const updatePayload: any = {
                status: updates.status
            };
            if (updates.paymentId) updatePayload.payment_id = updates.paymentId;

            let query = supabase.from('orders').update(updatePayload);

            if (isUUID) {
                query = query.eq('external_id', cleanId);
            } else if (/^\d+$/.test(cleanId)) {
                query = query.eq('id', parseInt(cleanId));
            } else {
                query = query.eq('external_id', cleanId);
            }

            const { error: syncError } = await query;

            if (syncError) {
                console.error("❌ Supabase Sync Error (Update):", syncError);
            } else {
                console.log(`✅ Supabase updated for order ${cleanId} to ${updates.status}`);
            }
        } catch (e) {
            console.warn("⚠️ Supabase Sync Error (Catch):", e);
        }

        return orders[index];
    }
    return null;
}

export async function subtractStock(productId: string, quantity: number) {
    try {
        // 1. Local update
        const localProducts = readJson<Product[]>(PRODUCTS_FILE, []);
        const index = localProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            localProducts[index].stock = Math.max(0, (localProducts[index].stock || 0) - quantity);
            writeJson(PRODUCTS_FILE, localProducts);
        }

        // 2. Supabase Atomic Update (RPC or single update)
        // If we don't have an RPC for atomic decrement, we do a quick select-update
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single();

        if (fetchError || !product) {
            console.error(`❌ Product ${productId} not found in Supabase for stock update`);
            return false;
        }

        const newStock = Math.max(0, (product.stock || 0) - quantity);
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', productId);

        if (updateError) {
            console.error(`❌ Supabase Stock Update Error for ${productId}:`, updateError);
            return false;
        }

        return true;
    } catch (e) {
        console.error(`❌ Fatal Error in subtractStock for ${productId}:`, e);
        return false;
    }
}

// Collections API
export async function getAllCollections(): Promise<Collection[]> {
    const localCollections = readJson<Collection[]>(COLLECTIONS_FILE, []);
    try {
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('name', { ascending: true });

        if (data && data.length > 0) {
            const supabaseCollections = data.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description,
                image: c.image,
                discountType: c.discount_type,
                discountValue: c.discount_value,
                isFeatured: c.is_featured,
                productIds: c.product_ids || []
            }));

            const collectionsMap = new Map<string, Collection>();
            localCollections.forEach(c => collectionsMap.set(c.id, c));
            supabaseCollections.forEach(c => collectionsMap.set(c.id, c));
            return Array.from(collectionsMap.values());
        }
    } catch (e) {
        console.error("❌ Supabase Collections Fetch Error:", e);
    }
    return localCollections;
}

export async function saveCollections(collections: Collection[]): Promise<{ success: boolean, error?: string }> {
    const localSuccess = writeJson(COLLECTIONS_FILE, collections);
    try {
        const toUpsert = collections.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image,
            discount_type: c.discountType || 'none',
            discount_value: c.discountValue || 0,
            is_featured: c.isFeatured || false,
            product_ids: c.productIds || []
        }));

        const { error } = await supabase.from('collections').upsert(toUpsert, { onConflict: 'id' });
        if (error) {
            console.error("❌ Supabase Collections Sync Error:", error);
            return {
                success: localSuccess,
                error: (error as any).message || JSON.stringify(error)
            };
        }
        return { success: true };
    } catch (e: any) {
        console.error("❌ Supabase Collections Sync Error:", e);
        return {
            success: localSuccess,
            error: e.message || 'Unknown error'
        };
    }
}

export async function deleteCollection(id: string): Promise<boolean> {
    const collections = await getAllCollections();
    const filtered = collections.filter(c => c.id !== id);
    const localSuccess = writeJson(COLLECTIONS_FILE, filtered);
    try {
        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (error) {
            console.error("❌ Supabase Collection Delete Error:", error);
            return localSuccess;
        }
        return true;
    } catch (e) {
        console.error("❌ Supabase Collection Delete Error:", e);
        return localSuccess;
    }
}

// Categories API
export async function getAllCategories(): Promise<Category[]> {
    const localCategories = readJson<Category[]>(CATEGORIES_FILE, []);
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (data && data.length > 0) {
            const supabaseCategories = data.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description
            }));

            const categoriesMap = new Map<string, Category>();
            localCategories.forEach(c => categoriesMap.set(c.id, c));
            supabaseCategories.forEach(c => categoriesMap.set(c.id, c));
            return Array.from(categoriesMap.values());
        }
    } catch (e) {
        console.error("❌ Supabase Categories Fetch Error:", e);
    }
    return localCategories;
}

export async function saveCategories(categories: Category[]): Promise<{ success: boolean, error?: string }> {
    const localSuccess = writeJson(CATEGORIES_FILE, categories);
    try {
        const toUpsert = categories.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description
            // Nota: Se omite 'image' por ahora para coincidir con el esquema SUPABASE_SCHEMA.sql
            // Si deseas imágenes en categorías, debes agregar la columna 'image' a la tabla 'categories'
        }));

        const { error } = await supabase.from('categories').upsert(toUpsert, { onConflict: 'id' });
        if (error) {
            console.error("❌ Supabase Categories Sync Error:", error.message || error);
            return {
                success: localSuccess,
                error: (error as any).message || JSON.stringify(error)
            };
        }
        return { success: true };
    } catch (e: any) {
        console.error("❌ Supabase Categories Sync Error:", e);
        return {
            success: localSuccess,
            error: e.message || 'Unknown error'
        };
    }
}

export async function deleteCategory(id: string): Promise<boolean> {
    const categories = await getAllCategories();
    const filtered = categories.filter(c => c.id !== id);
    const localSuccess = writeJson(CATEGORIES_FILE, filtered);
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            console.error("❌ Supabase Category Delete Error:", error);
            return localSuccess;
        }
        return true;
    } catch (e) {
        console.error("❌ Supabase Category Delete Error:", e);
        return localSuccess;
    }
}

// Reviews API
export async function getProductReviews(productId: string): Promise<Review[]> {
    const localReviews = readJson<Review[]>(REVIEWS_FILE, []);
    const productReviews = localReviews.filter(r => r.productId === productId);

    try {
        const { data, error } = await supabaseReviews
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('date', { ascending: false });

        if (data && data.length > 0) {
            return data.map(r => ({
                id: r.id,
                productId: r.product_id,
                userName: r.user_name,
                rating: r.rating,
                comment: r.comment,
                date: r.date
            }));
        }
    } catch (e) {
        console.warn("⚠️ Supabase Reviews Fetch Error:", e);
    }
    return productReviews;
}

export async function addProductReview(review: Review): Promise<boolean> {
    const allReviews = readJson<Review[]>(REVIEWS_FILE, []);

    // Filter reviews for this product
    const productReviews = allReviews.filter(r => r.productId === review.productId);

    // Limit to 10: If we have 10, remove the oldest one
    if (productReviews.length >= 10) {
        const oldestIndex = allReviews.indexOf(productReviews[0]);
        if (oldestIndex !== -1) allReviews.splice(oldestIndex, 1);
    }

    allReviews.push(review);
    writeJson(REVIEWS_FILE, allReviews);

    try {
        // For Supabase, we also want to limit if possible, or just insert
        // Since it's a "free version", we'll respect the 10-limit by deleting the oldest if count > 10
        const { data: countData } = await supabaseReviews
            .from('reviews')
            .select('id', { count: 'exact' })
            .eq('product_id', review.productId);

        if (countData && countData.length >= 10) {
            const { data: oldest } = await supabaseReviews
                .from('reviews')
                .select('id')
                .eq('product_id', review.productId)
                .order('date', { ascending: true })
                .limit(1)
                .single();

            if (oldest) {
                await supabaseReviews.from('reviews').delete().eq('id', oldest.id);
            }
        }

        const { error } = await supabaseReviews.from('reviews').insert([{
            id: review.id,
            product_id: review.productId,
            user_name: review.userName,
            rating: review.rating,
            comment: review.comment,
            date: review.date
        }]);
        if (error) console.error("❌ Supabase Review Insert Error:", error);
    } catch (e) {
        console.error("❌ Supabase Review Sync Error:", e);
    }
    return true;
}
// Newsletter API
export async function subscribeToNewsletter(email: string): Promise<boolean> {
    const emails = readJson<Newsletter[]>(NEWSLETTER_FILE, []);
    if (emails.find(e => e.email === email)) return true;

    const entry = { email, createdAt: new Date().toISOString() };
    emails.push(entry);
    writeJson(NEWSLETTER_FILE, emails);

    try {
        const { error } = await supabase.from('newsletter').insert([{
            email: entry.email,
            created_at: entry.createdAt
        }]);
        if (error) console.error("❌ Supabase Newsletter Error:", error);
    } catch (e) {
        console.error("❌ Supabase Newsletter Sync Error:", e);
    }
    return true;
}

export async function getNewsletterSubscribers(): Promise<Newsletter[]> {
    const localEmails = readJson<Newsletter[]>(NEWSLETTER_FILE, []);
    try {
        const { data, error } = await supabase
            .from('newsletter')
            .select('*')
            .order('createdAt', { ascending: false });

        if (data && data.length > 0) {
            return data.map(e => ({
                id: e.id,
                email: e.email,
                createdAt: e.created_at || e.createdAt
            }));
        }
    } catch (e) {
        console.warn("⚠️ Supabase Newsletter Fetch Error:", e);
    }
    return localEmails;
}

export async function deleteNewsletterSubscriber(email: string): Promise<boolean> {
    const emails = readJson<Newsletter[]>(NEWSLETTER_FILE, []);
    const filtered = emails.filter(e => e.email !== email);
    writeJson(NEWSLETTER_FILE, filtered);

    try {
        await supabase.from('newsletter').delete().eq('email', email);
    } catch (e) {
        console.error("❌ Supabase Newsletter Delete Error:", e);
    }
    return true;
}
