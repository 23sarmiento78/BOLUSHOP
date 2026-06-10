import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { importDropersCsv } from '@/lib/services/dropers-import';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { rows, replaceCatalog = true, skipAi = false, skipDroppersCheck = false } = body;

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'Se requiere un array rows con datos del CSV' }, { status: 400 });
        }

        const result = await importDropersCsv(rows, {
            replaceCatalog,
            skipAi,
            skipDroppersCheck,
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
