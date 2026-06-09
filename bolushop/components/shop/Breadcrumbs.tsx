import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface Props {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
    const jsonLdItems = items.map((item, index) => ({
        name: item.label,
        path: item.href || (index === items.length - 1 ? "" : "/"),
    }));

    return (
        <>
            <JsonLd data={buildBreadcrumbJsonLd(jsonLdItems.filter((i) => i.path))} />
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/60">
                {items.map((item, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                        {index > 0 && <ChevronRight size={12} className="text-white/30" />}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-white transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-white/90">{item.label}</span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    );
}
