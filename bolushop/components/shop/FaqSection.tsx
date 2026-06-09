import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/faqs";

interface Props {
    faqs: FaqItem[];
    title?: string;
    className?: string;
}

export default function FaqSection({
    faqs,
    title = "Preguntas frecuentes",
    className = "",
}: Props) {
    return (
        <div className={className}>
            <h2
                className="text-xl md:text-2xl font-semibold text-[#0a1628] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {title}
            </h2>
            <div className="space-y-3">
                {faqs.map((item, i) => (
                    <details
                        key={i}
                        className="group rounded-2xl border border-[#e8e4df] bg-[#faf9f7] overflow-hidden"
                    >
                        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#0a1628]">
                            {item.question}
                            <ChevronDown
                                size={16}
                                className="text-[#94a3b8] shrink-0 transition-transform group-open:rotate-180"
                            />
                        </summary>
                        <div className="px-5 pb-4 text-sm text-[#64748b] leading-relaxed border-t border-[#e8e4df] pt-3">
                            {item.answer}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
