import { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle, actions }: Props) {
    return (
        <div className="admin-page-header flex flex-col lg:flex-row lg:items-end justify-between">
            <div className="min-w-0">
                <h2 className="admin-page-title">{title}</h2>
                {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
        </div>
    );
}
