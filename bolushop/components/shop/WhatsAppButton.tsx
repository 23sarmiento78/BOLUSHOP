"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const phoneNumber = "5493541237972";
    const message = "Hola BoluShop! Me gustaría realizar una consulta.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 overflow-hidden max-w-[60px] hover:max-w-[200px] duration-500"
        >
            <MessageCircle size={28} className="shrink-0" />
            <span className="font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm">
                WhatsApp 24/7
            </span>
        </a>
    );
}
