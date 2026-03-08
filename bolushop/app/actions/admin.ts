"use server";

import { revalidatePath } from "next/cache";
import {
    getAllProducts,
    saveProducts,
    getAllOrders,
    getSettings,
    getAllCollections,
    saveCollections,
    getAllCategories,
    saveCategories,
    updateOrder,
    getNewsletterSubscribers,
    deleteNewsletterSubscriber,
    deleteProduct,
    deleteCategory,
    deleteCollection,
    deleteAllProducts,
    getAllPosts,
    savePost,
    deletePost
} from "@/lib/db";
import { Product, Collection, Category, Order, BlogPost } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { transformImageUrl } from "@/lib/images";

export async function deleteProductAction(id: string) {
    const success = await deleteProduct(id);
    if (!success) return { success: false, error: "No se pudo eliminar el producto." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteAllProductsAction() {
    const success = await deleteAllProducts();
    if (!success) return { success: false, error: "No se pudieron borrar los productos de la base de datos." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
}

export async function deleteMultipleProductsAction(idsToDelete: string[]) {
    try {
        // En paralelo para velocidad
        const results = await Promise.all(idsToDelete.map(id => deleteProduct(id)));
        const allSuccess = results.every(r => r === true);

        if (!allSuccess) return { success: false, error: "Algunos productos no pudieron ser eliminados." };

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        return { success: false, error: "Error al eliminar múltiples productos." };
    }
}

export async function updateProductAction(updatedProduct: Product) {
    const products = await getAllProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);

    if (index !== -1) {
        products[index] = updatedProduct;
        const result = await saveProducts(products);
        if (!result.success) return { success: false, error: result.error || "Error al actualizar el producto." };

        revalidatePath("/admin/products");
        revalidatePath("/admin");
        revalidatePath("/");
        revalidatePath(`/producto/${updatedProduct.slug}`);
        return { success: true };
    }
    return { success: false, error: "Producto no encontrado" };
}

export async function createProductAction(product: Omit<Product, 'id' | 'createdAt'>) {
    const products = await getAllProducts();
    const newProduct: Product = {
        ...product,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        stock: product.stock || 0,
        collections: product.collections || [],
        isActive: product.isActive ?? false
    };

    products.push(newProduct);
    const result = await saveProducts(products);

    if (!result.success) return { success: false, error: result.error || "No se pudo guardar el producto." };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, product: newProduct };
}

export async function importProductsAction(rawProducts: any[], source: string) {
    try {
        const settings = await getSettings();
        const PROFIT_MARGIN = settings.profitMargin;
        const SHIPPING_COST = settings.shippingCost;

        // Get existing products to preserve custom images
        const existingProducts = await getAllProducts();
        const existingProductsMap = new Map(
            existingProducts.map(p => [p.id, p])
        );

        let mappedProducts: (Product | null)[] = [];

        if (source === 'dropers-csv') {
            mappedProducts = rawProducts.map((row: any) => {
                // Parse Price logic
                let price = 0;
                let priceRaw = row['Precio'];

                if (priceRaw) {
                    if (typeof priceRaw === 'number') {
                        price = priceRaw;
                    } else if (typeof priceRaw === 'string') {
                        const cleanPrice = priceRaw.replace(/\./g, '').replace(',', '.');
                        price = parseFloat(cleanPrice);
                    }
                }
                if (isNaN(price)) price = 0;

                const MIN_BASE_PRICE = 100;
                let features = [];

                if (price > 0) {
                    // Business Rule: Skip products below minimum base price
                    if (price < MIN_BASE_PRICE) return null;

                    const productCost = price; // Current price is the acquisition cost
                    price = productCost; // No automatic increase, user will adjust manually
                    features.push("Envío Gratis 🚚");

                    // Re-assign the cost for persistence
                    row._cost = productCost;
                }

                const description = row['Descripción'] || '';
                const image = row['Imagen'] || '/icon.png';

                // Clean HTML from description
                const cleanHtmlDescription = (html: string): string => {
                    if (!html) return '';

                    // Remove HTML tags but preserve content
                    let text = html
                        .replace(/<div[^>]*>/gi, '')
                        .replace(/<\/div>/gi, '\n')
                        .replace(/<p[^>]*>/gi, '')
                        .replace(/<\/p>/gi, '\n')
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]+>/g, '') // Remove any other HTML tags
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .trim();

                    // Clean up multiple newlines and spaces
                    text = text
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join('. ');

                    return text;
                };

                const cleanDescription = cleanHtmlDescription(description);

                // Fallback logic for category
                const categoryRaw = row['Categorias'] || row['Tags'] || '';
                let category = categoryRaw.trim();

                // Preserve custom image AND category if product already exists
                const productId = String(row['SKU'] || uuidv4());
                const existingProduct = existingProductsMap.get(productId);

                // Use existing data if current row has generic/empty values
                let finalCategory = category;
                let finalCategoryId = existingProduct?.categoryId;

                if (!finalCategory || finalCategory.toLowerCase() === 'varios') {
                    if (existingProduct && existingProduct.category && existingProduct.category.toLowerCase() !== 'varios') {
                        finalCategory = existingProduct.category;
                        finalCategoryId = existingProduct.categoryId;
                    } else {
                        finalCategory = 'Varios';
                    }
                }

                // Use existing custom image if applicable
                let finalImage = image;
                if (existingProduct &&
                    existingProduct.image &&
                    existingProduct.image !== '/icon.png' &&
                    !existingProduct.image.includes('dropers')) {
                    finalImage = existingProduct.image; // Preserve custom image
                }

                return {
                    id: productId,
                    name: row['Nombre'] || 'Sin Nombre',
                    slug: row['Identificador de URL'] || (row['Nombre'] ? row['Nombre'].toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : uuidv4()),
                    price: price,
                    cost: row._cost || 0,
                    image: finalImage,
                    category: finalCategory,
                    categoryId: finalCategoryId,
                    description: cleanDescription,
                    features: features,
                    stock: 99,
                    createdAt: existingProduct?.createdAt || new Date().toISOString(),
                    collections: existingProduct?.collections || [],
                    isActive: existingProduct?.isActive ?? false
                } as Product;
            });
        }

        const validProducts = (mappedProducts.filter(p => p !== null && p.name && p.name !== 'Sin Nombre' && p.price > 0) as Product[]);

        if (validProducts.length > 0) {
            const result = await saveProducts(validProducts);
            if (!result.success) return {
                success: false,
                error: result.error || "Vercel no permite crear archivos en tiempo real. Subí tus productos al GitHub para que aparezcan."
            };

            revalidatePath("/admin/products");
            revalidatePath("/admin");
            revalidatePath("/");
            return { success: true, count: validProducts.length };
        }

        return { success: false, error: "No se encontraron productos validos" };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Error al procesar datos" };
    }
}

