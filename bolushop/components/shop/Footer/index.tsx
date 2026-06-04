"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, ShieldCheck, Truck, CreditCard, Phone } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#0f2044] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                                <span className="text-[#0f2044] font-bold text-base">B</span>
                            </div>
                            <div>
                                <div className="text-base font-bold">BoluShop</div>
                                <div className="text-sm text-[#e8630a]">Regalos & Hogar</div>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300">
                            Curamos los mejores regalos originales y accesorios para el hogar de Argentina. Selección experta, envíos a todo el país con tarifa calculada según tu ubicación.
                        </p>
                        <div className="flex gap-2 pt-4">
                            <a href="https://instagram.com/bolushop.arg" target="_blank" rel="noopener" className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#e8630a] transition-colors">
                                <Instagram size={16} />
                            </a>
                            <a href="https://wa.me/543541237972" target="_blank" rel="noopener" className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#25D366] transition-colors">
                                <Phone size={16} />
                            </a>
                            <a href="mailto:contacto@bolushop.com" className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#e8630a] transition-colors">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Tienda Column */}
                    <div>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-white mb-6">Tienda</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link href="/productos" className="hover:text-[#e8630a] transition-colors">Todos los productos</Link></li>
                            <li><Link href="/productos?tipo=regalos" className="hover:text-[#e8630a] transition-colors">Regalos originales</Link></li>
                            <li><Link href="/productos?tipo=hogar" className="hover:text-[#e8630a] transition-colors">Organización del hogar</Link></li>
                            <li><Link href="/colecciones" className="hover:text-[#e8630a] transition-colors">Colecciones</Link></li>
                            <li><Link href="/blog" className="hover:text-[#e8630a] transition-colors">Blog y guías</Link></li>
                        </ul>
                    </div>

                    {/* Ayuda Column */}
                    <div>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-white mb-6">Ayuda</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link href="/garantias" className="hover:text-[#e8630a] transition-colors">Garantías y cambios</Link></li>
                            <li><Link href="/guias" className="hover:text-[#e8630a] transition-colors">Preguntas frecuentes</Link></li>
                            <li><Link href="/politica-de-privacidad" className="hover:text-[#e8630a] transition-colors">Política de privacidad</Link></li>
                            <li><Link href="/nosotros" className="hover:text-[#e8630a] transition-colors">Sobre nosotros</Link></li>
                            <li><Link href="/contacto" className="hover:text-[#e8630a] transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-white mb-6">Contacto</h4>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex gap-2">
                                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                                <span>Villa Carlos Paz, Córdoba, Argentina</span>
                            </div>
                            <div className="flex gap-2">
                                <Mail size={16} className="flex-shrink-0 mt-0.5" />
                                <span>contacto@bolushop.com</span>
                            </div>
                            <div className="flex gap-2">
                                <Phone size={16} className="flex-shrink-0 mt-0.5" />
                                <span>+54 9 3541 237972</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8 md:pt-12">
                    {/* Trust Section */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <Truck size={16} />
                            <span>Envíos a todo el país con tarifa calculada según tu zona</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span>Compra 100% protegida</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} />
                            <span>Hasta 12 cuotas sin interés</span>
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="text-center space-y-2">
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                            © {year} BoluShop — Villa Carlos Paz, Córdoba
                        </p>
                        <p className="text-[9px] text-gray-400 max-w-md mx-auto italic">
                            * Este sitio contiene links de afiliados. Si comprás a través de ellos podemos recibir una comisión sin costo adicional para vos.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
