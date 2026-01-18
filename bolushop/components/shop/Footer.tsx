import Link from "next/link";
import { Instagram, Smartphone, Mail, Truck, ShieldCheck, CreditCard, Facebook, Music2 } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 mt-20">
            <div className="container mx-auto px-4">
                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-20 border-b border-gray-100">
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                            <Truck size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-wider text-sm">Envío Nacional</h4>
                            <p className="text-gray-500 text-sm">A todo Argentina por Correo Argentino</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-wider text-sm">Compra Segura</h4>
                            <p className="text-gray-500 text-sm">Protección de datos y garantía oficial</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transition-transform group-hover:scale-110">
                            <CreditCard size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-wider text-sm">Cuotas Sin Interés</h4>
                            <p className="text-gray-500 text-sm">Con tarjetas seleccionadas vía MP</p>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <Logo size={32} className="text-gray-900" />
                        </Link>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Conectando calidad con tu hogar. Nuestra misión es elevar tu estilo de vida con productos exclusivos y envíos rápidos a todo el país.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/bolushop.arg" target="_blank" aria-label="Seguir en Instagram" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="https://tiktok.com/@bolushop.ok" target="_blank" aria-label="Seguir en TikTok" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Music2 size={20} />
                            </a>
                            <a href="#" aria-label="Seguir en Facebook" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Navegación</h4>
                        <ul className="space-y-4">
                            {['Inicio', 'Productos', 'Rastreo', 'Carrito', 'Garantías'].map((item) => (
                                <li key={item}>
                                    <Link href={item === 'Inicio' ? '/' : `/${item.toLowerCase().replace('í', 'i')}`} className="text-gray-500 hover:text-primary font-bold text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Soporte</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/garantias" className="text-gray-500 hover:text-primary font-bold text-sm transition-colors">Centro de Devoluciones</Link>
                            </li>
                            <li>
                                <Link href="/rastreo" className="text-gray-500 hover:text-primary font-bold text-sm transition-colors">Políticas de Envío</Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-500 hover:text-primary font-bold text-sm transition-colors">Acceso Staff</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Contacto Directo</h4>
                            <div className="space-y-4">
                                <a href="mailto:sarmientoisrael118@gmail.com" className="flex items-center gap-4 text-gray-500 hover:text-primary transition-colors group">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm font-bold">Envianos un Email</span>
                                </a>
                                <a href="https://wa.me/3541237972" className="flex items-center gap-4 text-gray-500 hover:text-primary transition-colors group">
                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                        <Smartphone size={16} />
                                    </div>
                                    <span className="text-sm font-bold">WhatsApp 24/7</span>
                                </a>
                            </div>
                        </div>
                        <div className="pt-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Medios de Pago</p>
                            <div className="flex items-center gap-4">
                                <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-1.png" alt="Mercado Pago" width={128} height={32} className="h-8 w-auto opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} BoluShop Argentina · Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 cursor-pointer">Privacidad</span>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 cursor-pointer">Términos</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
