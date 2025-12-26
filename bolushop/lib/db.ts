import fs from 'fs';
import path from 'path';

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
        email?: string;
        name?: string;
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
    siteDescription: "La mejor tienda de dropshipping en Argentina",
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
export function getAllOrders(): Order[] {
    return readJson<Order[]>(ORDERS_FILE, []);
}

export function createOrder(order: Order) {
    const orders = getAllOrders();
    orders.push(order);
    writeJson(ORDERS_FILE, orders);

    // Auto Subtract Stock
    order.items.forEach(item => {
        subtractStock(item.id, item.quantity || 1);
    });
}

export function getOrderById(id: string): Order | undefined {
    const orders = getAllOrders();
    return orders.find(o => o.id === id);
}

export function updateOrder(id: string, updates: Partial<Order>) {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        writeJson(ORDERS_FILE, orders);
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
