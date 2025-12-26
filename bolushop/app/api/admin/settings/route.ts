import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';

export async function GET() {
    try {
        const settings = getSettings();
        return NextResponse.json({ settings });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const success = saveSettings(body);
        if (success) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
