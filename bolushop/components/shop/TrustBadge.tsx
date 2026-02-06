"use client";

import { useHolidayTheme } from "@/lib/hooks/useHolidayTheme";

interface TrustBadgeProps {
    icon: string;
    title: string;
    description: string;
}

export default function TrustBadge({ icon, title, description }: TrustBadgeProps) {
    const { primary } = useHolidayTheme();

    return (
        <div className="group text-center p-8 rounded-3xl hover:bg-white/50 transition-colors">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 transition-transform duration-500 group-hover:scale-110"
                style={{
                    backgroundColor: `${primary}15`,
                    color: primary
                }}
            >
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {description}
            </p>
        </div>
    );
}
