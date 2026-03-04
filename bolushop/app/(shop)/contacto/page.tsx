import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { Mail, Smartphone, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contacto | BoluShop Argentina",
    description: "Ponete en contacto con el equipo de BoluShop. Estamos para ayudarte con tus dudas sobre pedidos, envíos o productos.",
};

export default function ContactoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="max-w-3xl mb-20 text-center mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                            Soporte 24/7
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            ¿Cómo podemos <br />
                            <span className="text-primary italic">ayudarte hoy?</span>
                        </h1>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Nuestro equipo está listo para responder tus consultas. Elegí el canal que más te convenga y te responderemos en el menor tiempo posible.
                        </p>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {/* Direct Contacts */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 font-bold text-2xl">📱</div>
                                <h3 className="font-bold text-xl mb-2 tracking-tight">WhatsApp</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Respuesta inmediata para consultas sobre ventas y stock.</p>
                                <a
                                    href="https://wa.me/3541237972"
                                    className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] hover:translate-x-1 transition-transform"
                                >
                                    Enviar Mensaje <span>→</span>
                                </a>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold text-2xl">✉️</div>
                                <h3 className="font-bold text-xl mb-2 tracking-tight">Email</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Para temas administrativos, reclamos o devoluciones.</p>
                                <a
                                    href="mailto:sarmientoisrael118@gmail.com"
                                    className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] hover:translate-x-1 transition-transform"
                                >
                                    Escribinos <span>→</span>
                                </a>
                            </div>

                            <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl">
                                <h3 className="font-bold text-xl mb-6 tracking-tight">Horarios de Atención</h3>
                                <ul className="space-y-4 font-medium opacity-80 text-sm">
                                    <li className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Lunes a Viernes</span>
                                        <span>09:00 - 18:00</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Sábados</span>
                                        <span>10:00 - 14:00</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Canales Online</span>
                                        <span className="text-primary italic">24hs habilitado</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Form Mask / More Info */}
                        <div className="lg:col-span-2 bg-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-100 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h2>
                            <div className="space-y-8">
                                <div className="p-8 bg-white rounded-3xl">
                                    <h4 className="font-bold text-lg mb-2">¿Mi envío llegará a tiempo?</h4>
                                    <p className="text-gray-500 text-sm italic">"Sí, despachamos todos los días por Correo Argentino. Una vez que tengas tu número de seguimiento en el mail, vas a poder ver el estado en tiempo real."</p>
                                </div>
                                <div className="p-8 bg-white rounded-3xl">
                                    <h4 className="font-bold text-lg mb-2">¿Es seguro comprar con tarjeta?</h4>
                                    <p className="text-gray-500 text-sm italic">"Utilizamos Mercado Pago como pasarela exclusiva. Tus datos bancarios nunca quedan guardados en nuestro servidor."</p>
                                </div>
                                <div className="p-8 bg-white rounded-3xl border border-primary/20 bg-primary/5">
                                    <h4 className="font-bold text-lg mb-2">¿Cómo solicito una devolución?</h4>
                                    <p className="text-gray-500 text-sm italic">"Podés escribirnos a nuestro WhatsApp con tu número de orden y una foto del producto. Respondemos en promedio en menos de 2 horas."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Trust Note */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 text-center max-w-4xl mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🇦🇷</div>
                        <h3 className="text-xl font-black mb-4">Industria y Confianza Nacional</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto mb-4">
                            Somos una empresa 100% Argentina radicada en Córdoba, brindando soluciones de calidad a todo el territorio nacional vía Correo Argentino.
                        </p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Atención personalizada · Garantía Real · Envío Gratis</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
