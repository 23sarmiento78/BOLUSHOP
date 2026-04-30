import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Image from "next/image";

export default function NosotrosPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-white pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 block text-center">Nuestra Historia</span>
                        <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter text-gray-900 text-center">
                            Pasión por lo <span className="text-primary italic">Original</span>
                        </h1>

                        <div className="relative aspect-video rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
                                alt="Equipo BoluShop"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="text-xl font-bold italic">"No vendemos productos, vendemos momentos de alegría y originalidad."</p>
                            </div>
                        </div>

                        <div className="prose prose-xl prose-gray max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
                            <p>
                                <b>BoluShop</b> nació en el año 2026 con una misión clara: transformar la forma en que los argentinos descubrimos y compramos productos que salen de lo común. Bajo la dirección de <b>Israel Enrique Sarmiento Escuela</b>, nuestro proyecto busca la excelencia en cada detalle desde nuestra base en Villa Carlos Paz, Córdoba.
                            </p>
                            <p>
                                Lo que comenzó como una pequeña curaduría de gadgets tecnológicos en Google Drive, hoy se ha convertido en la tienda de referencia para quienes buscan ese regalo perfecto, esa herramienta curiosa o ese detalle que hace la vida más inteligente.
                            </p>

                            <h2 className="text-3xl font-black text-gray-900 mt-12 mb-6">Valores que nos definen</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="text-3xl mb-4">💎</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Curaduría de Calidad</h3>
                                    <p className="text-sm text-gray-500">Cada producto en nuestro catálogo pasa por un proceso de selección estricto. Si no lo usaríamos nosotros, no te lo vendemos.</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="text-3xl mb-4">⚡</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Envío Veloz</h3>
                                    <p className="text-sm text-gray-500">Sabemos que cuando encontrás algo genial, lo querés ya. Por eso optimizamos nuestra logística para llegar a cada rincón de Argentina en tiempo récord.</p>
                                </div>
                            </div>

                            <p>
                                Además, hemos integrado una sección especial de <b>Imperdibles Mercado Libre</b>, donde seleccionamos los mejores "tesoros" del marketplace más grande del país, asegurándote una experiencia de compra protegida con el respaldo de BoluShop.
                            </p>

                            <p className="text-center text-2xl font-black text-gray-900 py-12">
                                Gracias por ser parte de nuestra comunidad. <br />
                                <span className="text-primary italic">Atentamente, el equipo de BoluShop.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
