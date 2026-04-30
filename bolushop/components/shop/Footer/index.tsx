"use client";

import Link from "next/link";
import Logo from "../Logo";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Logo size={40} className="text-white" />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Descubrí una selección curada de productos únicos en Argentina. Calidad, originalidad y envío gratis.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 italic">Explorar</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-medium">
                            <li><Link href="/productos" className="hover:text-primary transition-colors">Todos los Productos</Link></li>
                            <li><Link href="/productos?seccion=mercado-libre" className="hover:text-primary transition-colors">Imperdibles ML 🚀</Link></li>
                            <li><Link href="/colecciones" className="hover:text-primary transition-colors">Colecciones VIP</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog & Lifestyle</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 italic">Soporte</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-medium">
                            <li><Link href="/nosotros" className="hover:text-primary transition-colors">Nuestra Historia</Link></li>
                            <li><Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link href="/politica-de-privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 italic">Contacto</h4>
                        <ul className="space-y-4 text-gray-400 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="text-primary mt-0.5" />
                                <span>hola@bolushop.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="text-primary mt-0.5" />
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary mt-0.5" />
                                <span>Buenos Aires, Argentina</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 text-center text-gray-500 text-xs font-bold tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} BoluShop. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
