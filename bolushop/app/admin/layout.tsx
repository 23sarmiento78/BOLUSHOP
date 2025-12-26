import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#f8fafc] min-h-screen flex flex-col lg:flex-row overflow-hidden">
            <AdminNav />
            <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
