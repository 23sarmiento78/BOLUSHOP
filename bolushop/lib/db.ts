import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

import { Category, Collection, Product, Order, Settings } from './types';

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
    whatsappNumber: "5491122334455"
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

function writeJson(file: string, data: any): boolean {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error(`❌ Error writing to ${file} (expected on Vercel):`, e);
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

export async function saveSettings(settings: Settings): Promise<boolean> {
    const success = writeJson(SETTINGS_FILE, settings);
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
            });
        if (error) console.error("❌ Supabase Settings Sync Error:", error);
    } catch (e) {
        console.error("❌ Supabase Settings Sync Error:", e);
    }
    return success;
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

export async function saveProducts(products: Product[]): Promise<boolean> {
    const success = writeJson(PRODUCTS_FILE, products);
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

        const { error } = await supabase.from('products').upsert(toUpsert);
        if (error) console.error("❌ Supabase Products Sync Error:", error);
    } catch (e) {
        console.error("❌ Supabase Products Sync Error:", e);
    }
    return success;
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

        if (error) throw error;

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
    const orders = await getAllOrders();
    orders.push(order);
    writeJson(ORDERS_FILE, orders);

    // Auto Subtract Stock
    for (const item of order.items) {
        await subtractStock(item.id, item.quantity || 1);
    }

    // Sync to Supabase
    try {
        const { error } = await supabase.from('orders').insert([{
            created_at: order.date,
            status: order.status,
            total: order.total,
            payer_name: order.payer.name,
            payer_email: order.payer.email,
            payer_address: order.payer.address,
            payer_phone: order.payer.phone || 'N/A',
            items: order.items,
            payment_id: order.paymentId,
            external_id: order.id
        }]);
        if (error) console.error("❌ Supabase Sync Error:", error);
        else console.log("✅ Order synced to Supabase");
    } catch (e) {
        console.error("❌ Supabase Sync Error (Insert):", e);
    }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .or(`external_id.eq.${id},id.eq.${id}`)
            .single();

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
            // Try update with OR filter to catch either external_id or native id
            const { error: syncError } = await supabase
                .from('orders')
                .update({
                    status: updates.status,
                    payment_id: updates.paymentId
                })
                .or(`external_id.eq.${id},id.eq.${id}`);

            if (syncError) {
                console.error("❌ Supabase Sync Error (Update):", syncError);
            } else {
                console.log(`✅ Supabase updated for order ${id}`);
            }
        } catch (e) {
            console.warn("⚠️ Supabase Sync Error (Catch):", e);
        }

        return orders[index];
    }
    return null;
}

export async function subtractStock(productId: string, quantity: number) {
    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index].stock = Math.max(0, (products[index].stock || 0) - quantity);
        await saveProducts(products);
        return true;
    }
    return false;
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

export async function saveCollections(collections: Collection[]): Promise<boolean> {
    const success = writeJson(COLLECTIONS_FILE, collections);
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

        const { error } = await supabase.from('collections').upsert(toUpsert);
        if (error) console.error("❌ Supabase Collections Sync Error:", error);
    } catch (e) {
        console.error("❌ Supabase Collections Sync Error:", e);
    }
    return success;
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

export async function saveCategories(categories: Category[]): Promise<boolean> {
    const success = writeJson(CATEGORIES_FILE, categories);
    try {
        const toUpsert = categories.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description
        }));

        const { error } = await supabase.from('categories').upsert(toUpsert);
        if (error) console.error("❌ Supabase Categories Sync Error:", error);
    } catch (e) {
        console.error("❌ Supabase Categories Sync Error:", e);
    }
    return success;
}
