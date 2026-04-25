import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Obtenemos los últimos 20 posts del blog
        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        // Construir XML de RSS
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bolushop.com';

        let rssItems = '';
        posts.forEach(post => {
            rssItems += `
            <item>
                <title><![CDATA[${post.title}]]></title>
                <link>${baseUrl}/blog/${post.slug}</link>
                <description><![CDATA[${post.excerpt || post.content.substring(0, 160)}]]></description>
                <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
                <guid>${baseUrl}/blog/${post.slug}</guid>
                <media:content url="${post.image}" medium="image" xmlns:media="http://search.yahoo.com/mrss/"/>
            </item>`;
        });

        const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
        <channel>
            <title>BoluShop Blog - Social Feed</title>
            <link>${baseUrl}</link>
            <description>Últimos artículos de BoluShop para redes sociales</description>
            ${rssItems}
        </channel>
        </rss>`;

        return new NextResponse(rssFeed, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate'
            }
        });

    } catch (e) {
        return NextResponse.json({ error: 'Error generating feed' }, { status: 500 });
    }
}
