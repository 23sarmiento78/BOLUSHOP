"use client";

import { useState } from 'react';
import Papa from 'papaparse';
import { importProductsAction } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Loader2, Sparkles, Upload, AlertTriangle } from 'lucide-react';

type ImportMode = 'full' | 'quick' | 'full-with-images';

export default function UploadPage() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');
    const [details, setDetails] = useState<string[]>([]);
    const router = useRouter();

    function parseCsvFile(file: File): Promise<{ data: Record<string, unknown>[]; delimiter: string }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const firstLine = text.split('\n')[0];
                const semicolonCount = (firstLine.match(/;/g) || []).length;
                const commaCount = (firstLine.match(/,/g) || []).length;
                const delimiter = semicolonCount > commaCount ? ';' : ',';

                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter,
                    encoding: 'UTF-8',
                    complete: (results) => resolve({ data: results.data as Record<string, unknown>[], delimiter }),
                    error: (error) => reject(error),
                });
            };
            reader.readAsText(file.slice(0, 4096), 'UTF-8');
        });
    }

    async function parseServerResponse(res: Response) {
        const text = await res.text();
        if (!res.ok) {
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Error del servidor (${res.status}): ${text.replace(/\s+/g, ' ').slice(0, 300)}`);
            }
            throw new Error(data?.error || data?.message || `Error del servidor (${res.status})`);
        }

        try {
            return JSON.parse(text);
        } catch {
            throw new Error(`Respuesta inválida del servidor: ${text.replace(/\s+/g, ' ').slice(0, 300)}`);
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, mode: ImportMode) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (mode === 'full') {
            const confirmed = confirm(
                'Esto REESCRIBIRÁ todo el catálogo de proveedor con el CSV.\n\n' +
                '• Verificará stock en droppers.com.ar\n' +
                '• Optimizará descripciones con IA\n' +
                '• Los productos no encontrados quedarán sin stock\n\n' +
                'Los referidos de Mercado Libre NO se eliminan.\n\n¿Continuar?',
            );
            if (!confirmed) {
                e.target.value = '';
                return;
            }
        }

        setStatus('processing');
        setMsg(mode === 'full' ? 'Procesando catálogo (Dropers + IA)...' : 'Importando CSV...');
        setDetails([]);

        try {
            if (mode === 'full') {
                const formData = new FormData();
                formData.append('csv', file);
                formData.append('replaceCatalog', 'true');

                const res = await fetch('/api/admin/products/import-dropers', {
                    method: 'POST',
                    body: formData,
                });
                const result = await parseServerResponse(res);

                if (!result.success) {
                    throw new Error(result.error || 'Error en la importación completa');
                }

                setStatus('success');
                setMsg(
                    `Catálogo actualizado: ${result.imported} productos · ` +
                    `${result.available} disponibles · ${result.unavailable} sin stock · ` +
                    `${result.optimized} optimizados con IA`,
                );
                if (result.errors?.length) {
                    setDetails(result.errors.slice(0, 10));
                }
            } else {
                const { data: csvData } = await parseCsvFile(file);
                const result = await importProductsAction(csvData, 'dropers-csv');
                if (!result.success) throw new Error(result.error);
                setStatus('success');
                setMsg(`Se importaron ${result.count} productos correctamente.`);
            }

            setTimeout(() => {
                router.push('/admin/products');
                router.refresh();
            }, 2500);
        } catch (error: unknown) {
            setStatus('error');
            setMsg(error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            e.target.value = '';
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            <AdminPageHeader
                title="Importar Dropers"
                subtitle="CSV con precio final. El modo completo reescribe el catálogo, verifica stock en Dropers y optimiza con IA."
            />

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={22} />
                <div className="text-sm text-amber-900">
                    <p className="font-bold mb-1">Formato CSV</p>
                    <p>Separador <code>;</code> o <code>,</code>. Columnas: SKU, Nombre, Precio (final), Descripción, Imagen, Categorias, Identificador de URL.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#1E5BC6]/10 flex items-center justify-center">
                            <Sparkles className="text-[#1E5BC6]" size={22} />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900">Reescribir catálogo + IA</h2>
                            <p className="text-xs text-gray-500 font-medium">Recomendado</p>
                        </div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                        <li>Reemplaza productos de proveedor</li>
                        <li>Scraping en droppers.com.ar</li>
                        <li>Marca sin stock si no aparece</li>
                        <li>Optimiza descripción con Gemini</li>
                    </ul>
                    <label className="block">
                        <input
                            type="file"
                            accept=".csv"
                            disabled={status === 'processing'}
                            onChange={(e) => handleFileUpload(e, 'full')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest file:bg-[#1E5BC6] file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                        />
                    </label>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Upload className="text-gray-600" size={22} />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900">Importación rápida</h2>
                            <p className="text-xs text-gray-500 font-medium">Sin IA ni verificación</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Solo carga el CSV y fusiona productos. No verifica Dropers ni optimiza con IA.
                    </p>
                    <label className="block">
                        <input
                            type="file"
                            accept=".csv"
                            disabled={status === 'processing'}
                            onChange={(e) => handleFileUpload(e, 'quick')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:font-black file:text-xs file:uppercase file:tracking-widest file:bg-gray-800 file:text-white hover:file:bg-gray-900 disabled:opacity-50"
                        />
                    </label>
                </div>
            </div>

            {status === 'processing' && (
                <div className="flex items-center justify-center gap-3 text-[#1E5BC6] font-semibold py-6">
                    <Loader2 className="animate-spin" size={22} />
                    {msg}
                    <p className="text-xs text-gray-400 w-full text-center mt-2">
                        Puede tardar varios minutos según la cantidad de productos.
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="bg-green-50 text-green-800 p-5 rounded-2xl border border-green-100 font-semibold">
                    {msg}
                    {details.length > 0 && (
                        <ul className="mt-3 text-xs font-normal space-y-1 list-disc pl-5">
                            {details.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 font-semibold">
                    {msg}
                </div>
            )}
        </div>
    );
}
