import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { getAllProducts } from '@/lib/db';

function detectDelimiter(csvText: string): string {
    const firstLine = csvText.split(/\r?\n/)[0] || '';
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    return semicolonCount > commaCount ? ';' : ',';
}

function parseCsv(csvText: string): { data: Record<string, string>[]; errors: string[] } {
    const delimiter = detectDelimiter(csvText);
    const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter,
    });

    return {
        data: parsed.data,
        errors: parsed.errors.map((error) => error.message),
    };
}

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let rows: Record<string, string>[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('csv') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'Se requiere un archivo CSV adjunto' }, { status: 400 });
            }

            const csvText = await file.text();
            const { data, errors } = parseCsv(csvText);
            if (errors.length > 0) {
                return NextResponse.json({ error: 'Error al parsear CSV', details: errors }, { status: 400 });
            }
            rows = data;
        } else if (contentType.includes('application/json')) {
            const body = await request.json();
            if (!Array.isArray(body.rows)) {
                return NextResponse.json({ error: 'Se requiere un array rows con datos del CSV' }, { status: 400 });
            }
            rows = body.rows;
        } else {
            return NextResponse.json({ error: 'Content-Type no soportado. Enviar JSON o multipart/form-data.' }, { status: 415 });
        }

        const products = await getAllProducts();
        const toProcess: Array<{
            productId: string;
            sku: string;
            name: string;
            slug: string;
            searchUrl: string;
        }> = [];

        for (const row of rows) {
            const sku = String(row['SKU'] ?? row['sku'] ?? '').trim();
            const name = String(row['Nombre'] ?? row['nombre'] ?? '').trim();
            const slug = String(row['Identificador de URL'] ?? row['identificador de URL'] ?? row['slug'] ?? '').trim();

            if (!sku || !name) continue;

            const product = products.find((p) => p.id === sku || p.slug === slug);
            if (!product || product.isActive === false) continue;

            const searchUrl = `https://droppers.com.ar/catalogsearch/result/?q=${encodeURIComponent(name)}`;
            toProcess.push({
                productId: product.id,
                sku,
                name,
                slug: product.slug,
                searchUrl,
            });
        }

        return NextResponse.json({
            success: true,
            items: toProcess,
            total: toProcess.length,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Import Dropers Photos init error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
