import type { Product } from "./types";
import { absoluteUrl, SITE_NAME, SITE_URL } from "./seo";
import { transformImageUrl } from "./images";

const GOOGLE_CATEGORY_MAP: Record<string, string> = {
    hogar: "Home & Garden",
    organizacion: "Home & Garden > Household Organization",
    oficina: "Office Products",
    bano: "Home & Garden > Bathroom Accessories",
    limpieza: "Home & Garden > Household Supplies",
    regalos: "Arts & Entertainment > Gift Giving",
    tech: "Electronics",
    juegos: "Toys & Games",
    cocina: "Home & Garden > Kitchen & Dining",
    varios: "Home & Garden",
    telefonos: "Electronics > Communications > Telephony > Mobile Phone Accessories",
};

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function cleanText(html: string, maxLength = 5000): string {
    return html
        .replace(/<[^>]*>?/gm, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function absoluteImageUrl(image: string): string {
    const transformed = transformImageUrl(image);
    if (transformed.startsWith("http")) return transformed;
    return absoluteUrl(transformed);
}

function formatPrice(price: number): string {
    return `${price.toFixed(2)} ARS`;
}

function getGoogleCategory(product: Product): string {
    const key = product.category.toLowerCase();
    return GOOGLE_CATEGORY_MAP[key] || "Home & Garden";
}

export function getMerchantFeedProducts(products: Product[]): Product[] {
    return products.filter(
        (p) =>
            p.isActive !== false &&
            !p.isMlReferral &&
            p.price > 0 &&
            p.stock > 0 &&
            Boolean(p.image)
    );
}

export function buildGoogleMerchantFeedXml(products: Product[]): string {
    const eligible = getMerchantFeedProducts(products);

    const items = eligible
        .map((product) => {
            const description =
                cleanText(product.description, 5000) ||
                `${product.name} — comprá online en ${SITE_NAME} con envío gratis a todo Argentina.`;

            const additionalImages = (product.images || [])
                .filter((img) => img && img !== product.image)
                .slice(0, 10)
                .map((img) => `<g:additional_image_link>${escapeXml(absoluteImageUrl(img))}</g:additional_image_link>`)
                .join("\n      ");

            return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name.slice(0, 150))}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(absoluteUrl(`/producto/${product.slug}`))}</g:link>
      <g:image_link>${escapeXml(absoluteImageUrl(product.image))}</g:image_link>
      ${additionalImages}
      <g:availability>in stock</g:availability>
      <g:price>${formatPrice(product.price)}</g:price>
      <g:brand>${escapeXml(SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(getGoogleCategory(product))}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      <g:identifier_exists>false</g:identifier_exists>
      <g:shipping>
        <g:country>AR</g:country>
        <g:service>Estándar</g:service>
        <g:price>0.00 ARS</g:price>
      </g:shipping>
    </item>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Product Feed</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Catálogo de productos de ${escapeXml(SITE_NAME)} para Google Merchant Center</description>
    <language>es-AR</language>
${items}
  </channel>
</rss>`;
}
