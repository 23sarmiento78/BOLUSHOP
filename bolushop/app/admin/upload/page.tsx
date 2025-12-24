"use client";
import { useState } from 'react';
import Papa from 'papaparse';
import { importProductsAction } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

/*
IMPORTANTE:
El archivo de productos es un CSV separado por punto y coma (;), no por comas.
Debe parsearse respetando:
- Delimitador: ;
- Texto entre comillas dobles "
- Encoding UTF-8 / Latin (ISO-8859-1)
- No asumir coma como separador
- El HTML dentro de la columna Descripción es válido y no debe romper filas
- Las columnas se deben mapear exactamente según el header
*/

export default function UploadPage() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus('processing');

        // 1. Detect delimiter by reading the first chunk
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const firstLine = text.split('\n')[0];

            const semicolonCount = (firstLine.match(/;/g) || []).length;
            const commaCount = (firstLine.match(/,/g) || []).length;

            const detectedDelimiter = semicolonCount > commaCount ? ";" : ",";
            console.log(`Smart Detection: Found ${semicolonCount} semicolons and ${commaCount} commas. Using delimiter: "${detectedDelimiter}"`);

            // 2. Parse with detected delimiter
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: detectedDelimiter,
                encoding: "UTF-8",
                complete: async (results) => {
                    try {
                        const csvData = results.data;
                        console.log(`Processing CSV (${results.meta.delimiter} detected)...`, csvData.length, "rows");

                        // Use Server Action directly
                        const result = await importProductsAction(csvData, 'dropers-csv');

                        if (result.success) {
                            setStatus('success');
                            setMsg(`Se importaron ${result.count} productos correctamente.`);
                            setTimeout(() => {
                                router.push('/admin/products');
                                router.refresh();
                            }, 1500);
                        } else {
                            throw new Error(result.error);
                        }
                    } catch (error: any) {
                        console.error(error);
                        setStatus('error');
                        setMsg('Error: ' + (error.message || 'Desconocido'));
                    }
                },
                error: (error) => {
                    console.error(error);
                    setStatus('error');
                    setMsg('Error crítico al leer CSV: ' + error.message);
                }
            });
        };

        // Read first 4KB to detect delimiter
        reader.readAsText(file.slice(0, 4096), "UTF-8");
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Importar Productos (Dropers)</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">Seleccioná el archivo <strong>.csv</strong> de Dropers.</p>
                    <p className="text-xs text-gray-400">Separado por punto y coma (;).</p>
                </div>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-emerald-600
                    "
                />

                {status === 'processing' && (
                    <div className="mt-6 text-blue-500 animate-pulse">Procesando archivo...</div>
                )}

                {status === 'success' && (
                    <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-lg">
                        ✅ {msg}
                        <p className="text-sm mt-2">Redirigiendo...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg">
                        ❌ {msg}
                    </div>
                )}
            </div>
        </div>
    );
}
