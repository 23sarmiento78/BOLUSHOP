import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function ContactoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-16">
                            <div className="flex-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Hablemos</span>
                                <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-tighter">Estamos a un <span className="text-primary italic">click</span> de distancia.</h1>
                                <p className="text-gray-500 text-xl font-medium mb-12 leading-relaxed">¿Dudas sobre un pedido? ¿Buscás un producto que no está en catálogo? Nuestro equipo de soporte está listo para ayudarte en el día.</p>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                                            <p className="text-xl font-bold text-gray-900">sarmientoisrael118@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp</p>
                                            <p className="text-xl font-bold text-gray-900">+54 3541237972</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ubicación</p>
                                            <p className="text-xl font-bold text-gray-900">Villa Carlos Paz, Córdoba</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-100">
                                    <form className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Tu Nombre</label>
                                            <input type="text" className="w-full bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 font-bold outline-none transition-all" placeholder="Juan Pérez" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Tu Email</label>
                                            <input type="email" className="w-full bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 font-bold outline-none transition-all" placeholder="juan@email.com" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-1">Mensaje</label>
                                            <textarea rows={4} className="w-full bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 px-6 font-bold outline-none transition-all resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                                        </div>
                                        <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">Enviar Mensaje</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