// Collection Actions
export async function createCollectionAction(collection: Omit<Collection, 'id'>) {
    const collections = await getAllCollections();
    const newCollection: Collection = {
        ...collection,
        id: uuidv4(),
    };

    collections.push(newCollection);
    const result = await saveCollections(collections);
    if (!result.success) return { success: false, error: result.error || "Error al guardar colección" };
    revalidatePath("/admin/collections");
    revalidatePath("/colecciones");
    revalidatePath("/");
    return { success: true, collection: newCollection };
}

export async function deleteCollectionAction(id: string) {
    const success = await deleteCollection(id);
    if (!success) return { success: false, error: "Error al borrar colección" };
    revalidatePath("/admin/collections");
    revalidatePath("/colecciones");
    revalidatePath("/");
    return { success: true };
}

export async function updateCollectionAction(updatedCollection: Collection) {
    const collections = await getAllCollections();
    const index = collections.findIndex(c => c.id === updatedCollection.id);

    if (index !== -1) {
        collections[index] = updatedCollection;
        const result = await saveCollections(collections);
        if (!result.success) return { success: false, error: result.error || "Error al actualizar colección" };
        revalidatePath("/admin/collections");
        revalidatePath("/colecciones");
        revalidatePath("/");
        revalidatePath(`/coleccion/${updatedCollection.slug}`);
        return { success: true };
    }
    return { success: false, error: "Colección no encontrada" };
}

