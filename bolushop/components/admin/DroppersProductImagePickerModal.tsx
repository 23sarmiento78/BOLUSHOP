"use client";

import { useEffect, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

const MAX_IMAGES = 4;

interface DroppersProductImagePickerModalProps {
    productTitle?: string;
    productUrl?: string;
    onConfirm: (images: string[]) => void;
    onClose: () => void;
}

export default function DroppersProductImagePickerModal({
    productTitle,
    productUrl,
    onConfirm,
    onClose,
}: DroppersProductImagePickerModalProps) {
    const [images, setImages] = useState<string[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!productUrl) {
            setError('No hay URL de producto disponible.');
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadImages() {
            setLoading(true);
            setError('');
            setImages([]);
            setSelected([]);

            try {
                const res = await fetch(
                    `/api/admin/products/droppers-product-images?url=${encodeURIComponent(productUrl)}`,
                );
                const json = await res.json();

                if (cancelled) return;

                if (!res.ok) {
                    throw new Error(json?.error || 'Error al cargar imágenes del producto');
                }

                const fetchedImages = Array.isArray(json.images) ? json.images : [];
                if (fetchedImages.length === 0) {
                    setError('No se encontraron imágenes en la página del producto.');
                } else {
                    setImages(fetchedImages);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Error desconocido');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadImages();

        return () => {
            cancelled = true;
        };
    }, [productUrl]);

    function toggleImage(url: string) {
        setSelected((prev) => {
            if (prev.includes(url)) {
                return prev.filter((item) => item !== url);
            }
            if (prev.length >= MAX_IMAGES) {
                return prev;
            }
            return [...prev, url];
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Seleccionar imágenes</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Elige hasta {MAX_IMAGES} fotos para guardar en el producto.
                        </p>
                        {productTitle && (
                            <p className="text-sm font-semibold text-gray-800 mt-2">{productTitle}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center gap-3 py-16 text-[#1E5BC6]">
                            <Loader2 className="animate-spin" size={22} />
                            <span className="font-semibold">Cargando imágenes del producto...</span>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-3xl bg-red-50 p-4 text-red-700">{error}</div>
                    )}

                    {!loading && !error && images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {images.map((url, index) => {
                                const isSelected = selected.includes(url);
                                const selectionIndex = selected.indexOf(url);
                                const isDisabled = !isSelected && selected.length >= MAX_IMAGES;

                                return (
                                    <button
                                        key={`${url}-${index}`}
                                        type="button"
                                        onClick={() => toggleImage(url)}
                                        disabled={isDisabled}
                                        className={`relative overflow-hidden rounded-3xl border-2 transition-all ${
                                            isSelected
                                                ? 'border-[#1E5BC6] ring-2 ring-[#1E5BC6]/30'
                                                : 'border-gray-200 hover:border-[#1E5BC6]/50'
                                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Imagen ${index + 1}`}
                                            className="h-40 w-full object-cover"
                                        />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-[#1E5BC6]/20 flex items-start justify-end p-3">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E5BC6] text-white text-sm font-bold">
                                                    {selectionIndex + 1}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-gray-500">
                        {selected.length} de {MAX_IMAGES} imágenes seleccionadas
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => onConfirm(selected)}
                            disabled={selected.length === 0}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1E5BC6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={16} />
                            Guardar selección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
