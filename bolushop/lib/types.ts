export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
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
    holiday?: string; // Links to lib/holidays.ts
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    cost?: number; // Added for new pricing logic
    image: string;
    images?: string[];
    category: string;
    categoryId?: string;
    description: string;
    features: string[];
    stock: number;
    collections?: string[];
    createdAt: string;
    isActive?: boolean;
    isInternational?: boolean; // CJ Dropshipping support
    cjSku?: string;
    cjProductId?: string;
    usdPrice?: number;
    shippingUsd?: number;
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    items: (Product & { quantity: number })[];
    total: number;
    payer: {
        email: string;
        name: string;
        dni?: string;
        address: string | any;
        phone?: string;
    };
    paymentId?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    cjOrderId?: string;
}

export interface Settings {
    profitMargin: number;
    shippingCost: number; // Base
    averageShippingCost?: number; // Added for bundled pricing
    isFreeShippingEnabled?: boolean; // Added for "Free Shipping Total" mode
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
    minPurchaseAmount?: number;
    cjApiToken?: string;
    cjApiSecret?: string;
}

export interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Newsletter {
    id?: string;
    email: string;
    createdAt: string;
}
