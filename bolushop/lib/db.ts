import fs from 'fs';
import path from 'path';

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

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
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    items: Product[];
    total: number;
    payer: {
        email?: string;
        name?: string;
    };
    paymentId?: string;
}

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers
function readJson<T>(file: string, defaultData: T): T {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    try {
        const data = fs.readFileSync(file, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error reading ${file}`, e);
        return defaultData;
    }
}

function writeJson(file: string, data: any) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Products API
export function getAllProducts(): Product[] {
    return readJson<Product[]>(PRODUCTS_FILE, []);
}

export function saveProducts(products: Product[]) {
    writeJson(PRODUCTS_FILE, products);
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
