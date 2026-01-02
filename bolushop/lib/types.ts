export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Collection {
    id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    discountType?: 'percentage' | 'fixed' | 'none';
    discountValue?: number;
    isFeatured?: boolean;
    productIds?: string[];
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
    categoryId?: string;
    description: string;
    features: string[];
    stock: number;
    collections?: string[];
    createdAt: string;
    isActive?: boolean;
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
        address: string | any;
        phone?: string;
    };
    paymentId?: string;
}

export interface Settings {
    profitMargin: number;
    shippingCost: number; // Base
    shippingJson: {
        caba: number;
        gba1: number;
        gba2: number;
        gba3: number;
        rest: number;
    };
    siteName: string;
    siteDescription: string;
    whatsappNumber: string;
}