// Category Actions
export async function createCategoryAction(category: Omit<Category, 'id'>) {
    const categories = await getAllCategories();
    const newCategory: Category = {
        ...category,
        id: uuidv4(),
    };

    categories.push(newCategory);
    const result = await saveCategories(categories);
    if (!result.success) return { success: false, error: result.error || "Error al guardar categoría" };
    revalidatePath("/admin/products");
    return { success: true, category: newCategory };
}

export async function deleteCategoryAction(id: string) {
    const success = await deleteCategory(id);
    if (!success) return { success: false, error: "Error al borrar categoría" };
    revalidatePath("/admin/products");
    return { success: true };
}

export async function updateCategoryAction(updatedCategory: Category) {
    const categories = await getAllCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);

    if (index !== -1) {
        categories[index] = updatedCategory;
        const result = await saveCategories(categories);
        if (!result.success) return { success: false, error: result.error || "Error al actualizar categoría" };
        revalidatePath("/admin/products");
        return { success: true };
    }
    return { success: false, error: "Categoría no encontrada" };
}

// Bulk Actions
export async function bulkUpdatePricesAction(percentage: number, productIds?: string[], categoryId?: string) {
    const products = await getAllProducts();
    const multiplier = 1 + (percentage / 100);

    const updatedProducts = products.map(p => {
        const isInSelection = productIds && productIds.length > 0 ? productIds.includes(p.id) : true;
        const isInCategory = !categoryId || p.categoryId === categoryId || p.category === categoryId;

        if (isInSelection && isInCategory) {
            return { ...p, price: Math.ceil(p.price * multiplier) };
        }
        return p;
    });

    const result = await saveProducts(updatedProducts);
    if (!result.success) return { success: false, error: result.error || "Error al actualizar precios masivamente" };

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, count: updatedProducts.length };
}

export async function bulkResetPricesAction(productIds?: string[], categoryId?: string) {
    const [products, settings] = await Promise.all([
        getAllProducts(),
        getSettings()
    ]);

    const margin = settings.profitMargin || 1.0;
    const shipping = settings.averageShippingCost || 0;

    const updatedProducts = products.map(p => {
        const isInSelection = productIds && productIds.length > 0 ? productIds.includes(p.id) : true;
        const isInCategory = !categoryId || p.categoryId === categoryId || p.category === categoryId;

        if (isInSelection && isInCategory && p.cost) {
            const newPrice = Math.ceil((p.cost * margin) + shipping);
            return { ...p, price: newPrice };
        }
        return p;
    });

    const result = await saveProducts(updatedProducts);
    if (!result.success) return { success: false, error: result.error || "Error al restaurar precios" };

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, count: updatedProducts.length };
}

export async function bulkUpdateCategoriesAction(productIds: string[], categoryName: string, categoryId: string) {
    const products = await getAllProducts();

    const updatedProducts = products.map(p => {
        if (productIds.includes(p.id)) {
            return { ...p, category: categoryName, categoryId: categoryId };
        }
        return p;
    });

    const result = await saveProducts(updatedProducts);
    if (!result.success) return { success: false, error: result.error || "Error al actualizar categorías masivamente" };

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, count: productIds.length };
}

export async function uploadImageAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: "No file provided" };

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (e: any) {
        console.error("❌ Storage Upload Error:", e);
        return { success: false, error: e.message || "Error al subir imagen" };
    }
}

export async function getCategoriesAction() {
    return await getAllCategories();
}

