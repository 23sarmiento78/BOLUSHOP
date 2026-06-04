import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Link from "next/link";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export default function ContactoPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Contacto</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contacto</h1>
                        <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                            Estamos aquí para ayudarte. Contáctanos cuando lo necesites y te responderemos rápido.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
                        <div className="space-y-10">
                            <div className="rounded-[2rem] border border-[#e2e8f0] bg-[#f8f9fb] p-10 shadow-card">
                                <div className="flex items-start gap-4 mb-8">
                                    <div className="rounded-3xl bg-[#0f2044] p-4 text-white">
                                        <Mail size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-2">Email</p>
                                        <p className="text-xl font-black text-[#0f2044]">sarmientoisrael118@gmail.com</p>
                                        <a href="mailto:sarmientoisrael118@gmail.com" className="text-[#e8630a] font-bold hover:underline">Enviar correo →</a>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-6 flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Phone size={20} className="text-[#10b981]" />
                                            <span className="font-bold text-[#0f2044]">WhatsApp</span>
                                        </div>
                                        <p className="text-[#64748b]">+54 3541237972</p>
                                        <a href="https://wa.me/543541237972" className="text-[#10b981] font-bold hover:underline">Escribir →</a>
                                    </div>
                                    <div className="rounded-[2rem] bg-white border border-[#e2e8f0] p-6 flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <MapPin size={20} className="text-red-500" />
                                            <span className="font-bold text-[#0f2044]">Ubicación</span>
                                        </div>
                                        <p className="text-[#64748b]">Villa Carlos Paz, Córdoba</p>
                                        <p className="text-[#64748b]">Argentina</p>
                                    </div>
                                </div>

                                <div className="mt-10 rounded-[2rem] bg-[#0f2044] p-8 text-white">
                                    <h2 className="text-xl font-black mb-4">Horario de Atención</h2>
                                    <p className="text-sm leading-relaxed">Lunes a Viernes: 09:00 - 18:00</p>
                                    <p className="text-sm leading-relaxed">Sábado: 10:00 - 16:00</p>
                                    <p className="text-sm leading-relaxed">Domingo: Consultar por WhatsApp</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-[#e2e8f0] bg-white p-10 shadow-card">
                            <h2 className="text-2xl font-black text-[#0f2044] mb-6">Envía tu Mensaje</h2>
                            <form className="space-y-5">
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Tu nombre"
                                        className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="tu@email.com"
                                        className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-2">Asunto</label>
                                    <input
                                        type="text"
                                        placeholder="¿Cómo podemos ayudarte?"
                                        className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.35em] text-[#64748b] font-black mb-2">Mensaje</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Cuéntanos tu consulta..."
                                        className="w-full rounded-3xl border border-[#e2e8f0] bg-[#f8f9fb] px-4 py-4 text-base outline-none transition focus:border-[#0f2044] resize-none"
                                    />
                                </div>
                                <button type="submit" className="w-full rounded-3xl bg-[#e8630a] text-white py-4 text-lg font-black hover:bg-[#d55708] transition">
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
