export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header Skeleton */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 animate-pulse">
                <div className="space-y-4">
                    <div className="h-12 w-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-6 w-32 bg-gray-100 rounded-xl"></div>
                </div>
                <div className="h-12 w-48 bg-gray-100 rounded-xl"></div>
            </div>

            {/* Filter Skeleton */}
            <div className="mb-8 flex flex-wrap gap-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="h-10 w-24 bg-gray-100 rounded-full"></div>
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-1/2 bg-gray-100 rounded-lg"></div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
