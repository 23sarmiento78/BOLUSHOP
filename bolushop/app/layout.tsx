import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { getSettings } from "@/lib/db";
import WhatsAppButton from "@/components/shop/WhatsAppButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.siteName} | Tu Marketplace de Confianza en Argentina`,
      template: `%s | ${settings.siteName}`
    },
    description: settings.siteDescription || "BoluShop es el marketplace líder en Argentina. Comprá con confianza y recibí tus productos con envío gratis a todo el país. Calidad garantizada y los mejores precios del mercado.",
    keywords: "marketplace argentina, comprar online argentina, tienda virtual argentina, envios gratis argentina, bolushop, ofertas argentina, productos importados argentina, compras por internet argentina, mercado pago cuotas, mejores precios argentina",
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: siteUrl,
      title: settings.siteName,
      description: settings.siteDescription,
      siteName: settings.siteName,
      images: [
        {
          url: "/bolushop.png",
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.siteDescription,
      images: ["/bolushop.png"],
    },
    verification: {
      google: "S8huFZQ1-Dj4hDM8duVC_mHJJCZscBb2wk-1SKhNqNw",
    },
    other: {
      "google-adsense-account": "ca-pub-5416044136120955",
    },
    icons: {
      icon: '/icon.png',
      shortcut: '/favicon.ico',
      apple: '/icon.png',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.siteName,
    "url": siteUrl,
    "logo": `${siteUrl}/bolushop.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+54-354-123-7972",
      "contactType": "customer service",
      "areaServed": "AR",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.instagram.com/bolushop.arg",
      "https://www.tiktok.com/@bolushop.ok"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AR"
    }
  };

  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://www.mercadopago.com" />
        <link rel="preconnect" href="https://www.mercadolivre.com" />
        <link rel="preconnect" href="https://www.mercadolibre.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-sand-white`}
      >
        <NextTopLoader
          color="#0F172A"
          showSpinner={false}
          shadow="0 0 10px #0F172A,0 0 5px #0F172A"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-grow">
          {children}
        </main>
        <WhatsAppButton />
        <Toaster position="top-center" richColors />

        <Script
          src="https://www.mercadopago.com/v2/security.js"
          strategy="lazyOnload"
          {...({ view: "checkout" } as any)}
        />
      </body>
    </html>
  );
}
