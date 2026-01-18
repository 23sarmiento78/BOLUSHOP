import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    variant?: 'full' | 'icon';
}

export default function Logo({ className = "", size = 40, variant = 'full' }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Square Icon with "B" */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6"
            >
                <rect width="100" height="100" rx="25" fill="#0F172A" />
                <path
                    d="M30 25H55C65 25 72 30 72 40C72 48 67 52 60 54C68 56 75 62 75 72C75 84 66 90 52 90H30V25ZM45 42H52C56 42 58 40 58 37C58 34 56 32 52 32H45V42ZM45 78H55C60 78 62 76 62 72C62 68 60 66 55 66H45V78Z"
                    fill="#D4AF37"
                />
            </svg>

            {variant === 'full' && (
                <div className="flex flex-col -gap-1">
                    <span className="font-black text-2xl tracking-tighter leading-none text-current">
                        BoluShop
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">
                        Premium Store
                    </span>
                </div>
            )}
        </div>
    );
}
