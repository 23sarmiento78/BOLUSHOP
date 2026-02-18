"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { HolidayConfig } from "@/lib/holidays";

interface CountdownProps {
    holiday: HolidayConfig;
}

export default function HolidayCountdown({ holiday }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const currentYear = now.getFullYear();

            // Target date is the END day of the holiday (e.g., Feb 15 for Valentine's)
            const targetDate = new Date(currentYear, holiday.endMonth, holiday.endDay, 23, 59, 59);

            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

                setTimeLeft({ days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [holiday]);

    return (
        <section className="relative z-10 -mt-10 mb-12 container mx-auto px-4">
            <div
                className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mx-auto max-w-4xl border-2"
                style={{
                    backgroundColor: holiday.colors.primary,
                    borderColor: holiday.colors.secondary
                }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-4xl animate-bounce">{holiday.icon}</span>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm opacity-90">
                            Tiempo Restante para
                        </h3>
                        <p className="text-2xl md:text-3xl font-black text-white">{holiday.label}</p>
                    </div>
                </div>

                <div className="flex gap-4 text-center">
                    {[
                        { value: timeLeft.days, label: 'Días' },
                        { value: timeLeft.hours, label: 'Hs' },
                        { value: timeLeft.minutes, label: 'Min' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <div
                                className="font-black text-2xl md:text-4xl w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: 'white', color: holiday.colors.primary }}
                            >
                                {String(item.value).padStart(2, '0')}
                            </div>
                            <span className="text-[10px] uppercase font-bold text-white mt-1 tracking-widest opacity-90">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <Link
                    href="/colecciones"
                    className="px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-transform hover:scale-105 shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: 'white', color: holiday.colors.primary }}
                >
                    Ver Regalos
                </Link>
            </div>
        </section>
    );
}
