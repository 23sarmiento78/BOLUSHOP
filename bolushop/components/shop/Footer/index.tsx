import Link from "next/link";
import { Instagram, Mail, MapPin, ShieldCheck, Truck, CreditCard, Phone, ArrowUpRight } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#0a1628] text-white mt-auto">
            <div className="container-shop py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-[#0a1628] font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>B</span>
                            </div>
                            <div>
                                <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>BoluShop</div>
                                <div className="text-xs text-[#ff6b35] font-medium">Regalos & Hogar · Argentina</div>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-white/55 max-w-sm">
                            Curamos regalos originales y accesorios para el hogar con envío a todo el país.
                            Selección experta desde Villa Carlos Paz, Córdoba.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://instagram.com/bolushop.arg" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-[#ff6b35] transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="https://wa.me/543541237972" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-[#25D366] transition-colors">
                                <Phone size={18} />
                            </a>
                            <a href="mailto:contacto@bolushop.com" aria-label="Email" className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center hover:bg-[#ff6b35] transition-colors">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Tienda</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            {[
                                { label: "Todos los productos", href: "/productos" },
                                { label: "Regalos originales", href: "/regalos/originales-argentina" },
                                { label: "Regalos cumpleaños", href: "/regalos/para-cumpleanos" },
                                { label: "Hogar", href: "/categoria/hogar" },
                                { label: "Ofertas y descuentos", href: "/ofertas" },
                                { label: "Blog", href: "/blog" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-[#ff6b35] transition-colors inline-flex items-center gap-1 group">
                                        {link.label}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Ayuda</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            {[
                                { label: "Garantías", href: "/garantias" },
                                { label: "Preguntas frecuentes", href: "/guias" },
                                { label: "Rastreo de pedido", href: "/rastreo" },
                                { label: "Contacto", href: "/contacto" },
                                { label: "Nosotros", href: "/nosotros" },
                                { label: "Términos y Condiciones", href: "/terminos-y-condiciones" },
                                { label: "Política de Privacidad", href: "/politica-de-privacidad" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-[#ff6b35] transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Contacto</h4>
                        <div className="space-y-3 text-sm text-white/60">
                            <p className="text-xs text-white/40 uppercase tracking-widest mb-2 font-bold">Tienda 100% Online</p>
                            <div className="flex gap-2.5">
                                <Mail size={15} className="flex-shrink-0 mt-0.5 text-[#ff6b35]" />
                                <a href="mailto:23sarmiento@gmail.com" className="hover:text-white transition-colors">23sarmiento@gmail.com</a>
                            </div>
                            <div className="flex gap-2.5">
                                <Phone size={15} className="flex-shrink-0 mt-0.5 text-[#ff6b35]" />
                                <a href="https://wa.me/543541237972" className="hover:text-white transition-colors">+54 9 3541 237972</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/8 pt-10">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-8 text-xs text-white/45">
                        <span className="flex items-center gap-2"><Truck size={14} className="text-[#ff6b35]" /> Envíos a todo el país</span>
                        <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#ff6b35]" /> Compra protegida</span>
                        <span className="flex items-center gap-2"><CreditCard size={14} className="text-[#ff6b35]" /> Cuotas sin interés</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                        <p className="text-[11px] text-white/30">
                            © {year} BoluShop — Villa Carlos Paz, Córdoba
                        </p>
                        <div className="flex gap-4 text-[11px] text-white/30">
                            <Link href="/politica-de-privacidad" className="hover:text-white/60 transition-colors">Privacidad</Link>
                            <Link href="/terminos-y-condiciones" className="hover:text-white/60 transition-colors">Términos</Link>
                        </div>
                        <p className="text-[10px] text-white/25 max-w-xs italic">
                            * Links de afiliado. Comisión sin costo extra para vos.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
