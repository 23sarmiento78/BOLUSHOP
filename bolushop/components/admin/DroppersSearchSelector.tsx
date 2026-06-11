"use client";

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, ExternalLink, CheckCircle2, SkipForward } from 'lucide-react';

interface DropperItem {
    productId: string;
    sku: string;
    name: string;
    slug: string;
    searchUrl: string;
}

interface DroppersSearchResult {
    productUrl?: string;
    imageUrl?: string;
    title?: string;
    price?: string;
}

interface DroppersSearchSelectorProps {
    items: DropperItem[];
    onComplete: () => void;
}

export default function DroppersSearchSelector({ items, onComplete }: DroppersSearchSelectorProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DroppersSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedState, setSavedState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [savedMessage, setSavedMessage] = useState('');

    const currentItem = items[currentIndex];
    const defaultQuery = useMemo(() => `${currentItem.sku} ${currentItem.name}`, [currentItem]);

    useEffect(() => {
        setQuery(defaultQuery);
        setSavedState('idle');
        setSavedMessage('');
    }, [currentIndex, defaultQuery]);

    useEffect(() => {
        searchDroppers(defaultQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultQuery]);

    async function searchDroppers(searchTerm: string) {
        setLoading(true);
        setError('');
        setResults([]);

        const queries = [searchTerm.trim()];
        const parts = searchTerm.trim().split(/\s+/).filter(Boolean);
        if (parts.length > 1) {
            const first = parts[0];
            const nameOnly = parts.slice(1).join(' ');
            if (nameOnly && !queries.includes(nameOnly)) queries.push(nameOnly);
            if (first && !queries.includes(first)) queries.push(first);
            if (parts.length > 2) {
                const lastWords = parts.slice(-2).join(' ');
                if (!queries.includes(lastWords)) queries.push(lastWords);
            }
        }
        if (currentItem.slug && !queries.includes(currentItem.slug)) {
            queries.push(currentItem.slug);
        }

        try {
            let found = false;
            for (const queryCandidate of queries) {
                const res = await fetch(`/api/admin/products/search-droppers?q=${encodeURIComponent(queryCandidate)}`);
                const json = await res.json();
                if (!res.ok) {
                    throw new Error(json?.error || 'Error al buscar en Droppers');
                }
                if (json.results && json.results.length > 0) {
                    setResults(json.results);
                    found = true;
                    break;
                }
            }

            if (!found) {
                setResults([]);
                setError('No se encontraron resultados para esa búsqueda.');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    async function handleSelect(result: DroppersSearchResult) {
        setSavedState('saving');
        setSavedMessage('Guardando imagen...');

        try {
            const res = await fetch('/api/admin/products/import-dropers-photos-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: currentItem.productId,
                    imageUrl: result.imageUrl,
                    images: result.imageUrl ? [result.imageUrl] : undefined,
                    productUrl: result.productUrl,
                }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json?.error || 'Error al guardar selección');
            }
            setSavedState('success');
            setSavedMessage('Imagen guardada. Avanzando...');
            setTimeout(() => {
                goNext();
            }, 800);
        } catch (err: unknown) {
            setSavedState('error');
            setSavedMessage(err instanceof Error ? err.message : 'Error desconocido');
        }
    }

    async function skipProduct() {
        setSavedState('saving');
        setSavedMessage('Marcando producto como no disponible...');

        try {
            const res = await fetch('/api/admin/products/import-dropers-photos-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: currentItem.productId, markUnavailable: true }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json?.error || 'Error al saltar el producto');
            }
            setSavedState('success');
            setSavedMessage('Producto saltado. Avanzando...');
            setTimeout(() => goNext(), 800);
        } catch (err: unknown) {
            setSavedState('error');
            setSavedMessage(err instanceof Error ? err.message : 'Error desconocido');
        }
    }

    function goNext() {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Producto {currentIndex + 1} de {items.length}</p>
                        <h2 className="text-2xl font-bold text-gray-900">{currentItem.name}</h2>
                        <p className="text-sm text-gray-500">SKU: {currentItem.sku}</p>
                    </div>
                    <div className="rounded-3xl bg-[#1E5BC6] px-4 py-2 text-white inline-flex items-center gap-2">
                        <Search size={18} />
                        Búsqueda generada
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Consulta de búsqueda</label>
                        <div className="flex gap-2">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 rounded-3xl border border-gray-200 px-4 py-3 shadow-sm focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/20"
                            />
                            <button
                                type="button"
                                onClick={() => searchDroppers(query)}
                                className="inline-flex items-center gap-2 rounded-3xl bg-[#1E5BC6] px-5 py-3 text-white font-semibold hover:bg-blue-700"
                            >
                                <Search size={16} /> Buscar
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Puedes ajustar la búsqueda antes de buscar para mejorar los resultados.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
                        <p className="text-sm font-semibold text-gray-800">URL de búsqueda</p>
                        <p className="text-xs text-gray-500 break-all mt-2">{currentItem.searchUrl}</p>
                        <p className="mt-3 text-xs text-gray-500">Si no aparecen resultados útiles, abre esta URL en otra pestaña.</p>
                    </div>
                </div>

                {loading && (
                    <div className="mt-6 rounded-3xl bg-blue-50 p-4 text-blue-700 flex items-center gap-3">
                        <Loader2 className="animate-spin" size={18} /> Buscando resultados en Droppers...
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-3xl bg-red-50 p-4 text-red-700">{error}</div>
                )}

                {savedState !== 'idle' && (
                    <div className={`mt-6 rounded-3xl p-4 ${savedState === 'error' ? 'bg-red-50 text-red-700' : savedState === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                        {savedMessage}
                    </div>
                )}
            </div>

            <div className="grid gap-4">
                {results.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {results.map((result, index) => (
                            <div key={`${result.productUrl}-${index}`} className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={result.imageUrl || 'https://via.placeholder.com/200x200?text=Sin+imagen'}
                                        alt={result.title || 'Producto Droppers'}
                                        className="h-24 w-24 rounded-3xl object-cover border border-slate-200"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{result.title || 'Sin título disponible'}</p>
                                        {result.price && <p className="text-sm text-amber-700 mt-1">{result.price}</p>}
                                        {result.productUrl && (
                                            <p className="text-xs text-gray-500 mt-2 break-all">{result.productUrl}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {result.productUrl && (
                                        <a
                                            href={result.productUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                        >
                                            <ExternalLink size={16} /> Ver producto
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(result)}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#1E5BC6] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        <CheckCircle2 size={16} /> Esto es correcto
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                        <p className="text-sm font-semibold text-gray-700">No hay resultados actualmente.</p>
                        <p className="text-xs text-gray-500 mt-2">Prueba otra consulta o usa el botón de salto.</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between md:items-center">
                <button
                    type="button"
                    onClick={skipProduct}
                    disabled={savedState === 'saving'}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                    <SkipForward size={16} /> Saltar producto
                </button>
                <button
                    type="button"
                    onClick={() => searchDroppers(query)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E5BC6] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <Search size={16} /> Buscar ahora
                </button>
            </div>
        </div>
    );
}
