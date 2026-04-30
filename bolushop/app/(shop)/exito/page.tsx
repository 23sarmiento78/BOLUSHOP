"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { clearCart } from "@/lib/cart";
import { Order } from "@/lib/types";
import { CheckCircle2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";

function ExitoContent() {
    const searchParams = useSearchParams();
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [isLoadingOrder, setIsLoadingOrder] = useState(true);

    useEffect(() => {
        // Al llegar a éxito, vaciamos el carrito
        clearCart();

        const orderId = searchParams.get('id');
        if (orderId) {
            fetch(`/api/admin/orders/${orderId}`)
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

    const whatsappLink = "https://wa.me/541112345678?text=" + encodeURIComponent("Hola! Acabo de realizar un pedido en BoluShop. Mi nro de orden es: " + (orderData?.id || "N/A"));

    return (
        <div className="max-w-3xl mx-auto text-center py-12">
            <div className="mb-10 animate-in zoom-in duration-700">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 size={48} />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
                    ¡Gracias por <br /> tu <span className="text-emerald-500 italic">compra</span>!
                </h1>
                <p className="text-gray-500 text-xl font-medium max-w-lg mx-auto">
                    Tu pedido ha sido recibido y ya estamos trabajando en él.
                </p>
            </div>

            {orderData && (
                <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-100 mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-150">
                    <div className="flex justify-between items-center mb-10 pb-10 border-b border-gray-50">
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Número de Orden</p>
                            <p className="text-2xl font-black text-gray-900">#{orderData.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Fecha</p>
                            <p className="text-lg font-bold text-gray-900">{new Date(orderData.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Abonado</span>
                            <span className="text-3xl font-black text-gray-900">${orderData.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-green-500/20"
                        >
                            <MessageCircle size={20} />
                            Notificar por WhatsApp
                        </a>
                        <Link
                            href="/productos"
                            className="flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-gray-900/20"
                        >
                            <ShoppingBag size={20} />
                            Seguir Comprando
                        </Link>
                    </div>
                </div>
            )}

            {!orderData && !isLoadingOrder && (
                <div className="space-y-8 animate-in fade-in duration-1000">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">¿Perdiste tu número de orden?</p>
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-3 text-gray-900 font-black uppercase tracking-[0.3em] text-xs hover:gap-6 transition-all"
                    >
                        Volver al Catálogo <ArrowRight size={18} />
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
            <main className="min-h-screen pt-32 pb-24 bg-gray-50/30">
                <div className="container mx-auto px-6">
                    <Suspense fallback={
                        <div className="min-h-[60vh] flex items-center justify-center text-center">
                            <div>
                                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verificando Pago...</p>
                            </div>
                        </div>
                    }>
                        <ExitoContent />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </>
    );
}