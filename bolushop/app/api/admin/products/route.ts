import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveProducts, Product } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { products, source } = body;

        let mappedProducts: Product[] = [];

        if (source === 'dropers-csv') {
            mappedProducts = products.map((row: any) => {
                // Parse Price: Handle "1.500,00", "9.327,00", "5000"
                let price = 0;
                let priceRaw = row['Precio'];

                if (priceRaw) {
                    if (typeof priceRaw === 'number') {
                        price = priceRaw;
                    } else if (typeof priceRaw === 'string') {
                        // Remove thousands separator (.) and replace decimal separator (,) with (.)
                        // Example: "9.327,00" -> "9327.00"
                        const cleanPrice = priceRaw.replace(/\./g, '').replace(',', '.');
                        price = parseFloat(cleanPrice);
                    }
                }

                if (isNaN(price)) price = 0;

                const description = row['Descripción'] || '';

                // Fallback image logic
                const image = row['Imagen'] || '/bolushop.png';

                return {
                    id: String(row['SKU'] || uuidv4()),
                    name: row['Nombre'] || 'Sin Nombre',
                    // Slug: use URL identifier if available, otherwise slugify name
                    slug: row['Identificador de URL'] || (row['Nombre'] ? row['Nombre'].toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : uuidv4()),
                    price: price,
                    image: image,
                    category: 'varios',
                    description: description,
                    features: []
                };
            });
        } else {
            // Manual/Default Source
            mappedProducts = products.map((p: any) => ({
                id: p.id ? String(p.id) : uuidv4(),
                name: p.name || 'Sin Nombre',
                slug: p.slug || uuidv4(),
                price: Number(p.price) || 0,
                image: p.image || '/bolushop.png',
                category: p.category || 'otros',
                description: p.description || '',
                features: []
            }));
        }

        // Filter invalid rows
        mappedProducts = mappedProducts.filter(p => p.name && p.name !== 'Sin Nombre' && p.price > 0);

        if (mappedProducts.length > 0) {
            saveProducts(mappedProducts);
            // Revalidate cache to update UI immediately
            revalidatePath('/');
            revalidatePath('/admin');
            revalidatePath('/admin/products');
        }

        return NextResponse.json({ success: true, count: mappedProducts.length });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
