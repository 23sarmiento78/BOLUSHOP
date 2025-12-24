import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <AdminNav />
            {children}
        </div>
    );
}
