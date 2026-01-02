import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-black mb-4">BoluShop</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Tu marketplace de confianza en Argentina. Calidad garantizada y envíos rápidos a todo el país.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xl font-black mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/productos" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/carrito" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Carrito
                                </Link>
                            </li>
                            <li>
                                <Link href="/rastreo" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Seguí tu Pedido 🚚
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-black mb-4">Contacto</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>📧sarmientoisrael118@gmail.com</p>
                            <p>📱 WhatsApp: +54 9 3541237972</p>
                            <div className="flex gap-4 mt-4">
                                <a href="https://www.instagram.com/bolushop.arg" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                    📷
                                </a>
                                <a href="https://www.tiktok.com/@bolushop.ok" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                    🎵
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} BoluShop. Todos los derechos reservados.</p>
                    <p className="mt-2">Aceptamos Mercado Pago 💳</p>
                </div>
            </div>
        </footer>
    );
}
