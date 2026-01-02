import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { product } = await req.json();

        if (!product || !product.name) {
            return NextResponse.json(
                { error: 'Producto inválido' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });

        const prompt = `Sos un experto en e-commerce y copywriting para tiendas online en Argentina. 
        
Tengo este producto:
- Nombre: ${product.name}
- Categoría: ${product.category || 'Sin categoría'}
- Precio: $${product.price || 0}
- Descripción actual: ${product.description || 'Sin descripción'}
- Características actuales: ${product.features?.join(', ') || 'Sin características'}

Por favor, generá mejoras para este producto en formato JSON con esta estructura exacta:
{
  "description": "Una descripción atractiva, persuasiva y optimizada para SEO de 2-3 oraciones. Debe ser profesional pero cercana, destacar beneficios y usar lenguaje argentino natural.",
  "features": ["Característica 1", "Característica 2", "Característica 3", "Característica 4"],
  "seoKeywords": "palabras clave separadas por comas relevantes para SEO"
}

IMPORTANTE:
- La descripción debe ser convincente y destacar beneficios, no solo características técnicas
- Las características deben ser puntos clave que un comprador querría saber
- Usá lenguaje argentino natural (vos, comprá, etc.)
- Enfocate en lo que hace especial al producto
- Las keywords deben ser relevantes para búsquedas en Argentina

Respondé SOLO con el JSON, sin texto adicional.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpiar el texto para extraer solo el JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No se pudo extraer JSON de la respuesta');
        }

        const suggestions = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            success: true,
            suggestions: {
                description: suggestions.description,
                features: suggestions.features,
                seoKeywords: suggestions.seoKeywords,
            }
        });

    } catch (error: any) {
        console.error('Error optimizando producto con Gemini:', error);
        return NextResponse.json(
            {
                error: 'Error al optimizar producto',
                details: error.message
            },
            { status: 500 }
        );
    }
}
