"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { clearCart } from "@/lib/cart";
import { Order } from "@/lib/types";
import { CheckCircle2, ShoppingBag, MessageCircle } from "lucide-react";

function ExitoContent() {
    const searchParams = useSearchParams();
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    useEffect(() => {
        clearCart();

        const referenceId =
            searchParams.get('external_reference') ||
            searchParams.get('order_id') ||
            searchParams.get('payment_id') ||
            searchParams.get('id');

        const status = searchParams.get('status') || searchParams.get('collection_status');
        setPaymentStatus(status);

        if (referenceId) {
            fetch(`/api/admin/orders/${referenceId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.order) setOrderData(data.order);
                    setIsLoadingOrder(false);
                })
                .catch(() => setIsLoadingOrder(false));
        } else {
            setIsLoadingOrder(false);
        }
    }, [searchParams]);

    const isPaymentPending = paymentStatus === 'pending' || orderData?.status === 'pending';
    const isPaymentApproved = paymentStatus === 'approved' || orderData?.status === 'paid';

    const title = isPaymentApproved ? '¡Gracias por tu compra!' : 'Tu pago está en revisión';
    const subtitle = isPaymentApproved
        ? 'Tu pedido ha sido recibido y ya estamos trabajando en él.'
        : 'El medio de pago quedó en estado pendiente. Verificá la confirmación de Mercado Pago y en breve te avisamos.';

    const whatsappLink =
        'https://wa.me/541112345678?text=' +
        encodeURIComponent(
            'Hola! Acabo de realizar un pedido en BoluShop. Mi nro de orden es: ' +
                (orderData?.id || 'N/A')
        );

    return (
        <div className="max-w-3xl mx-auto text-center py-8 md:py-12 px-4">
            <div className="mb-10">
                <div className="w-24 h-24 bg-[#f0fdf4] text-[#10b981] rounded-lg flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#0f2044] tracking-tight mb-4">
                    {title}
                </h1>
                <p className="text-[#64748b] text-sm md:text-base font-medium max-w-lg mx-auto">
                    {subtitle}
                </p>
                {isPaymentPending && (
                    <p className="text-sm md:text-base font-bold text-[#d97706] mt-4 max-w-lg mx-auto">
                        El pago está en estado pendiente. Si no recibís confirmación, esperá unos minutos o consultá tu pago en Mercado Pago.
                    </p>
                )}
            </div>

            {orderData && (
                <div className="card p-6 md:p-8 mb-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="text-left">
                            <p className="text-xs text-[#64748b] font-bold uppercase tracking-wider mb-1">Número de Orden</p>
                            <p className="text-xl md:text-2xl font-bold text-[#0f2044]">#{orderData.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#64748b] font-bold uppercase tracking-wider mb-1">Fecha</p>
                            <p className="text-lg md:text-xl font-bold text-[#0f2044]">{new Date(orderData.date).toLocaleDateString('es-AR')}</p>
                        </div>
                    </div>

                    <div className="py-4 border-t border-[#e2e8f0] border-b mb-8">
                        <span className="text-xs text-[#64748b] font-bold uppercase tracking-wider">Total Abonado</span>
                        <p className="text-2xl md:text-3xl font-bold text-[#0f2044]">${orderData.total.toLocaleString('es-AR')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={18} />
                            Notificar por WhatsApp
                        </a>
                        <Link
                            href="/productos"
                            className="btn btn-outline flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} />
                            Seguir Comprando
                        </Link>
                    </div>
                </div>
            )}

            {!orderData && !isLoadingOrder && (
                <div className="space-y-8">
                    <p className="text-[#64748b] font-bold uppercase tracking-widest text-xs">¿Perdiste tu número de orden?</p>
                    <Link
                        href="/productos"
                        className="inline-block btn btn-outline"
                    >
                        Volver al Catálogo →
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function ExitoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6 flex items-center justify-center min-h-[30vh]">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Pedido Confirmado</h1>
                        <p className="text-sm md:text-base text-gray-300">
                            Tu compra se ha procesado correctamente
                        </p>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <Suspense fallback={
                        <div className="min-h-[40vh] flex items-center justify-center text-center">
                            <div>
                                <div className="w-12 h-12 border-4 border-[#e8630a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Verificando pedido...</p>
                            </div>
                        </div>
                    }>
                        <ExitoContent />
                    </Suspense>
                </section>
            </main>
            <Footer />
        </>
    );
}