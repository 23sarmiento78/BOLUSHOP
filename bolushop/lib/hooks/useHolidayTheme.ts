"use client";

import { useState, useEffect } from "react";
import { getCurrentHoliday, HolidayConfig } from "@/lib/holidays";

/**
 * Hook para obtener el tema del feriado actual
 * Útil para aplicar theming consistente en client components
 */
export function useHolidayTheme() {
    const [holiday, setHoliday] = useState<HolidayConfig | null>(null);

    useEffect(() => {
        setHoliday(getCurrentHoliday());
    }, []);

    const defaultColors = {
        primary: '#0F172A',
        secondary: '#D4AF37',
        text: '#FFFFFF',
        gradient: 'from-slate-800 to-slate-900'
    };

    return {
        holiday,
        isActive: !!holiday,
        colors: holiday?.colors || defaultColors,
        gradient: holiday?.colors.gradient || defaultColors.gradient,
        primary: holiday?.colors.primary || defaultColors.primary,
        secondary: holiday?.colors.secondary || defaultColors.secondary,
        message: holiday?.message || '',
        icon: holiday?.icon || '✨',
        label: holiday?.label || ''
    };
}
