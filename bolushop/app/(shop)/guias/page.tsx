import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guías de Compra | BoluShop Argentina",
    description: "Aprendé cómo comprar de forma segura, cómo aprovechar las cuotas sin interés y consejos para elegir los mejores productos en BoluShop.",
};

const guides = [
    {
        title: "Cómo comprar en cuotas sin interés con Mercado Pago",
        excerpt: "Descubrí todos los secretos para financiar tus compras en BoluShop utilizando las promociones bancarias de Mercado Pago.",
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c02?q=80&w=2070&auto=format&fit=crop",
        date: "4 Mar 2026",
        category: "Finanzas"
    },
    {
        title: "Guía completa de Envíos con Correo Argentino",
        excerpt: "Todo lo que necesitás saber sobre los tiempos de entrega, el seguimiento de tu paquete y la cobertura nacional de BoluShop.",
        image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=2070&auto=format&fit=crop",
        date: "1 Mar 2026",
        category: "Logística"
    },
    {
        title: "5 Tips para elegir productos de decoración para tu hogar",
        excerpt: "Convertí tu casa en un espacio único con estos consejos de expertos para elegir artículos que combinen estilo y funcionalidad.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070&auto=format&fit=crop",
        date: "25 Feb 2026",
        category: "Estilo de Vida"
    }
];

export default function GuiasPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mb-16">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">Contenido Exclusivo</span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Guías para una <br /><span className="text-primary">Compra Inteligente</span></h1>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            En BoluShop no solo vendemos productos, te ayudamos a tomar la mejor decisión para tu hogar y tu economía.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide, i) => (
                            <div key={i} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                                        {guide.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">{guide.date}</div>
                                    <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{guide.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {guide.excerpt}
                                    </p>
                                    <Link href="#" className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] group-hover:translate-x-2 transition-transform">
                                        Leer Guía Completa <span>→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEO Block */}
                    <div className="mt-24 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 italic text-gray-400 text-center max-w-4xl mx-auto">
                        <p className="text-sm">
                            Este centro de recursos es actualizado semanalmente por nuestro equipo de expertos en comercio electrónico y logística nacional para brindarte la mejor experiencia en BoluShop Argentina.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
