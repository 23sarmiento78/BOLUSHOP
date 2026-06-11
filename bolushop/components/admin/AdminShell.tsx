"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === "/admin/login";
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
    const openMobileNav = useCallback(() => setMobileNavOpen(true), []);

    if (isLogin) {
        return <div className="admin-root">{children}</div>;
    }

    return (
        <div className="admin-root admin-shell">
            <AdminSidebar mobileOpen={mobileNavOpen} onMobileClose={closeMobileNav} />
            <div className="admin-main">
                <AdminTopbar onMenuOpen={openMobileNav} />
                <div className="admin-content">
                    <div className="admin-content-inner">{children}</div>
                </div>
            </div>
        </div>
    );
}