// Orders Actions
export async function updateOrderStatusAction(orderId: string, newStatus: string, extras: any = {}) {
    try {
        await updateOrder(orderId, { status: newStatus as Order['status'], ...extras });
        revalidatePath('/admin/orders');
        revalidatePath('/rastreo');
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getAllOrdersAction() {
    return await getAllOrders();
}

export async function getNewsletterSubscribersAction() {
    return await getNewsletterSubscribers();
}

export async function deleteNewsletterSubscriberAction(email: string) {
    const success = await deleteNewsletterSubscriber(email);
    revalidatePath("/admin/newsletter");
    return success;
}

export async function sendNewsletterCampaignAction(campaign: {
    subject: string;
    bannerUrl?: string;
    content: string;
    collectionId?: string;
}) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("❌ Resend API Key is missing");
            return { success: false, message: "Falta configurar la API Key de Resend en las variables de entorno." };
        }

        const resend = new Resend(apiKey);
        const subscribers = await getNewsletterSubscribers();
        const emails = subscribers.map(s => s.email);

        if (emails.length === 0) {
            return { success: false, message: "No hay suscriptores" };
        }

        // Real email sending via Resend
        const { data, error } = await resend.emails.send({
            from: 'BoluShop <onboarding@resend.dev>', // Should be a verified domain in production
            to: emails,
            subject: campaign.subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
                    ${campaign.bannerUrl ? `<img src="${campaign.bannerUrl}" style="width: 100%; height: auto; display: block;" />` : ''}
                    <div style="padding: 40px;">
                        <h1 style="color: #0F172A; font-size: 24px; font-weight: 900; margin-bottom: 24px;">${campaign.subject}</h1>
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; white-space: pre-line; margin-bottom: 32px;">${campaign.content}</p>
                        ${campaign.collectionId ? `
                            <div style="background-color: #F8FAFC; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #E2E8F0;">
                                <p style="text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; color: #0F172A; margin-bottom: 8px;">Promoción Exclusiva</p>
                                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/productos?coleccion=${campaign.collectionId}" style="display: inline-block; background-color: #0F172A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">Ver Colección</a>
                            </div>
                        ` : ''}
                        <div style="margin-top: 40px; border-top: 1px solid #eee; pt-20; text-align: center;">
                            <p style="font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 20px;">BoluShop Argentina · 2026</p>
                        </div>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error("❌ Resend Error:", error);
            return { success: false, message: "Error al enviar: " + error.message };
        }

        return { success: true, message: `Campaña enviada con éxito a ${emails.length} suscriptores` };
    } catch (e: any) {
        console.error("❌ Campaign Action Error:", e);
        return { success: false, message: e.message || "Error al procesar el envío" };
    }
}
export async function getPostsAction() {
    return await getAllPosts();
}

export async function savePostAction(post: Partial<BlogPost>) {
    const { success, error } = await savePost(post);
    if (success) {
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        revalidatePath("/");
        return { success: true };
    }
    console.error("Error from savePost:", error);
    return { success: false, error: `Error al guardar el artículo: ${error?.message || "Desconocido"}` };
}

export async function deletePostAction(id: string) {
    const success = await deletePost(id);
    if (success) {
        revalidatePath("/admin/blog");
        revalidatePath("/blog");
        revalidatePath("/");
        return { success: true };
    }
    return { success: false, error: "Error al eliminar el artículo" };
}

