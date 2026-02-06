"use client";

import { useHolidayTheme } from "@/lib/hooks/useHolidayTheme";
import Link from "next/link";

interface HolidayBannerProps {
    showCTA?: boolean;
    ctaText?: string;
    ctaLink?: string;
}

export default function HolidayBanner({
    showCTA = true,
    ctaText = "Ver Ofertas Especiales",
    ctaLink = "/productos"
}: HolidayBannerProps) {
    const { isActive, holiday, primary, secondary, icon, message } = useHolidayTheme();

    if (!isActive || !holiday) return null;

    return (
        <div
            className="relative py-4 px-6 text-center overflow-hidden"
            style={{
                background: `linear-gradient(to right, ${primary}, ${secondary})`
            }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 10 }).map((_, i) => (
                    <span
                        key={i}
                        className="absolute text-4xl animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        {icon}
                    </span>
                ))}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <p className="text-white font-bold text-sm md:text-base">
                        {message}
                    </p>
                    <span className="text-2xl">{icon}</span>
                </div>

                {showCTA && (
                    <Link
                        href={ctaLink}
                        className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-white/30"
                    >
                        {ctaText}
                    </Link>
                )}
            </div>
        </div>
    );
}
