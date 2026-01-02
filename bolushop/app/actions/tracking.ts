"use server";

import { getOrderById } from "@/lib/db";
import { Order } from "@/lib/types";

export async function getOrderByIdAction(orderId: string): Promise<Order | null> {
    const order = await getOrderById(orderId);
    return order || null;
}
