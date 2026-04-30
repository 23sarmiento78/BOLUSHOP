"use client";

import Link from "next/link";
import Logo from "../Logo";
import { Instagram, Mail, Phone, MapPin, ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-[#0A0F1E] text-white pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Upper Section: Newsletter / CTA */}
                <div className="bg-gradient-to-r from-primary/40 to-emerald-500/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-16 mb-20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
                            No te pierdas de <span className="italic text-emerald-400">nada</span>.
                        </h3>
                        <p className="text-gray-400 font-medium">Suscribite para recibir ofertas exclusivas y lanzamientos antes que nadie.</p>
                    </div>
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                        />
                        <button className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 hover:text-black transition-all shadow-xl shadow-white/5">
                            Unirme
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Logo size={48} className="text-white" />
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            La tienda #1 de regalos originales y gadgets tecnológicos premium en Argentina. Curaduría experta para momentos inolvidables.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/bolushop.arg" target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] transition-all group shadow-lg">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href={`https://wa.me/543541237972`} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#25D366] transition-all group shadow-lg">
                                <Phone size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-8">Navegación</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Todos los Productos', href: '/productos' },
                                { label: 'Imperdibles ML', href: '/productos?seccion=mercado-libre' },
                                { label: 'Colecciones', href: '/colecciones' },
                                { label: 'Blog & Novedades', href: '/blog' },
                                { label: 'Sobre Nosotros', href: '/nosotros' },
                            ].map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white font-bold text-sm flex items-center gap-2 group transition-all">
                                        <ChevronRight size={14} className="text-emerald-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-8">Ayuda & Soporte</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Contacto', href: '/contacto' },
                                { label: 'Garantías & Cambios', href: '/garantias' },
                                { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
                                { label: 'Términos de Servicio', href: '/terminos-y-condiciones' },
                                { label: 'Preguntas Frecuentes', href: '/guias' },
                            ].map(item => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white font-bold text-sm flex items-center gap-2 group transition-all">
                                        <ChevronRight size={14} className="text-emerald-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-8">Ubicación</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                                <MapPin className="text-emerald-500 flex-shrink-0" size={20} />
                                <div className="text-sm">
                                    <p className="font-black text-white">Sede Central</p>
                                    <p className="text-gray-400 font-medium">Villa Carlos Paz, Córdoba, AR</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                                <Mail className="text-emerald-500 flex-shrink-0" size={20} />
                                <div className="text-sm">
                                    <p className="font-black text-white">Email Corporativo</p>
                                    <p className="text-gray-400 font-medium">sarmientoisrael118@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust & Paymen Section */}
                <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 hover:opacity-80 transition-opacity grayscale hover:grayscale-0 duration-500">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><CreditCard size={18} /> Mercado Pago</div>
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><ShieldCheck size={18} /> Compra Segura</div>
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Truck size={18} /> Envíos OCA/Andreani</div>
                    </div>

                    <div className="text-center lg:text-right space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                            Propiedad de Israel Enrique Sarmiento Escuela
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
                            © {new Date().getFullYear()} BoluShop. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
