import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Pago Rechazado",
    description: "El pago de tu compra en BoluShop no pudo procesarse. Intentá nuevamente.",
    path: "/rechazado",
    noIndex: true,
});

export default function RechazadoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
