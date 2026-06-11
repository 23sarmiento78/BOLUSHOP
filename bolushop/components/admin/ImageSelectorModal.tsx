"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, SkipForward, Loader2, ExternalLink } from 'lucide-react';

interface ImageSelectorModalProps {
    items: Array<{
        productId: string;
        sku: string;
        name: string;
        searchUrl: string;
    }>;
    onComplete: () => void;
}

export default function ImageSelectorModal({ items, onComplete }: ImageSelectorModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [savingState, setSavingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [savingMsg, setSavingMsg] = useState('');
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [droppersOpen, setDroppersOpen] = useState(false);
    const popupRef = useRef<Window | null>(null);

    const currentItem = items[currentIndex];
    const progress = Math.round(((currentIndex + 1) / items.length) * 100);
    const [pasteValue, setPasteValue] = useState('');

    const bookmarkletCode = "javascript:(()=>{function onClick(e){e.preventDefault();e.stopPropagation();const img=(e.target.closest && e.target.closest('img'))||document.querySelector('img');const src=img?img.src:window.location.href;window.opener.postMessage({type:'DROP_PRODUCT_SELECTED',imageUrl:src,images:[src]},'*');alert('Imagen enviada');}document.addEventListener('click',onClick,true);alert('Ahora haz clic en la imagen del producto para enviarla');})();";

    function copyBookmarklet() {
        try {
            navigator.clipboard.writeText(bookmarkletCode);
            alert('Bookmarklet copiado al portapapeles. Pégalo en la barra de favoritos o ejecútalo en la página.');
        } catch (err) {
            console.warn('Clipboard failed', err);
            alert('No se pudo copiar automáticamente. Copia manualmente el texto del bookmarklet.');
        }
    }

    function applyPasted() {
        const v = pasteValue.trim();
        if (!v) return;
        // Si es una lista separada por comas, tomar la primera como imagen
        const parts = v.split(',').map(s => s.trim()).filter(Boolean);
        setSelectedImageUrl(parts[0]);
        setSelectedImages(parts);
        setPasteValue('');
    }

    useEffect(() => {
        setSelectedImageUrl(null);
        setSelectedImages([]);
        setDroppersOpen(false);
    }, [currentIndex]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Aceptamos mensajes del popup/bookmarklet; validamos por tipo
            try {
                if (!event.data || event.data.type !== 'DROP_PRODUCT_SELECTED') return;
                const { imageUrl, images } = event.data;
                if (imageUrl) {
                    setSelectedImageUrl(imageUrl);
                    setSelectedImages(images || [imageUrl]);
                }
            } catch (err) {
                // ignore
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    function openDroppers() {
        const popup = window.open(currentItem.searchUrl, 'droppers_search', 'width=1200,height=800,scrollbars=yes');
        if (popup) {
            popupRef.current = popup;
            setDroppersOpen(true);

            // Inyectar script en el popup cuando se cargue
            const checkPopupReady = setInterval(() => {
                try {
                    if (popup.document.readyState === 'complete') {
                        injectDroppersScript(popup);
                        clearInterval(checkPopupReady);
                    }
                } catch {
                    // Cross-origin, continuaremos intentando
                }
            }, 500);

            // Dejar de intentar después de 10 segundos
            setTimeout(() => clearInterval(checkPopupReady), 10000);
        }
    }

    async function saveAndNext(imageUrl?: string, images?: string[], markUnavailable = false) {
        setSavingState('loading');
        setSavingMsg(markUnavailable ? 'Marcando como no disponible...' : 'Guardando imagen...');

        try {
            const res = await fetch('/api/admin/products/import-dropers-photos-save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: currentItem.productId,
                    imageUrl,
                    images,
                    markUnavailable,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al guardar');
            }

            setSavingState('success');
            setSavingMsg(markUnavailable ? 'Producto saltado ✓' : 'Imagen guardada ✓');

            setTimeout(() => {
                if (currentIndex < items.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setSavingState('idle');
                } else {
                    onComplete();
                }
            }, 800);
        } catch (error: unknown) {
            setSavingState('error');
            setSavingMsg(error instanceof Error ? error.message : 'Error desconocido');
        }
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-[#0a1628] border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-lg font-bold text-white">Seleccionar imágenes de Droppers</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="font-semibold text-white">{currentIndex + 1}</span>
                        <span>/</span>
                        <span>{items.length}</span>
                    </div>
                </div>
                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-[#1E5BC6] h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* Instructions Side */}
                <div className="w-96 bg-white rounded-lg border border-gray-200 flex flex-col shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#1E5BC6] to-blue-700">
                        <h3 className="font-bold text-white">Instrucciones</h3>
                    </div>

                    <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs font-semibold text-blue-900 mb-2">Producto actual:</p>
                            <p className="text-sm font-bold text-gray-900">{currentItem.name}</p>
                            <p className="text-xs text-gray-600 mt-1">SKU: {currentItem.sku}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pasos:</p>
                            <ol className="text-xs text-gray-700 space-y-2 ml-4 list-decimal">
                                <li>Haz click en <strong>"Abrir Droppers"</strong></li>
                                <li>Se abrirá una ventana con los resultados de búsqueda</li>
                                <li>
                                    <strong>Haz click en la tarjeta del producto correcto</strong>
                                </li>
                                <li>La imagen se capturará automáticamente</li>
                                <li>Presiona <strong>"Siguiente"</strong> para guardar</li>
                            </ol>
                        </div>

                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-900 font-semibold">💡 Tip:</p>
                            <p className="text-xs text-amber-800 mt-1">
                                Si no encuentras el producto, usa "Saltar" para marcarlo como no disponible.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-200 flex flex-col gap-3">
                        {selectedImageUrl && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">✓ Imagen seleccionada:</p>
                                <img
                                    src={selectedImageUrl}
                                    alt="Selected"
                                    className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                                />
                            </div>
                        )}

                        {savingState === 'loading' && (
                            <div className="flex items-center gap-2 text-[#1E5BC6] font-semibold p-3 bg-blue-50 rounded-lg">
                                <Loader2 className="animate-spin" size={18} />
                                {savingMsg}
                            </div>
                        )}

                        {savingState === 'success' && (
                            <div className="text-green-700 font-semibold p-3 bg-green-50 rounded-lg">
                                {savingMsg}
                            </div>
                        )}

                        {savingState === 'error' && (
                            <div className="text-red-700 font-semibold p-3 bg-red-50 rounded-lg">
                                {savingMsg}
                            </div>
                        )}

                        <button
                            onClick={() => saveAndNext(selectedImageUrl || undefined, selectedImages || undefined)}
                            disabled={!selectedImageUrl || savingState === 'loading'}
                            className="w-full py-3 px-4 bg-[#1E5BC6] text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                        >
                            Siguiente
                            <ChevronRight size={18} />
                        </button>

                        <button
                            onClick={() => saveAndNext(undefined, undefined, true)}
                            disabled={savingState === 'loading'}
                            className="w-full py-2 px-4 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                        >
                            <SkipForward size={16} />
                            Saltar producto
                        </button>
                    </div>
                </div>

                {/* Status Side */}
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 flex flex-col p-4 overflow-hidden">
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Iframe preview */}
                        <div className="flex-1 rounded-md overflow-hidden border bg-white">
                            <iframe
                                title="Droppers Preview"
                                src={currentItem.searchUrl}
                                className="w-full h-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-md border">
                                <p className="text-sm font-semibold mb-2">Abrir en ventana</p>
                                <p className="text-xs text-gray-600 mb-3">Si necesitas seleccionar directamente en la página, abre en una pestaña separada.</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={openDroppers}
                                        className="px-3 py-2 bg-[#1E5BC6] text-white rounded-md flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Abrir en pestaña
                                    </button>
                                    <button
                                        onClick={copyBookmarklet}
                                        className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md"
                                    >
                                        Copiar bookmarklet
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-3">Instrucciones: copia el bookmarklet y ejecútalo en la pestaña de Droppers. Luego haz click en la imagen del producto.</p>
                            </div>

                            <div className="bg-white p-3 rounded-md border">
                                <p className="text-sm font-semibold mb-2">Pegar URL / imagen (fallback)</p>
                                <p className="text-xs text-gray-600 mb-2">Pega la URL de la imagen o múltiples URLs separadas por comas.</p>
                                <div className="flex gap-2">
                                    <input
                                        value={pasteValue}
                                        onChange={(e) => setPasteValue(e.target.value)}
                                        placeholder="https://.../imagen.jpg"
                                        className="flex-1 px-2 py-2 border rounded-md"
                                    />
                                    <button onClick={applyPasted} className="px-3 py-2 bg-green-600 text-white rounded-md">Usar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                        <p>Nota: si el bookmarklet no funciona por políticas de la página, copia manualmente la URL de la imagen y pégala en el campo de la derecha.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function injectDroppersScript(popup: Window) {
    try {
        const script = popup.document.createElement('script');
        script.textContent = `
(function() {
    console.log('[DROPERS] Script inyectado, esperando clicks en productos...');
    
    const productSelectors = [
        '.product-item-info',
        '[data-product-id]',
        '.product-card',
        '.product-item',
        'li.item',
        '.product',
        '.product__image-wrapper',
        'a[href*="/catalog/"]',
        '.products-grid li',
        '.search-results [data-product-id]',
    ];
    
    function isProductElement(el) {
        for (const selector of productSelectors) {
            if (el.matches(selector) || el.closest(selector)) {
                return true;
            }
        }
        return false;
    }
    
    function extractImages(element) {
        const images = [];
        const imgElements = element.querySelectorAll('img');
        
        for (const img of imgElements) {
            let src = img.getAttribute('data-src') || 
                     img.getAttribute('data-original') ||
                     img.getAttribute('data-lazy-src') ||
                     img.getAttribute('src') || '';
            
            if (src && !src.includes('placeholder') && !src.includes('data:') && !src.includes('icon')) {
                if (!images.includes(src)) {
                    images.push(src);
                }
            }
        }
        
        return images;
    }
    
    function handleProductClick(e) {
        try {
            const target = e.target instanceof Element ? e.target : (e.target && e.target.parentElement) ? e.target.parentElement : null;
            if (!target) return;

            // Evitar que un click en el enlace navegue fuera
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();

            let productElement = null;
            // Buscar el elemento producto más cercano
            for (const selector of productSelectors) {
                if (typeof target.closest === 'function') {
                    const found = target.closest(selector);
                    if (found) {
                        productElement = found;
                        break;
                    }
                }
            }

            if (!productElement) return;

            const images = extractImages(productElement);
            if (images.length > 0) {
                console.log('[DROPERS] Imágenes encontradas:', images);
                try {
                    window.opener.postMessage({
                        type: 'DROP_PRODUCT_SELECTED',
                        imageUrl: images[0],
                        images: images
                    }, '*');
                } catch (err) {
                    console.warn('[DROPERS] postMessage falló:', err);
                }

                try { if (window.opener && window.opener.focus) window.opener.focus(); } catch {}

                // Marcar como seleccionado visualmente
                try {
                    productElement.style.border = '3px solid #1E5BC6';
                    productElement.style.backgroundColor = 'rgba(30, 91, 198, 0.1)';
                } catch (err) {}
            }
        } catch (err) {
            console.warn('[DROPERS] handle click error', err);
        }
    }
    
    document.addEventListener('click', handleProductClick, true);
    console.log('[DROPERS] Event listeners registrados');
})();
        `;
        popup.document.body.appendChild(script);
        console.log('Script inyectado en popup de Droppers');
    } catch (error) {
        console.warn('No se pudo inyectar script en Droppers:', error);
    }
}
