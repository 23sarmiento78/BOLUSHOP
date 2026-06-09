export interface FaqItem {
    question: string;
    answer: string;
}

/** FAQs oficiales de BoluShop — envíos, garantías, devoluciones y Mercado Libre */
export const SHOP_FAQ: FaqItem[] = [
    {
        question: "¿Hacen reintegros / reembolsos?",
        answer:
            "Durante el periodo de devolución se reintegrará el 100% de tu compra, incluyendo el valor de envío abonado al despachar el producto y el envío utilizado para la devolución. Posterior a este plazo ya corre la garantía en curso, la cual no cubre los gastos de flete o transporte del mismo hacia nuestro depósito.",
    },
    {
        question: "¿Tienen garantía los productos?",
        answer:
            "Todos nuestros productos poseen garantía. También tienen devolución exprés dentro de los 10 días de recibida la compra: ante cualquier fallo o disconformidad podés realizar la devolución en ese plazo sin costo. Las devoluciones deben ser completas, no parciales. El producto deberá estar completo y sin uso, con su caja y todos sus accesorios, incluyendo su packaging original.",
    },
    {
        question: "¿Qué pasa si un paquete no es entregado y vuelve al depósito?",
        answer:
            "Si por alguna razón la compra no llega a destino y vuelve a nuestro depósito, se anula la compra y se realiza la correspondiente devolución total de dinero.",
    },
    {
        question: "¿Hasta dónde llegan los envíos?",
        answer: "Los envíos llegan a toda la República Argentina.",
    },
    {
        question: "¿Qué logística utilizan para los envíos?",
        answer:
            "Para los envíos de CABA y GBA utilizamos moto mensajería express. Para el interior de Buenos Aires y el resto del país utilizamos Correo Argentino.",
    },
    {
        question: "¿Qué demora tienen los envíos?",
        answer:
            "Los envíos de moto mensajería de CABA y GBA se entregan dentro de las primeras 48 horas hábiles luego de despachado el pedido. Para los envíos de Buenos Aires y resto del país la demora es de entre 2 a 5 días hábiles, según la distancia.",
    },
    {
        question: "¿Cómo funcionan los productos de Mercado Libre?",
        answer:
            "Para los productos comprados a través de los links de referidos de Mercado Libre, la devolución de los mismos y el proceso de compra se hace desde Mercado Libre.",
    },
];

/** Alias usado en landings y categorías */
export const COMMON_FAQ: FaqItem[] = SHOP_FAQ;
