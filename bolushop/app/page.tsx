import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/data';
import { CATEGORIES, SITE_DESCRIPTION } from '@/lib/constants';
import Link from 'next/link';

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="pb-20 bg-gray-50/50">
      {/* Hero with Video Background */}
      <section className="relative h-[85vh] flex items-center justify-center px-4 text-center overflow-hidden">
        {/* HTML5 Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videohero.mp4" type="video/mp4" />
        </video>

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-gray-50/50 z-1"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-sm font-bold tracking-widest uppercase">
            Tendencia 2024 🔥
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
            <span className="text-primary">Bolu</span>Shop
          </h1>
          <p className="text-xl md:text-3xl text-white/90 mb-10 max-w-2xl mx-auto leading-tight drop-shadow-lg font-medium">
            {SITE_DESCRIPTION || "Lo mejor del dropshipping, sin vueltas."}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/categorias" className="group relative inline-flex items-center justify-center bg-primary text-white font-black py-5 px-12 rounded-2xl text-xl shadow-2xl shadow-primary/40 hover:bg-emerald-600 transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden">
              <span className="relative z-10">VER LO VIRAL</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            </Link>
            <Link href="#combos" className="text-white font-bold text-lg hover:underline underline-offset-8 decoration-primary decoration-4">
              Ver ofertas del día
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* Categories - Glassmorphism style */}
      <section className="py-24 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Elegí tu <span className="text-primary italic">Vibe</span>
          </h2>
          <p className="text-gray-500 font-medium">Navegá por nuestras categorías seleccionadas</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              href={`/categorias?cat=${cat.id}`}
              className="group relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm border border-white hover:border-primary/50 transition-all duration-500"
            >
              {/* Abstract simple background for each card based on category color/icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/10 group-hover:to-primary/5 transition-colors duration-500" />

              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                <span className="text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-sm">
                  {cat.icon}
                </span>
                <span className="font-extrabold text-gray-800 text-xl tracking-tight group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
                <span className="text-xs font-bold text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">EXPLORAR →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Modern Wave Separator */}
      <div className="w-full h-24 bg-gradient-to-b from-gray-50 to-white" />

      {/* Viral Products Section */}
      <section className="py-20 px-4 container mx-auto" id="viral">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-md bg-secondary/10 text-secondary font-black uppercase tracking-tighter text-xs mb-2">Social Trends</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">🔥 Productos Virales</h2>
          </div>
          <Link href="/categorias" className="bg-white border-2 border-gray-100 shadow-sm px-8 py-3 rounded-xl font-bold text-gray-700 hover:border-primary hover:text-primary transition-all flex items-center gap-2">
            Ver catálogo completo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {featured.map(p => (
            <div key={p.id} className="hover:-translate-y-2 transition-transform duration-300">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Benefits - Polished Design */}
      <section className="py-24 bg-gray-900 rounded-[3rem] mx-4 md:mx-10 my-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full" />

        <div className="container mx-auto px-6 relative z-10 text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">¿Por qué <span className="text-primary italic">BoluShop</span>?</h2>
          <p className="text-gray-400 font-medium">Comprá tranqui, nosotros nos encargamos</p>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary/50 transition-all text-center group">
            <div className="text-5xl mb-6 bg-primary/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">🚛</div>
            <h3 className="font-black text-2xl mb-3 text-white">Envío Gratis</h3>
            <p className="text-gray-400 leading-relaxed font-medium">A todo el país sin excepciones. El precio final es el que ves en pantalla.</p>
          </div>

          <div className="p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-secondary/50 transition-all text-center group">
            <div className="text-5xl mb-6 bg-secondary/20 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">💳</div>
            <h3 className="font-black text-2xl mb-3 text-white">Cuotas Fijas</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Aceptamos todas las tarjetas a través de MercadoPago para tu total seguridad.</p>
          </div>

          <div className="p-10 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-blue-400/50 transition-all text-center group">
            <div className="text-5xl mb-6 bg-blue-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">🔒</div>
            <h3 className="font-black text-2xl mb-3 text-white">Compra Segura</h3>
            <p className="text-gray-400 leading-relaxed font-medium">Tu dinero está 100% protegido hasta que el producto llegue a tus manos.</p>
          </div>
        </div>
      </section>
    </div>

  );
}
