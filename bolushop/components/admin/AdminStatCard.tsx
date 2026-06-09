import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    label: string;
    value: ReactNode;
    icon?: LucideIcon;
    accent?: boolean;
    badge?: ReactNode;
}

export default function AdminStatCard({ label, value, icon: Icon, accent, badge }: Props) {
    return (
        <div className={`admin-stat ${accent ? "admin-stat-accent" : ""}`}>
            {Icon && (
                <div className={`absolute top-4 right-4 ${accent ? "opacity-15" : "opacity-[0.06]"}`}>
                    <Icon size={accent ? 56 : 48} className={accent ? "text-[#ff6b35]" : "text-[#0a1628]"} />
                </div>
            )}
            <p className="admin-stat-label">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="admin-stat-value">{value}</p>
                {badge}
            </div>
        </div>
    );
}
