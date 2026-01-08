"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { clearCart } from "@/lib/cart";
import { Order } from "@/lib/types";

function ExitoContent() {
    const searchParams = useSearchParams();
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);

    const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
    const status = searchParams.get('status') || searchParams.get('collection_status'); // 'pending' or 'approved'

    useEffect(() => {
        // Clear cart after successful purchase
        clearCart();

        // Fetch order details
        if (orderId) {
            fetch(`/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setOrderData(data);
                })
                .catch(err => console.error("Error loading order:", err))
                .finally(() => setIsLoadingOrder(false));
        } else {
            setIsLoadingOrder(false);
        }
    }, [orderId]);

    const isPending = status === 'pending';

    // Build comprehensive WhatsApp message
    let whatsappMessage = `Hola! Acabo de realizar una compra.\n\n`;
    whatsappMessage += `🆔 Orden: ${orderId}\n`;
    whatsappMessage += `📊 Estado: ${isPending ? '⏳ Pendiente de revisión' : '✅ Aprobada'}\n\n`;

    if (orderData) {
        whatsappMessage += `👤 Cliente: ${orderData.payer.name}\n`;
        whatsappMessage += `📞 Teléfono: ${orderData.payer.phone}\n`;
        whatsappMessage += `📍 Dirección: ${orderData.payer.address}\n\n`;
        whatsappMessage += `📦 Productos:\n`;
        orderData.items.forEach(item => {
            whatsappMessage += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        whatsappMessage += `\n💰 Total: $${orderData.total.toLocaleString('es-AR')}`;
    } else {
        whatsappMessage += `Por favor, confirmen mi pedido.`;
    }

    const whatsappLink = `https://wa.me/3541237972?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <>
            <Header />

            <main className={`min-h-screen bg-gradient-to-b ${isPending ? 'from-amber-50' : 'from-green-50'} to-white flex items-center justify-center px-4 pt-28 pb-12`}>
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl">
                        {/* Icon */}
                        <div className={`w-24 h-24 ${isPending ? 'bg-amber-500' : 'bg-green-500'} rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce`}>
                            <span className="text-5xl text-white">{isPending ? '⏳' : '✓'}</span>
                        </div>

                        <h1 className="text-5xl font-black text-gray-900 mb-4">
                            {isPending ? (
                                <>Pago en <span className="text-amber-500 italic">Revisión</span></>
                            ) : (
                                <>¡Compra <span className="text-green-500 italic">Exitosa</span>!</>
                            )}
                        </h1>

                        <p className="text-xl text-gray-600 mb-10">
                            {isPending
                                ? "Mercado Pago está procesando tu pago. Te avisaremos cuando se confirme."
                                : "Gracias por tu compra. Ya estamos preparando tu pedido para enviarlo."
                            }
                        </p>

                        {!isLoadingOrder && orderData && (
                            <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left border border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                    Detalles del Pedido
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Orden ID</span>
                                        <span className="font-mono font-black text-gray-900">{orderId?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cliente</span>
                                        <span className="font-black text-gray-900">{orderData.payer.name}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Entrega</span>
                                        <span className="font-bold text-gray-900 text-right max-w-[200px] leading-tight mt-0.5">{orderData.payer.address}</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-gray-900 uppercase">Total Pagado</span>
                                        <span className="text-3xl font-black text-primary">${orderData.total.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoadingOrder && (
                            <div className="py-20 animate-pulse bg-gray-50 rounded-3xl mb-10 h-64 flex items-center justify-center">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Cargando detalles...</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block w-full py-6 bg-green-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/30 overflow-hidden"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    📱 Confirmar por WhatsApp
                                </div>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </a>

                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/productos"
                                    className="py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors text-center"
                                >
                                    Ver Más Productos
                                </Link>
                                <Link
                                    href="/"
                                    className="py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors text-center"
                                >
                                    Ir al Inicio
                                </Link>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-gray-100">
                            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-400 mb-10">Próximos Pasos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl mx-auto">📧</div>
                                    <p className="font-black text-xs uppercase tracking-widest leading-tight">Email de<br />Confirmación</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-xl mx-auto">📦</div>
                                    <p className="font-black text-xs uppercase tracking-widest leading-tight">Preparación de<br />Pedido</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-xl mx-auto">🚚</div>
                                    <p className="font-black text-xs uppercase tracking-widest leading-tight">Envío a<br />Domicilio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default function ExitoPage() {
    return (
        <Suspense fallback={
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-pulse">⏳</div>
                        <p className="text-gray-500 font-bold">Cargando...</p>
                    </div>
                </div>
                <Footer />
            </>
        }>
            <ExitoContent />
        </Suspense>
    );
}
