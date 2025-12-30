import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
}

// Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
    description: string;
    features: string[];
    stock: number;         // New field
    collections?: string[]; // New field
    createdAt: string;     // New field for sorting
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    items: (Product & { quantity: number })[];
    total: number;
    payer: {
        email: string;
        name: string;
        address: string;
        phone: string;
    };
    paymentId?: string;
}

export interface Settings {
    profitMargin: number;
    shippingCost: number;
    siteName: string;
    siteDescription: string;
    whatsappNumber: string;
}

const DEFAULT_SETTINGS: Settings = {
    profitMargin: 1.05,
    shippingCost: 5000,
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
export function getSettings(): Settings {
    return readJson<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): boolean {
    return writeJson(SETTINGS_FILE, settings);
}

// Products API
export function getAllProducts(): Product[] {
    return readJson<Product[]>(PRODUCTS_FILE, []);
}

export function saveProducts(products: Product[]): boolean {
    return writeJson(PRODUCTS_FILE, products);
}

export function getProductBySlug(slug: string): Product | undefined {
    const products = getAllProducts();
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
    order.items.forEach(item => {
        subtractStock(item.id, item.quantity || 1);
    });

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
            // Try updating by external_id FIRST
            const { error: errorExt } = await supabase
                .from('orders')
                .update({
                    status: updates.status,
                    payment_id: updates.paymentId
                })
                .eq('external_id', id);

            if (errorExt) {
                // FALLBACK: Try updating by the native record ID
                await supabase
                    .from('orders')
                    .update({
                        status: updates.status,
                        payment_id: updates.paymentId
                    })
                    .eq('id', id);
            }

            console.log(`✅ Supabase updated for order ${id}`);
        } catch (e) {
            console.warn("⚠️ Supabase Sync Error (Update):", e);
        }

        return orders[index];
    }
    return null;
}

export function subtractStock(productId: string, quantity: number) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index].stock = Math.max(0, (products[index].stock || 0) - quantity);
        saveProducts(products);
        return true;
    }
    return false;
}

// Collections API
export function getAllCollections(): Collection[] {
    return readJson<Collection[]>(COLLECTIONS_FILE, []);
}

export function saveCollections(collections: Collection[]): boolean {
    return writeJson(COLLECTIONS_FILE, collections);
}
