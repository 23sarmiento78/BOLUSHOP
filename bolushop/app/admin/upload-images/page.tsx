"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DroppersSearchSelector from '@/components/admin/DroppersSearchSelector';
import { Loader2, ImagePlus, AlertTriangle } from 'lucide-react';

interface ProcessItem {
    productId: string;
    sku: string;
    name: string;
    slug: string;
    searchUrl: string;
}

export default function UploadImagesPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [msg, setMsg] = useState('');
    const [items, setItems] = useState<ProcessItem[]>([]);
    const router = useRouter();

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('loading');
        setMsg('Preparando productos...');

        try {
            const formData = new FormData();
            formData.append('csv', file);

            const res = await fetch('/api/admin/products/import-dropers-photos', {
                method: 'POST',
                body: formData,
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Error del servidor: ${text.slice(0, 300)}`);
            }

            if (!res.ok) {
                throw new Error(data?.error || data?.message || `Error (${res.status})`);
            }

            if (!data.success || !data.items || data.items.length === 0) {
                throw new Error('No se encontraron productos para procesar');
            }

            setItems(data.items);
            setStatus('ready');
            setMsg(`Listos ${data.total} productos para actualizar fotos`);
        } catch (error: unknown) {
            setStatus('error');
            setMsg(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            e.target.value = '';
        }
    }

    function handleSelectorComplete() {
        setStatus('idle');
        setItems([]);
        router.push('/admin/products');
        router.refresh();
    }

    if (status === 'ready' && items.length > 0) {
        return <DroppersSearchSelector items={items} onComplete={handleSelectorComplete} />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            <AdminPageHeader
                title="Actualizar fotos Dropers"
                subtitle="Carga un CSV para seleccionar manualmente las imágenes de cada producto en Droppers."
            />

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={22} />
                <div className="text-sm text-amber-900">
                    <p className="font-bold mb-1">Formato CSV</p>
                    <p>Separador <code>;</code> o <code>,</code>. Columnas mínimas: <strong>SKU</strong> y <strong>Nombre</strong>.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1E5BC6]/10 flex items-center justify-center">
                        <ImagePlus className="text-[#1E5BC6]" size={22} />
                    </div>
                    <div>
                        <h2 className="font-black text-gray-900">Selección manual de imágenes</h2>
                        <p className="text-xs text-gray-500 font-medium">Abre Droppers y selecciona cada imagen</p>
                    </div>
                </div>

                <p className="text-sm text-gray-600">
                    Se mostrará una búsqueda interna de Droppers directamente en el admin. Selecciona la tarjeta correcta del producto y presiona "Esto es correcto". Si no encuentras el producto, presiona "Saltar producto".
                </p>

                <label className="block">
                    <input
                        type="file"
                        accept=".csv"
                        disabled={status === 'loading'}
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest file:bg-[#1E5BC6] file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                    />
                </label>

                {status === 'loading' && (
                    <div className="flex items-center gap-3 text-[#1E5BC6] font-semibold p-4 bg-blue-50 rounded-lg">
                        <Loader2 className="animate-spin" size={22} />
                        {msg}
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-red-700 font-semibold p-4 bg-red-50 rounded-lg border border-red-100">
                        {msg}
                    </div>
                )}
            </div>
        </div>
    );
}
