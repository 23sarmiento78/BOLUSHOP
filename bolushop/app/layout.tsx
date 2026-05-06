import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { headers } from 'next/headers';
import { getSettings } from "@/lib/db";
import { supabase } from "@/lib/supabase"; // Usaremos el cliente existente
import WhatsAppButton from "@/components/shop/WhatsAppButton";
import CookieConsent from "@/components/shop/CookieConsent";
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

import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com';

  // Lógica de restricción para la PWA: Solo para el administrador logueado
  const headerList = await headers();
  const cookies = headerList.get('cookie') || '';
  const isAllowed = cookies.includes('admin_authenticated=true');

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.siteName} | Tienda de Regalos Originales y Gadgets en Argentina`,
      template: `%s | ${settings.siteName} Regalos`
    },
    description: settings.siteDescription || "¿Buscás el regalo perfecto? En BoluShop encontrá regalos originales, tecnología, gadgets y curiosidades. Envíos gratis a todo el país y cuotas sin interés. ¡Sorprendé hoy!",
    keywords: "regalos originales argentina, tienda de regalos, cosas curiosas, gadgets tecnologicos, regalos para hombres, regalos para novios, comprar regalos online, bolushop, envios a todo el pais, bazar premium",
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
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary",
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
      icon: '/icon.png',
      shortcut: '/favicon.ico',
      apple: '/icon.png',
    },
  };

  // Solo añadir manifiesto e instalar si la IP es la correcta
  if (isAllowed) {
    metadata.manifest = '/manifest.json';
    (metadata as any).themeColor = '#0F172A';
  }

  return metadata;
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
    "logo": `${siteUrl}/icon.png`,
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416044136120955" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.className} antialiased flex flex-col min-h-screen bg-sand-white`}
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
        <CookieConsent />
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
