"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { transformImageUrl } from "@/lib/images";
import { addToCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: Product }) {
    const [added, setAdded] = useState(false);
    const add = () => {
        if (product.isMlReferral) {
            if (product.mlAffiliateUrl) window.open(product.mlAffiliateUrl, "_blank", "noopener,noreferrer");
            return;
        }
        addToCart(product);
        setAdded(true);
        toast.success("Agregado al carrito", { description: product.name });
        window.setTimeout(() => setAdded(false), 1600);
    };

    return (
        <article className="new-product-card">
            <Link href={`/producto/${product.slug}`} className="new-product-link">
                <div className="new-product-image">
                    <Image src={transformImageUrl(product.image)} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    <span className="new-product-tag">{product.category}</span>
                </div>
                <div className="new-product-info">
                    <h3>{product.name}</h3>
                    <strong>${product.price.toLocaleString("es-AR")}</strong>
                </div>
            </Link>
            <button type="button" onClick={add} disabled={Boolean(product.isMlReferral && !product.mlAffiliateUrl)} className="new-product-action">
                {product.isMlReferral ? <><ExternalLink size={15} /> Ver en ML</> : <><ShoppingCart size={15} /> {added ? "Agregado" : "Sumar"}</>}
            </button>
        </article>
    );
}
