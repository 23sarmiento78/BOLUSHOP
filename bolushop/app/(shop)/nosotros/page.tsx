import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sobre Nosotros | BoluShop - Tu Marketplace de Confianza en Argentina",
    description: "Conocé la historia de BoluShop, nuestra misión de democratizar el comercio online en Argentina y nuestro compromiso con la calidad y el servicio al cliente.",
};

export default function NosotrosPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-20 text-center">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                        Nuestra Historia
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                        Redefiniendo el <br />
                        <span className="text-primary italic">Comercio Online</span> en Argentina
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        BoluShop nació con una visión simple pero poderosa: conectar a los argentinos con los productos más innovadores del mundo, garantizando una experiencia de compra segura, rápida y transparente.
                    </p>
                </section>

                {/* Values Section */}
                <section className="bg-gray-50 py-24 mb-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div className="relative h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1556742044-3c52d6e88c02?q=80&w=2070&auto=format&fit=crop"
                                    alt="Compromiso BoluShop"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Por qué elegir <span className="text-primary">BoluShop</span></h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl shrink-0">🤝</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Confianza Local</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">Somos una empresa argentina que entiende las necesidades reales de nuestros clientes. Brindamos soporte humano y cercano.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl shrink-0">✨</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Calidad Curada</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">No vendemos de todo, vendemos lo mejor. Cada producto en nuestro catálogo pasa por un riguroso control de calidad antes de ser publicado.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl shrink-0">🚀</div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Eficiencia Logística</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">Optimizamos nuestras rutas y alianzas con Correo Argentino para que tu pedido llegue a la puerta de tu casa en tiempo récord y con envío 100% gratis.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Vision */}
                <section className="container mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="p-10 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Facilitar el acceso a productos de vanguardia para todos los hogares argentinos, eliminando las barreras del comercio convencional y ofreciendo soluciones tecnológicas que simplifiquen la vida diaria de las personas.
                            </p>
                        </div>
                        <div className="p-10 bg-black text-white rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-2xl font-bold mb-4 text-primary">Nuestra Visión</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Convertirnos en el marketplace de referencia en el Cono Sur, destacándonos por nuestra ética comercial, la excelencia en el servicio post-venta y la constante innovación en nuestra selección de productos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team / Commitment */}
                <section className="container mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold mb-6">Nuestro Compromiso con Vos</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-12">
                        En BoluShop no solo comprás un producto, te unís a una comunidad que valora la transparencia y el ahorro inteligente. Estamos acá para ayudarte en cada paso del proceso.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-60">
                        {/* Simulación de logos de confianza o partners */}
                        <div className="text-xl font-bold">Mercado Pago</div>
                        <div className="text-xl font-bold">Correo Argentino</div>
                        <div className="text-xl font-bold">SSL Secure</div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
