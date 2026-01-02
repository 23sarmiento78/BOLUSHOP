import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Script from "next/script";
import NextTopLoader from 'nextjs-toploader';
import { getSettings } from "@/lib/db";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com.ar';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.siteName} | Tu Marketplace de Confianza en Argentina`,
      template: `%s | ${settings.siteName}`
    },
    description: settings.siteDescription,
    keywords: "marketplace, tienda virtual, argentina, compras online, envios gratis, bolushop, calidad garantizada, mejores precios",
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bolushop.com.ar';

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
    ]
  };

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-sand-white`}
      >
        <NextTopLoader
          color="#EAB308"
          showSpinner={false}
          shadow="0 0 10px #EAB308,0 0 5px #EAB308"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex-grow">
          {children}
        </main>
        <Script
          src="https://www.mercadopago.com/v2/security.js"
          {...({ view: "checkout" } as any)}
        />
      </body>
    </html>
  );
}
