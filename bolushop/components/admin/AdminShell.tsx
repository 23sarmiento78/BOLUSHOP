"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === "/admin/login";

    if (isLogin) {
        return <div className="admin-root">{children}</div>;
    }

    return (
        <div className="admin-root admin-shell">
            <AdminSidebar />
            <div className="admin-main">
                <AdminTopbar />
                <div className="admin-content">
                    <div className="max-w-7xl mx-auto pb-16">{children}</div>
                </div>
            </div>
        </div>
    );
}
