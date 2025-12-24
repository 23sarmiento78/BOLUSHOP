import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Bolu<span className="text-primary">Shop</span></h3>
                        <p className="text-gray-500 max-w-xs">
                            La tienda oficial de los argentinos que quieren comprar rápido, barato y sin vueltas.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Links Útiles</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-500 hover:text-primary transition-colors">Inicio</Link></li>
                            <li><Link href="/categorias" className="text-gray-500 hover:text-primary transition-colors">Categorías</Link></li>
                            <li><Link href="/contacto" className="text-gray-500 hover:text-primary transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/terminos" className="text-gray-500 hover:text-primary transition-colors">Términos</Link></li>
                            <li><Link href="/privacidad" className="text-gray-500 hover:text-primary transition-colors">Privacidad</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">© {new Date().getFullYear()} BoluShop Argentina. Todos los reservchos.</p>
                    <div className="flex gap-4">
                        {/* Social icons placeholder */}
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">Ig</div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">Tw</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
