import { getAllProducts } from "@/lib/db";
import { buildGoogleMerchantFeedXml } from "@/lib/google-merchant-feed";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
    const products = await getAllProducts();
    const xml = buildGoogleMerchantFeedXml(products);

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
