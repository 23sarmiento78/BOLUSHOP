import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
    title: "Compra Exitosa",
    description: "Tu compra en BoluShop fue procesada correctamente.",
    path: "/exito",
    noIndex: true,
});

export default function ExitoLayout({ children }: { children: React.ReactNode }) {
    return children;
}
