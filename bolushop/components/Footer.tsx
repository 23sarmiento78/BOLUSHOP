import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Upper Footer: Branding & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
                    <div className="max-w-md">
                        <Link href="/" className="inline-block mb-8 group">
                            <span className="text-4xl font-black tracking-tighter flex items-center gap-2">
                                <span className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">🎁</span>
                                Bolu<span className="text-primary italic">Shop</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                            Revolucionando el dropshipping en Argentina. Productos virales, calidad garantizada y envíos relámpago a todo el país.
                        </p>
                        <div className="flex gap-4">
                            {['Instagram', 'TikTok', 'YouTube'].map(social => (
                                <a key={social} href="#" className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:border-primary/50 hover:bg-primary/20 transition-all">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{social.slice(0, 2)}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <h4 className="text-2xl font-black mb-2 tracking-tight italic text-primary">¡No te pierdas de nada!</h4>
                        <p className="text-gray-400 mb-6 font-medium">Suscribite para recibir ofertas flash y nuevos lanzamientos.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary transition-all text-white font-medium"
                            />
                            <button className="bg-primary text-white font-black px-8 py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap">
                                UNIRME
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12 mb-20 border-y border-white/5 py-16">
                    <div>
                        <h5 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span> Compras
                        </h5>
                        <ul className="space-y-4">
                            {['Inicio', 'Categorías', 'Lo más Viral', 'Mi Carrito'].map(item => (
                                <li key={item}>
                                    <Link href={item === 'Inicio' ? '/' : item === 'Categorías' ? '/categorias' : item === 'Mi Carrito' ? '/carrito' : '/#viral'}
                                        className="text-gray-400 hover:text-white transition-colors font-semibold flex items-center group">
                                        <span className="opacity-0 group-hover:opacity-100 -ml-4 mr-2 transition-all">→</span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span> Legal
                        </h5>
                        <ul className="space-y-4">
                            {['Términos del Servicio', 'Política de Privacidad', 'Política de Envíos'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-white transition-colors font-semibold flex items-center group">
                                        <span className="opacity-0 group-hover:opacity-100 -ml-4 mr-2 transition-all">→</span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2">
                        <h5 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Atención al Cliente
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="https://wa.me/543541237972" className="group bg-green-500/10 backdrop-blur-lg p-6 rounded-3xl border border-green-500/20 hover:border-green-500 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">WhatsApp Directo</p>
                                <p className="text-white font-black text-lg group-hover:scale-105 transition-transform">+54 354 123 7972</p>
                            </a>
                            <a href="mailto:sarmientoisrael118@gmail.com" className="group bg-primary/10 backdrop-blur-lg p-6 rounded-3xl border border-primary/20 hover:border-primary transition-all overflow-hidden text-ellipsis">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Soporte Email</p>
                                <p className="text-white font-black text-sm md:text-base break-words lg:truncate transition-transform">sarmientoisrael118@gmail.com</p>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 text-sm font-bold flex items-center gap-2">
                            © {new Date().getFullYear()} BoluShop Argentina
                            <span className="text-white/20">|</span>
                            <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-white/50">V: 2.0.24</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="flex items-center gap-4 py-2 px-6 bg-white rounded-2xl grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">Powered by</span>
                            <span className="text-black font-black italic tracking-tighter text-lg">MERCADO PAGO</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">VISA</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">MC</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">AMEX</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
