import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    size?: number;
    variant?: 'full' | 'icon';
}

export default function Logo({ className = "", size = 40, variant = 'full' }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/icon.png"
                alt="BoluShop: Regalos Originales y Tecnología"
                width={size}
                height={size}
                className="shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6 rounded-xl"
            />

            {variant === 'full' && (
                <div className="flex flex-col -gap-1">
                    <span className={`font-bold text-2xl tracking-tighter leading-none ${className.includes('text-white') ? 'text-white' : 'text-[#0F172A]'}`}>
                        Bolu
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${className.includes('text-white') ? 'text-white/60' : 'text-[#0F172A]/60'}`}>
                        Regalería & Gadgets
                    </span>
                </div>
            )}
        </div>
    );
}
