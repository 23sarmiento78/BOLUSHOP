
export type HolidayType = 'none' | 'valentines' | 'carnival' | 'easter' | 'hotsale' | 'father' | 'friend' | 'child' | 'mother' | 'cybermonday' | 'christmas' | 'newyear';

export interface HolidayConfig {
    id: HolidayType;
    label: string;
    startMonth: number; // 0-11 (Jan-Dec)
    startDay: number;
    endMonth: number;
    endDay: number;
    colors: {
        primary: string; // Backgrounds, buttons
        secondary: string; // Accents
        text: string;
        gradient: string;
    };
    icon: string; // Emoji or icon name
    message: string; // Marketing tagline
    image?: string; // Background image URL
}

export const HOLIDAYS: HolidayConfig[] = [
    {
        id: 'valentines',
        label: 'San Valentín (14 Feb)',
        startMonth: 1, // Feb
        startDay: 1,
        endMonth: 1,
        endDay: 15,
        colors: {
            primary: '#ff4d79',
            secondary: '#ffe6ea',
            text: '#fff',
            gradient: 'from-pink-500 to-rose-600'
        },
        icon: '💘',
        message: '¡Enamorate de estos regalos!',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'carnival',
        label: 'Carnaval',
        startMonth: 1, // Feb (variable, but setting a range)
        startDay: 16,
        endMonth: 2, // Mar
        endDay: 5,
        colors: {
            primary: '#8e44ad',
            secondary: '#f39c12',
            text: '#fff',
            gradient: 'from-purple-600 via-pink-500 to-yellow-500'
        },
        icon: '🎭',
        message: '¡Alegría y color para vos!',
        image: 'https://images.unsplash.com/photo-1549497746-b6058b76ce83?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'easter',
        label: 'Pascuas',
        startMonth: 2, // March
        startDay: 20,
        endMonth: 3, // April
        endDay: 15,
        colors: {
            primary: '#f1c40f',
            secondary: '#fff3cd',
            text: '#856404',
            gradient: 'from-yellow-400 to-orange-300'
        },
        icon: '🐰',
        message: '¡Regalos dulces y especiales!',
        image: 'https://images.unsplash.com/photo-1585141634863-7eb6bc2fa373?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'hotsale',
        label: 'Hot Sale 🔥',
        startMonth: 4, // May
        startDay: 10,
        endMonth: 4,
        endDay: 20,
        colors: {
            primary: '#ff3f34',
            secondary: '#ffaaa5',
            text: '#fff',
            gradient: 'from-red-600 to-orange-600'
        },
        icon: '🔥',
        message: '¡Precios que arden!',
        image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop'
    },
    {
        id: 'father',
        label: 'Día del Padre',
        startMonth: 5, // June
        startDay: 1,
        endMonth: 5,
        endDay: 20,
        colors: {
            primary: '#2c3e50',
            secondary: '#ecf0f1',
            text: '#fff',
            gradient: 'from-slate-800 to-blue-900'
        },
        icon: '👔',
        message: 'Papá se merece lo mejor',
        image: 'https://images.unsplash.com/photo-1496345647035-933e336e12aa?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'friend',
        label: 'Día del Amigo',
        startMonth: 6, // July
        startDay: 10,
        endMonth: 6,
        endDay: 21,
        colors: {
            primary: '#3498db',
            secondary: '#d6eaf8',
            text: '#fff',
            gradient: 'from-blue-400 to-cyan-500'
        },
        icon: '🤜🤛',
        message: 'Regalos para tu mejor partner',
        image: 'https://images.unsplash.com/photo-1543807535-adece90d5b48?q=80&w=2069&auto=format&fit=crop'
    },
    {
        id: 'child',
        label: 'Día de la Niñez',
        startMonth: 7, // August
        startDay: 1,
        endMonth: 7,
        endDay: 20,
        colors: {
            primary: '#e67e22',
            secondary: '#fad7a0',
            text: '#fff',
            gradient: 'from-orange-400 to-yellow-400'
        },
        icon: '🧸',
        message: '¡Diversión asegurada!',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'mother',
        label: 'Día de la Madre',
        startMonth: 9, // Oct
        startDay: 1,
        endMonth: 9,
        endDay: 20,
        colors: {
            primary: '#d63384',
            secondary: '#f8d7da',
            text: '#fff',
            gradient: 'from-pink-500 to-rose-400'
        },
        icon: '💐',
        message: 'Mamá se merece todo',
        image: 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'cybermonday',
        label: 'Cyber Monday 💻',
        startMonth: 10, // Nov
        startDay: 1,
        endMonth: 10,
        endDay: 10,
        colors: {
            primary: '#6f42c1',
            secondary: '#e0cffc',
            text: '#fff',
            gradient: 'from-violet-600 to-indigo-600'
        },
        icon: '💻',
        message: '¡Tecnología al mejor precio!',
        image: 'https://images.unsplash.com/photo-1516245834210-c4c14278733f?q=80&w=2069&auto=format&fit=crop'
    },
    {
        id: 'christmas',
        label: 'Navidad',
        startMonth: 11, // Dec
        startDay: 8,
        endMonth: 11,
        endDay: 25,
        colors: {
            primary: '#198754',
            secondary: '#d1e7dd',
            text: '#fff',
            gradient: 'from-green-600 to-emerald-800'
        },
        icon: '🎄',
        message: '¡La magia de regalar!',
        image: 'https://images.unsplash.com/photo-1512389142860-9c449ecd9139?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'newyear',
        label: 'Año Nuevo',
        startMonth: 11, // Dec
        startDay: 26,
        endMonth: 0, // Jan
        endDay: 6, // Reyes
        colors: {
            primary: '#ffd700',
            secondary: '#fff3cd',
            text: '#000',
            gradient: 'from-yellow-400 via-amber-200 to-yellow-500'
        },
        icon: '🥂',
        message: '¡Empezá el año con todo!',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2069&auto=format&fit=crop'
    }
];

export function getCurrentHoliday(): HolidayConfig | null {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    return HOLIDAYS.find(h => {
        if (h.startMonth === h.endMonth) {
            return month === h.startMonth && day >= h.startDay && day <= h.endDay;
        } else {
            // Span across months (e.g. New Year Dec-Jan)
            if (month === h.startMonth && day >= h.startDay) return true;
            if (month === h.endMonth && day <= h.endDay) return true;
            return false;
        }
    }) || null;
}

export function getHolidayById(id: string): HolidayConfig | undefined {
    return HOLIDAYS.find(h => h.id === id);
}
