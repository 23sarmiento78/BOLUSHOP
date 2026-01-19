import Script from "next/script";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5416044136120955"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
            {children}
        </>
    );
}

