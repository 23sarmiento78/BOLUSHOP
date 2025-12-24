"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    const handleAddClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the product page
        e.stopPropagation();
        addToCart(product);
        // Optional: Can add a toast or small animation here
    };

    return (
        <div className="block group h-full relative">
            <Link href={`/producto/${product.slug}`} className="block h-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 h-full flex flex-col">
                    <div className="relative aspect-square bg-gray-50">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {product.price < 20000 && (
                            <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                                OFERTA
                            </span>
                        )}

                        {/* Quick Add Button Overlay */}
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <button
                                onClick={handleAddClick}
                                className="bg-white hover:bg-primary hover:text-white text-primary p-3 rounded-full shadow-lg border border-gray-100 transition-colors"
                                title="Agregar al carrito"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                        <div className="mt-auto">
                            <div className="text-primary font-bold text-lg">${product.price.toLocaleString('es-AR')}</div>
                            {product.features?.includes("Envío Gratis 🚚") && (
                                <div className="text-green-600 text-xs font-semibold mt-1 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a2.5 2.5 0 014.9 0H16a1 1 0 001-1V4a1 1 0 00-1-1h-3.141a1 1 0 00-1.618-1.554l-5.381 2.441a1 1 0 00.38 1.838L8.71 4H3z" />
                                    </svg>
                                    Envío GRATIS
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
