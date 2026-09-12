import { Order } from "@/lib/types";

export type PublicOrder = {
    id: string;
    date: string;
    status: Order["status"];
    total: number;
    items: Array<{
        id: string;
        name: string;
        image?: string;
        price: number;
        quantity: number;
    }>;
    trackingNumber?: string;
    trackingUrl?: string;
};

/** Fields safe to return from the public order-tracking experience. */
export function toPublicOrder(order: Order): PublicOrder {
    return {
        id: String(order.id),
        date: order.date,
        status: order.status,
        total: order.total,
        items: order.items.map((item) => ({
            id: String(item.id),
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
        })),
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
    };
}
