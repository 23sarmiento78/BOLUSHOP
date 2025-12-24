import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts } from '@/lib/data';
import { CATEGORIES, SITE_DESCRIPTION } from '@/lib/constants';
import Link from 'next/link';

export default function Home() {
  const featured = getFeaturedProducts();

  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 md:py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative background elements could go here */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            <span className="text-primary">Bolu</span>Shop
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {SITE_DESCRIPTION || "Lo mejor del dropshipping, sin vueltas."}
          </p>
          <Link href="/categorias" className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-primary/30 hover:bg-emerald-600 transition-all transform hover:-translate-y-1 hover:shadow-xl">
            Ver Productos Virales 🔥
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
          Explorar <span className="text-primary">Categorías</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/categorias?cat=${cat.id}`} className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              <span className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Viral Products */}
      <section className="py-8 px-4 container mx-auto" id="viral">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <div>
            <span className="text-secondary font-bold uppercase tracking-wider text-sm">Tendencia</span>
            <h2 className="text-3xl font-bold text-gray-900">🔥 Lo más vendido</h2>
          </div>
          <Link href="/categorias" className="text-primary font-bold hover:underline mb-1">Ver todo &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-green-200 transition-colors">
            <div className="text-5xl mb-4 bg-green-50 p-4 rounded-full w-20 h-20 flex items-center justify-center">🚛</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Envío GRATIS</h3>
            <p className="text-gray-500">A todo el país. El precio que ves es el que pagás.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-yellow-200 transition-colors">
            <div className="text-5xl mb-4 bg-yellow-50 p-4 rounded-full w-20 h-20 flex items-center justify-center">💳</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Cuotas Fijas</h3>
            <p className="text-gray-500">Pagá tranquilo con MercadoPago y todas las tarjetas.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-blue-200 transition-colors">
            <div className="text-5xl mb-4 bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center">🔒</div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Compra Segura</h3>
            <p className="text-gray-500">Tu plata está protegida hasta que recibís el producto.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
