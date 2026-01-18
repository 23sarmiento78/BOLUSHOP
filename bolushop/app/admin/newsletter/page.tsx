import { getAllCollections } from "@/lib/db";
import NewsletterAdminClient from "./NewsletterAdminClient";

export const dynamic = "force-dynamic";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter Admin | BoluShop",
};

export default async function NewsletterAdminPage() {
    const collections = await getAllCollections();

    return <NewsletterAdminClient collections={collections} />;
}
