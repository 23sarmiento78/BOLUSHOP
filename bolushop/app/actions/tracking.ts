"use server";

import { getAllOrders } from "@/lib/db";
import { Order } from "@/lib/types";

export async function getOrderByIdAction(orderId: string): Promise<Order | null> {
    const orders = await getAllOrders();
    return orders.find(o => o.id === orderId) || null;
}
