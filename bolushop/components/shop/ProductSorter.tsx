"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSorter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-500">Ordenar por:</span>
            <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer text-sm"
            >
                <option value="newest">Más Recientes</option>
                <option value="price_asc">Menor Precio</option>
                <option value="price_desc">Mayor Precio</option>
            </select>
        </div>
    );
}
