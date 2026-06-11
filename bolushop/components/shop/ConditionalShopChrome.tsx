"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";
import CookieConsent from "./CookieConsent";

export default function ConditionalShopChrome() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) return null;

    return (
        <>
            <WhatsAppButton />
            <CookieConsent />
        </>
    );
}
