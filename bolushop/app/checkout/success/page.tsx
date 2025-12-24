"use client";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/lib/cart-context';

import { Suspense } from 'react';

import { getOrderAction } from '@/app/actions/orders';
import { useState } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
    const { clearCart } = useCart();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearCart();
        if (orderId) {
            getOrderAction(orderId).then(res => {
                if (res.success) setOrder(res.order);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [clearCart, orderId]);

    const sendWhatsApp = () => {
        if (!order) return;

        const sellerPhone = "3541237972";
        const itemsList = order.items.map((i: any) => `- ${i.name} (x${i.quantity})`).join('\n');

        const message = `*NUEVA ORDEN BOLUSHOP* 🛒\n\n` +
            `*ID:* ${order.id}\n` +
            `*Cliente:* ${order.payer.name}\n` +
            `*Dirección:* ${order.payer.address}\n` +
            `*Email:* ${order.payer.email}\n` +
            `*Teléfono:* ${order.payer.phone || 'No provisto'}\n\n` +
            `*PRODUCTOS:*\n${itemsList}\n\n` +
            `*TOTAL:* $${order.total.toLocaleString('es-AR')}\n\n` +
            `_Por favor, confírmeme cuando reciba este mensaje para coordinar el envío._`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${sellerPhone}?text=${encodedMessage}`, '_blank');
    };

    if (loading) return <div className="py-20 text-center text-gray-500">Cargando detalles de tu compra...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                <div className="text-7xl mb-6">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h1>
                <p className="text-gray-500 mb-8">
                    Tu pedido ya está siendo procesado.
                </p>

                {order && (
                    <div className="bg-gray-50 p-6 rounded-2xl text-left mb-8 border border-gray-200">
                        <h2 className="font-bold text-gray-900 mb-4 border-b pb-2">Resumen del Pedido</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Nro Pedido:</strong> #{order.id.slice(0, 8)}</p>
                            <p><strong>Cliente:</strong> {order.payer.name}</p>
                            <p><strong>Envío a:</strong> {order.payer.address}</p>
                            <p className="text-primary font-bold text-lg pt-2 mt-2 border-t">Total: ${order.total.toLocaleString('es-AR')}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={sendWhatsApp}
                        className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.135c1.551.921 3.523 1.408 5.545 1.409 5.433 0 9.855-4.422 9.855-9.855.001-2.618-1.018-5.078-2.871-6.932-1.854-1.854-4.316-2.871-6.938-2.871-5.434 0-9.856 4.422-9.856 9.856l1.205 2.155.073.344-1.127 4.12 4.234-1.111.353.209c1.517.899 3.245 1.373 5.03 1.373zm-2.128-10.435c-.328-.731-.676-.745-1.001-.758l-.851-.012c-.297 0-.781.112-1.192.56-.411.448-1.564 1.529-1.564 3.729 0 2.2.1.042.0.016 4.312c-.246.336-.454.516-.62.668 0 0-4.041-3.32-4.041-6.845 0-1.035.404-2.022 1.133-2.753.728-.729 1.716-1.13 2.752-1.13.253 0 .502.049.734.143l3.653 1.488c.328.134.507.491.439.84zm11.97 4.745c-.273-.137-1.618-.799-1.868-.89-.25-.091-.433-.137-.616.137-.183.274-.709.89-.868 1.071-.159.182-.317.205-.591.069-.273-.137-1.156-.426-2.201-1.358-.813-.725-1.362-1.62-1.521-1.894-.159-.274-.017-.422.12-.558.123-.122.274-.319.411-.479.137-.16.183-.274.273-.457.091-.182.046-.342-.023-.479-.069-.137-.616-1.484-.843-2.031-.22-.533-.464-.457-.616-.464l-.525-.008c-.183 0-.479.069-.731.342-.25.274-.959.937-.959 2.285 0 1.348.981 2.65 1.118 2.833.137.182 1.93 2.946 4.674 4.127.653.282 1.164.45 1.56.577.653.208 1.25.178 1.719.108.523-.079 1.618-.662 1.846-1.301.229-.639.229-1.187.16-1.301-.069-.114-.251-.205-.524-.342z" /></svg>
                        Confirmar compra por WhatsApp
                    </button>

                    <Link href="/" className="block w-full text-center text-gray-500 font-medium py-2 hover:underline">
                        Volver a la tienda
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                <p>Nro Pedido Interno: {orderId}</p>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-20 text-center">
                <p>Cargando resultado del pago...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
