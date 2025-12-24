import { getProductBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductActions from '@/components/ProductActions';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-6">
                        {product.features?.includes("Envío Gratis 🚚") ? (
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-bold">
                                ⚡ Envío GRATIS
                            </span>
                        ) : (
                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold border border-gray-200">
                                📦 Envío a cargo del comprador
                            </span>
                        )}
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">Stock Disponible</span>
                    </div>

                    <div className="text-4xl font-bold text-primary mb-6">
                        ${product.price.toLocaleString('es-AR')}
                    </div>

                    <div
                        className="text-gray-600 text-lg mb-8 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />

                    <ul className="mb-8 space-y-3">
                        {product.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                <span className="text-primary w-5 h-5 flex items-center justify-center font-bold bg-green-100 rounded-full text-xs">✓</span> {f}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Footer Sticky / Desktop Static */}
                    <div className="mt-auto">
                        <ProductActions product={product} />
                        <p className="text-center text-sm text-gray-400 mt-4">
                            Protegido por MercadoPago. Garantía de 30 días.
                        </p>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                            <p className="font-semibold mb-1">🚚 Tiempos de Envío:</p>
                            <ul className="list-disc pl-4 space-y-1 opacity-90">
                                <li><strong>CABA y GBA (Moto):</strong> 48hs hábiles post-despacho.</li>
                                <li><strong>Resto del país/Buenos Aires:</strong> 2 a 5 días hábiles.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
