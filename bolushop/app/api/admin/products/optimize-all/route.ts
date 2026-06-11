import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { bulkOptimizeProductsForGoogle } from '@/lib/services/bulk-google-optimize';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
    try {
        let force = false;
        try {
            const body = await request.json();
            force = body.force === true;
        } catch {
            // body vacío OK
        }

        const result = await bulkOptimizeProductsForGoogle({ force });

        if (result.success || result.optimized > 0) {
            revalidatePath('/admin/products');
            revalidatePath('/admin');
            revalidatePath('/');
            revalidatePath('/feed.xml');
            revalidatePath('/sitemap.xml');
        }

        const status = result.success ? 200 : result.optimized > 0 ? 207 : 500;
        return NextResponse.json(result, { status });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error interno';
        console.error('Bulk Google optimize error:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
