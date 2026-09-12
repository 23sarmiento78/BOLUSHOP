"use server";

import { getOrderById } from "@/lib/db";
import { PublicOrder, toPublicOrder } from "@/lib/public-order";

export async function getOrderByIdAction(orderId: string): Promise<PublicOrder | null> {
    const order = await getOrderById(orderId);
    return order ? toPublicOrder(order) : null;
}
