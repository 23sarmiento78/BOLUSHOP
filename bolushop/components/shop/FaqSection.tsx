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
                className="text-xl md:text-2xl font-semibold text-[#11110f] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
            >
                {title}
            </h2>
            <div className="space-y-3">
                {faqs.map((item, i) => (
                    <details
                        key={i}
                        className="group rounded-2xl border border-[#deded4] bg-[#f4f4ed] overflow-hidden"
                    >
                        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#11110f]">
                            {item.question}
                            <ChevronDown
                                size={16}
                                className="text-[#8d9388] shrink-0 transition-transform group-open:rotate-180"
                            />
                        </summary>
                        <div className="px-5 pb-4 text-sm text-[#6d726a] leading-relaxed border-t border-[#deded4] pt-3">
                            {item.answer}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
