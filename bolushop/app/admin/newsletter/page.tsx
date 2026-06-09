import { getAllCollections, getAllProducts } from "@/lib/db";
import NewsletterAdminClient from "./NewsletterAdminClient";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter Admin | BoluShop",
};

export default async function NewsletterAdminPage() {
    const [collections, products] = await Promise.all([
        getAllCollections(),
        getAllProducts(),
    ]);

    const activeProducts = products.filter((p) => p.isActive !== false && p.price > 0);

    return (
        <NewsletterAdminClient
            collections={collections}
            products={activeProducts}
        />
    );
}
