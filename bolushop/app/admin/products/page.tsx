import Link from 'next/link';
import { getAllProducts } from '@/lib/db';
import ProductsTable from './ProductsTable';
import { Plus, Download, Filter, Package2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsManagerPage() {
    const products = await getAllProducts();

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-none">
                        Gestión de <span className="text-primary italic">Productos</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Administrá el inventario físico y digital de tu tienda
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/upload" className="bg-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all flex items-center gap-2">
                        <Download size={14} /> Importar Datos
                    </Link>
                    <Link href="/admin/products/new" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-gray-200 hover:scale-105 transition-all flex items-center gap-2">
                        <Plus size={16} /> Crear Producto
                    </Link>
                </div>
            </div>

            {/* Global Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Package2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total SKUs</p>
                        <p className="text-2xl font-black text-gray-900">{products.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
                        <Filter size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categorías</p>
                        <p className="text-2xl font-black text-gray-900">
                            {new Set(products.map(p => p.category)).size}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Stock</p>
                        <p className="text-2xl font-black text-gray-900">
                            {products.filter(p => p.stock > 0).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Listado Completo</h3>
                    <div className="text-[10px] font-bold text-gray-400">Actualizado hace un momento</div>
                </div>
                <div className="p-6 md:p-10">
                    <ProductsTable initialProducts={products} />
                </div>
            </div>
        </div>
    );
}
