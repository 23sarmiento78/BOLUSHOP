import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Checkout",
    description: "Finalizá tu compra en BoluShop de forma segura con MercadoPago.",
    path: "/checkout",
    noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
