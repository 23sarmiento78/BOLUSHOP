import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Truck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1e293b] text-white pt-16 pb-8 border-t border-[#1e293b]/20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-[#FFE600] rounded-xl flex items-center justify-center text-[#1e293b] font-black text-xl">
                                B
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">BoluShop</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                            Mejores precios, confianza absoluta garantizada y envío asegurado a cualquier rincón del país.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide text-white">Secciones</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li><Link href="/" className="hover:text-[#FFE600] transition-colors">Página Principal</Link></li>
                            <li><Link href="/productos" className="hover:text-[#FFE600] transition-colors">Todos los Productos</Link></li>
                            <li><Link href="/nosotros" className="hover:text-[#FFE600] transition-colors">Sobre Nuestra Tienda</Link></li>
                            <li><Link href="/contacto" className="hover:text-[#FFE600] transition-colors">Contáctanos</Link></li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide text-white">Información Legal</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li><Link href="/garantias" className="hover:text-[#FFE600] transition-colors">Garantías y Cambios</Link></li>
                            <li><Link href="/terminos-y-condiciones" className="hover:text-[#FFE600] transition-colors">Términos del Servicio</Link></li>
                            <li><Link href="/politica-de-privacidad" className="hover:text-[#FFE600] transition-colors">Políticas de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-wide text-white">Hablemos</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-400">
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-[#FFE600]" /> info@bolushop.com
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-[#FFE600]" /> +54 9 11 1234-5678
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FFE600] hover:text-[#1e293b] transition-all" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#FFE600] hover:text-[#1e293b] transition-all" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} BoluShop Argentina. 
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-[#00A650] font-black uppercase tracking-wider bg-[#00A650]/10 px-3 py-1.5 rounded-lg">
                            <ShieldCheck size={16} /> Compra Protegida
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#3483FA] font-black uppercase tracking-wider bg-[#3483FA]/10 px-3 py-1.5 rounded-lg">
                            <Truck size={16} /> Envío Nacional
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}