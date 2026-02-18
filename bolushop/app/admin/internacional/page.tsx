import { getAllProducts } from "@/lib/db";
import InternacionalClient from "./InternacionalClient";

export const dynamic = 'force-dynamic';

export default async function InternacionalPage() {
    const allProducts = await getAllProducts();
    const internationalProducts = allProducts.filter(p => p.isInternational === true);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                <span className="p-3 bg-blue-100 text-blue-600 rounded-2xl">🌍</span>
                Compra Internacional - CJ Dropshipping
            </h1>

            <InternacionalClient initialProducts={internationalProducts} />
        </div>
    );
}
