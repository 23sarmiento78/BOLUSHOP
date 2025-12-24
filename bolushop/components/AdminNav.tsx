"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
    const pathname = usePathname();

    // Don't show nav on login page
    if (pathname === '/admin/login') return null;

    const links = [
        { href: '/admin', label: '📊 Dashboard' },
        { href: '/admin/products', label: '📦 Productos' },
        { href: '/admin/orders', label: '🚚 Pedidos' },
        { href: '/admin/upload', label: '📥 Importar CSV' },
    ];

    return (
        <nav className="bg-gray-900 text-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <div className="font-bold text-lg tracking-wide">
                        <span className="text-secondary">Admin</span>Panel
                    </div>

                    <div className="flex gap-1 md:gap-4 overflow-x-auto">
                        {links.map(link => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                       ${isActive ? 'bg-gray-800 text-white border-b-2 border-secondary' : 'text-gray-300 hover:text-white hover:bg-gray-800'}
                     `}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden md:block text-xs text-gray-400">
                        BoluShop v1.0
                    </div>
                </div>
            </div>
        </nav>
    );
}