export async function generateAIArticleAction(products: Product[]) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const productsInfo = products.map(p => `- Producto: ${p.name}\n  Descripción: ${p.description}\n  Características: ${p.features?.join(', ')}`).join('\n\n');

        const prompt = `Actúa como un redactor experto en Blogs y SEO para una tienda de e-commerce en Argentina llamada BoluShop. 
        
Tu objetivo es crear un artículo de ALTO VALOR INFORMATIVO, que sea útil para el lector y cumpla con los estándares de Google AdSense (contenido original, extenso y bien estructurado).

Tengo estos productos relacionados que quiero mencionar:
${productsInfo}

Instrucciones para la redacción:
1. TEMA: No hagas solo una ficha de producto. Creá un artículo útil (ej: "Guía definitiva para...", "Cómo elegir el mejor...", "Tendencias en...", "Los secretos de...").
2. ESTRUCTURA: 
   - Introducción que enganche y explique el problema/necesidad.
   - Párrafos informativos con consejos reales y útiles.
   - Subtítulos (H2, H3) claros y descriptivos.
   - Mención natural de los productos como soluciones o ejemplos, destacando sus beneficios.
   - Conclusión con un consejo final.
3. FORMATO: Usá etiquetas HTML (<h2>, <h3>, <p>, <b>, <ul>, <li>). El artículo debe tener al menos 600-800 palabras de contenido real y variado.
4. TONO: Amigable, experto, cercano y con lenguaje argentino natural (voseo: "comprá", "tenés", "mirá").
5. SEO: Incluye palabras clave de forma natural.

El resultado debe ser un JSON plano (SIN markdown) con esta estructura:
{
  "title": "Un título editorial potente y optimizado para SEO",
  "excerpt": "Un resumen persuasivo de 160 caracteres para buscadores",
  "content": "Contenido completo en HTML (mínimo 4-5 secciones con H2/H3)",
  "category": "Categoría relevante (ej: Guías, Tecnología, Lifestyle)",
  "metaTitle": "Título SEO (máximo 60 caracteres)",
  "metaDescription": "Descripción SEO (máximo 160 caracteres)"
}

IMPORTANTE: Respondé SOLO el objeto JSON limpio. No menciones precios exactos.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No se pudo extraer JSON");

        const data = JSON.parse(jsonMatch[0]);
        return { success: true, data };
    } catch (e: any) {
        console.error("❌ AI Generation Error:", e);
        return { success: false, error: e.message || "Error al generar el artículo" };
    }
}

export async function generateSocialContentAction(post: Partial<BlogPost>, platform: 'instagram' | 'twitter' | 'reddit' | 'pinterest') {
    try {
        let apiKey = process.env.GEMINI_API_KEY;
        let prompt = "";

        switch (platform) {
            case 'instagram':
                apiKey = process.env.GEMINI_API_KEY_INSTAGRAM || apiKey;
                prompt = `Actúa como un experto en Social Media para una tienda de Argentina (BoluShop). Generá un copy para Instagram sobre el artículo "${post.title}". Usá voseo, muchos emojis, saltos de línea y hashtags relevantes. IMPORTANTE: Respondé SOLO con el texto del post, sin explicaciones ni markdown (sin negritas con asteriscos).`;
                break;
            case 'twitter':
                apiKey = process.env.GEMINI_API_KEY_TWITTER || apiKey;
                prompt = `Actúa como un influencer de tecnología/tendencias en Argentina. Generá un HILO de Twitter (máximo 3 tweets) sobre "${post.title}". El primero debe ser un gancho (hook) potente, el segundo con valor y el tercero invitando a leer más en BoluShop. Usá voseo y hashtags como #BoluShop #Argentina. IMPORTANTE: Respondé SOLO el texto de los tweets separados por "---". Sin markdown (sin negritas).`;
                break;
            case 'reddit':
                apiKey = process.env.GEMINI_API_KEY_REDDIT || apiKey;
                prompt = `Actúa como un experto en comunidades de Reddit Argentina. No hagas spam. Redactá un post que aporte VALOR o genere DEBATE basado en "${post.title}". El tono debe ser sarcástico o muy informativo pero "de usuario a usuario". Usá lenguaje argentino de Reddit. IMPORTANTE: Respondé SOLO el texto del post. Sin markdown de negritas.`;
                break;
            case 'pinterest':
                apiKey = process.env.GEMINI_API_KEY_PINTEREST || apiKey;
                prompt = `Actúa como un curador de contenido visual. Generá un título y una descripción optimizada para Pinterest sobre "${post.title}". Enfocante en palabras clave de búsqueda y beneficios estéticos o prácticos. Usá voseo. IMPORTANTE: Respondé SOLO el título y la descripción separados por un salto de línea. Sin markdown.`;
                break;
        }

        const genAI = new GoogleGenerativeAI(apiKey || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);

        const response = await result.response;
        return { success: true, content: response.text() };
    } catch (e: any) {
        console.error(`❌ ${platform} Content Error:`, e);
        return { success: false, error: `Error al generar para ${platform}: ${e.message || 'Error desconocido'}` };
    }
}

/**
 * Descarga la imagen de Dropers y la sube a Supabase Storage (carpeta social/temp/).
 * Retorna la URL pública de Supabase para que Instagram/Make.com pueda accederla.
 * Si la descarga o el upload falla, retorna la URL original sin modificar.
 */
