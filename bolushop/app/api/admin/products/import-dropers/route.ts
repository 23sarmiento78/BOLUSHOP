import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import Papa from 'papaparse';
import { importDropersCsv } from '@/lib/services/dropers-import';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let rows: unknown = [];
        let replaceCatalog = true;
        let skipAi = false;
        let skipDroppersCheck = false;
        let skipImageFetch = false;

        if (contentType.includes('application/json')) {
            const body = await request.json();
            rows = body.rows;
            replaceCatalog = body.replaceCatalog ?? true;
            skipAi = body.skipAi ?? false;
            skipDroppersCheck = body.skipDroppersCheck ?? false;
            skipImageFetch = body.skipImageFetch ?? false;
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('csv') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'Se requiere un archivo CSV adjunto' }, { status: 400 });
            }

            replaceCatalog = formData.get('replaceCatalog') !== 'false';
            skipAi = formData.get('skipAi') === 'true';
            skipDroppersCheck = formData.get('skipDroppersCheck') === 'true';
            skipImageFetch = formData.get('skipImageFetch') === 'true';

            const csvText = await file.text();
            const firstLine = csvText.split(/\r?\n/)[0] || '';
            const semicolonCount = (firstLine.match(/;/g) || []).length;
            const commaCount = (firstLine.match(/,/g) || []).length;
            const delimiter = semicolonCount > commaCount ? ';' : ',';

            const parsed = Papa.parse<Record<string, string>>(csvText, {
                header: true,
                skipEmptyLines: true,
                delimiter,
            });

            if (parsed.errors.length > 0) {
                return NextResponse.json({ error: 'Error al parsear CSV', details: parsed.errors.map((error) => error.message) }, { status: 400 });
            }

            rows = parsed.data;
        } else {
            return NextResponse.json({ error: 'Content-Type no soportado. Enviar JSON o multipart/form-data.' }, { status: 415 });
        }

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'Se requiere un array rows con datos del CSV' }, { status: 400 });
        }

        const result = await importDropersCsv(rows, {
            replaceCatalog,
            skipAi,
            skipDroppersCheck,
            skipImageFetch,
        });

        if (result.success) {
            revalidatePath('/admin/products');
            revalidatePath('/admin');
            revalidatePath('/');
        }

        return NextResponse.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Import dropers error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
