"use server";
import { getOrderById } from "@/lib/db";

export async function getOrderAction(id: string) {
    try {
        const order = getOrderById(id);
        if (!order) return { success: false, error: "Pedido no encontrado" };
        return { success: true, order };
    } catch (e) {
        return { success: false, error: "Error al buscar el pedido" };
    }
}
