import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Carrito de Compras",
    description: "Revisá los productos en tu carrito de BoluShop antes de finalizar la compra.",
    path: "/carrito",
    noIndex: true,
});

export default function CarritoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
