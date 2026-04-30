import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import CookieConsent from "@/components/shop/CookieConsent";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "BoluShop | Regalos Originales y Tecnología Argentina",
  description: "La tienda #1 de regalos originales, bazar premium y gadgets tecnológicos en Argentina. Envíos a todo el país y cuotas sin interés.",
  keywords: "regalos originales, tecnologia argentina, bazar premium, gadgets, bolushop",
  authors: [{ name: "BoluShop Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416044136120955"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased bg-white text-gray-900`}>
        {children}
        <CookieConsent />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}