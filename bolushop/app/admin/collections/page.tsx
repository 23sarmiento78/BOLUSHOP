import { getAllCollections } from "@/lib/db";
import CollectionsClient from "./CollectionsClient";

export default function CollectionsPage() {
    const collections = getAllCollections();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Colecciones</h1>
                    <p className="text-gray-500 font-medium">Agrupá tus productos para destacarlos en la tienda.</p>
                </div>
            </div>

            <CollectionsClient initialCollections={collections} />
        </div>
    );
}
