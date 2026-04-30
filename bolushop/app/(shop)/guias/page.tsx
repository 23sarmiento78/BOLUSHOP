import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { BookOpen, Search, ShoppingBag, HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Guías de Compra | BoluShop",
    description: "Encuentra toda la información que necesitas para realizar tus compras de forma segura y exitosa en BoluShop."
};

export default function GuiasPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-24 bg-gray-50/30">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                            <BookOpen size={40} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4">
                            Guías de <span className="italic text-primary">Compra</span>
                        </h1>
                        <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
                            Todo lo que necesitás saber para hacer tu compra más rápida y segura.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Como Comprar */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingBag size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4">¿Cómo comprar?</h2>
                            <p className="text-gray-600 mb-6 flex-grow">
                                Comprar en BoluShop es muy fácil y seguro. Sólo debes seguir estos simples pasos.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="font-black text-indigo-600">1.</span>
                                    <span>Navega por nuestras categorías y agrega los productos a tu carrito.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="font-black text-indigo-600">2.</span>
                                    <span>Ve a 'Checkout' para iniciar el proceso de pago.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="font-black text-indigo-600">3.</span>
                                    <span>Elige tu método de envío y medio de pago.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-600">
                                    <span className="font-black text-indigo-600">4.</span>
                                    <span>Confirma tu pedido y te enviaremos por email todos los detalles.</span>
                                </li>
                            </ul>
                            <Link href="/productos" className="mt-auto inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                                Ir a la tienda <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Preguntas Frecuentes */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <HelpCircle size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4">Preguntas Frecuentes</h2>
                            <p className="text-gray-600 mb-6 flex-grow">
                                Resolvemos tus dudas más comunes antes, durante y después de tu compra.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li>
                                    <p className="font-bold text-gray-900 text-sm mb-1">¿Cuáles son las formas de pago?</p>
                                    <p className="text-xs text-gray-500">Aceptamos transferencias bancarias y efectivo con descuentos especiales. Consultar por cuotas.</p>
                                </li>
                                <li>
                                    <p className="font-bold text-gray-900 text-sm mb-1">¿Realizan envíos a todo el país?</p>
                                    <p className="text-xs text-gray-500">Sí, trabajamos con Andreani y OCA para llegar a todo el territorio nacional de forma segura.</p>
                                </li>
                                <li>
                                    <p className="font-bold text-gray-900 text-sm mb-1">¿Es seguro comprar aquí?</p>
                                    <p className="text-xs text-gray-500">Completamente. Tus datos están protegidos y utilizamos plataformas seguras de cobro.</p>
                                </li>
                            </ul>
                            <Link href="/contacto" className="mt-auto inline-flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all">
                                Enviarnos una consulta <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