/**
 * Convierte una URL de imagen en una URL pública accesible por Meta/Instagram/Make.
 * Usa el proxy propio de la app para evitar bloqueos de Dropers (sin almacenar nada).
 */
function ensurePublicImageUrl(rawUrl: string): string {
    if (!rawUrl) return rawUrl;
    if (rawUrl.includes('supabase') || rawUrl.startsWith('data:')) return rawUrl;

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://bolushop.com').replace(/\/$/, '');

    // Si ya es absoluta y no es Dropers, la dejamos
    if (rawUrl.startsWith('http') && !rawUrl.includes('droppers.com.ar')) {
        return rawUrl;
    }

    // Proxy para todo lo demás (especialmente Dropers)
    return `${baseUrl}/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
}



export async function publishToInstagramAction(imageUrl: string, caption: string) {
    try {
        const IG_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

        if (!IG_ID || !ACCESS_TOKEN) {
            throw new Error("Faltan credenciales de Instagram (IG_ID o TOKEN)");
        }

        // Truncar caption para cumplir con el límite de Instagram (2200 chars)
        const finalCaption = caption.length > 2100 ? caption.substring(0, 2100) + "..." : caption;

        // Proxy URL para que Meta pueda accederla sin bloqueo de Dropers
        const finalImageUrl = ensurePublicImageUrl(imageUrl);
        console.log("🚀 Publicando en IG con URL proxy:", finalImageUrl);

        // 1. Crear el contenedor del medio
        const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media`, {
            method: 'POST',
            body: new URLSearchParams({
                image_url: finalImageUrl,
                caption: finalCaption,
                access_token: ACCESS_TOKEN
            })
        });

        const mediaData = await mediaRes.json();
        if (mediaData.error) {
            console.error("❌ Error Meta API (Media):", mediaData.error);
            throw new Error(`Error reservando media: ${mediaData.error.message} (código ${mediaData.error.code})`);
        }

        const creationId = mediaData.id;

        // 10 segundos de espera para que Facebook procese la imagen (opcional pero recomendado para URLs lentas)
        // await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. Publicar el contenedor
        const publishRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ID}/media_publish`, {
            method: 'POST',
            body: new URLSearchParams({
                creation_id: creationId,
                access_token: ACCESS_TOKEN
            })
        });

        const publishData = await publishRes.json();
        if (publishData.error) {
            console.error("❌ Error Meta API (Publish):", publishData.error);
            throw new Error(`Error publicando: ${publishData.error.message}`);
        }

        return { success: true, postId: publishData.id };
    } catch (e: any) {
        console.error("❌ IG Publish Error:", e);
        return { success: false, error: e.message || "Error al publicar en Instagram" };
    }
}

export async function publishToSocialWebhookAction(post: Partial<BlogPost>, socialContent: any) {
    try {
        const webhookUrl = process.env.SOCIAL_WEBHOOK_URL;
        if (!webhookUrl) {
            return { success: false, error: "No configuraste la URL del Webhook en .env.local" };
        }

        // Proxy URL para evitar bloqueo de Dropers en Make/Instagram
        const rawImageUrl = transformImageUrl(post.image || '');
        const absoluteImageUrl = ensurePublicImageUrl(rawImageUrl);

        console.log("📡 Webhook → imagen proxy:", absoluteImageUrl);

        const payload = {
            title: post.title || "Sin título",
            post_link: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug || ""}`,
            image_url: absoluteImageUrl,
            content_instagram: socialContent.instagram || "",
            content_twitter: socialContent.twitter || "",
            content_reddit: socialContent.reddit || "",
            content_pinterest: socialContent.pinterest || "",
            published_at: new Date().toISOString(),
            platform_target: "all"
        };

        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            return { success: true, imageUrl: absoluteImageUrl };
        } else {
            console.error("❌ Webhook Response Error:", res.status, await res.text());
            return { success: false, error: `El servidor de automatización respondió con error (${res.status}).` };
        }
    } catch (e: any) {
        console.error("❌ Webhook Error:", e);
        return { success: false, error: e.message || "Error al conectar con el servidor de automatización." };
    }
}
