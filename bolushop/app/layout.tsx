import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { headers } from "next/headers";
import { getSettings } from "@/lib/db";
import WhatsAppButton from "@/components/shop/WhatsAppButton";
import CookieConsent from "@/components/shop/CookieConsent";
import JsonLd from "@/components/shop/JsonLd";
import {
    buildWebSiteJsonLd,
    buildOrganizationJsonLd,
    buildOnlineStoreJsonLd,
    SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jakarta",
});

const fraunces = Fraunces({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-fraunces",
});

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSettings();
    const headerList = await headers();
    const cookies = headerList.get("cookie") || "";
    const isAllowed = cookies.includes("admin_authenticated=true");

    const metadata: Metadata = {
        metadataBase: new URL(SITE_URL),
        title: {
            default: `${settings.siteName} | Regalos Originales y Hogar en Argentina`,
            template: `%s | ${settings.siteName}`,
        },
        description:
            settings.siteDescription ||
            "Regalos originales y accesorios para el hogar en Argentina. Envío gratis, cuotas sin interés y compra 100% protegida.",
        keywords: [
            "regalos originales argentina",
            "tienda de regalos online",
            "accesorios hogar",
            "gadgets argentina",
            "bolushop",
            "envio gratis argentina",
            "regalos villa carlos paz",
            "comprar regalos cordoba",
        ],
        authors: [{ name: settings.siteName, url: SITE_URL }],
        creator: settings.siteName,
        publisher: settings.siteName,
        robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
        alternates: { canonical: SITE_URL },
        openGraph: {
            type: "website",
            locale: "es_AR",
            url: SITE_URL,
            title: `${settings.siteName} | Regalos Originales y Hogar`,
            description: settings.siteDescription,
            siteName: settings.siteName,
            images: [{ url: "/icon.png", width: 512, height: 512, alt: settings.siteName }],
        },
        twitter: {
            card: "summary_large_image",
            title: settings.siteName,
            description: settings.siteDescription,
            images: ["/icon.png"],
        },
        verification: {
            google: "S8huFZQ1-Dj4hDM8duVC_mHJJCZscBb2wk-1SKhNqNw",
        },
        other: {
            "google-adsense-account": "ca-pub-5416044136120955",
        },
        icons: {
            icon: "/icon.png",
            shortcut: "/favicon.ico",
            apple: "/icon.png",
        },
    };

    if (isAllowed) {
        metadata.manifest = "/manifest.json";
    }

    return metadata;
}

export async function generateViewport(): Promise<Viewport> {
    const headerList = await headers();
    const cookies = headerList.get("cookie") || "";
    const isAllowed = cookies.includes("admin_authenticated=true");

    return {
        width: "device-width",
        initialScale: 1,
        themeColor: isAllowed ? "#0a1628" : "#faf9f7",
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettings();

    const structuredData = [
        buildWebSiteJsonLd(),
        buildOrganizationJsonLd(settings),
        buildOnlineStoreJsonLd(settings),
    ];

    return (
        <html lang="es-AR">
            <head>
                <link rel="preconnect" href="https://www.mercadopago.com" />
                <link rel="preconnect" href="https://www.mercadolibre.com" />
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416044136120955"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={`${jakarta.variable} ${fraunces.variable} antialiased flex flex-col min-h-screen`}>
                <JsonLd data={structuredData} />
                <NextTopLoader color="#ff6b35" showSpinner={false} shadow="0 0 10px #ff6b35,0 0 5px #ff6b35" />
                <main className="flex-grow">{children}</main>
                <WhatsAppButton />
                <CookieConsent />
                <Toaster position="top-center" richColors />
                <Script
                    src="https://www.mercadopago.com/v2/security.js"
                    strategy="lazyOnload"
                    {...({ view: "checkout" } as Record<string, string>)}
                />
            </body>
        </html>
    );
}
