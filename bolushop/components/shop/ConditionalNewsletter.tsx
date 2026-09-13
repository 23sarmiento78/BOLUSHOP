"use client";

import { usePathname } from "next/navigation";
import Newsletter from "./Newsletter";

const HIDE_ON = ["/carrito", "/checkout", "/exito", "/rechazado"];

export default function ConditionalNewsletter() {
    const pathname = usePathname();
    if (HIDE_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return null;
    return <Newsletter />;
}
