import { getAllPosts } from "@/lib/db";
import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import Image from "next/image";
import Link from "next/link";
import { transformImageUrl } from "@/lib/images";
import { ChevronRight } from "lucide-react";

export const metadata = {
    title: "Blog | BoluShop Argentina",
    description: "Guías, tips y recomendaciones sobre regalos, hogar y tecnología.",
};

export default async function BlogPage() {
    const posts = await getAllPosts();
    const publishedPosts = posts.filter(p => p.isPublished);

    return (
        <>
            <Header />

            <main className="min-h-screen bg-white">
                {/* Page Header */}
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-8 md:py-12 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-300">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Blog</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog de BoluShop</h1>
                        <p className="text-sm md:text-base text-gray-300">
                            Guías, tips y recomendaciones sobre regalos, hogar y tecnología
                        </p>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    {publishedPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-[#64748b] text-sm">No hay artículos publicados todavía</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {publishedPosts.map(post => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group"
                                >
                                    <div className="card overflow-hidden h-full flex flex-col hover:shadow-lg">
                                        {/* Image */}
                                        <div className="relative bg-[#f8f9fb] overflow-hidden h-40 md:h-48">
                                            {post.image ? (
                                                <Image
                                                    src={transformImageUrl(post.image)}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#eef3fb] to-[#dde8f5] flex items-center justify-center text-2xl">
                                                    📰
                                                </div>
                                            )}
                                            {post.category && (
                                                <div className="absolute top-3 left-3 bg-white/90 text-[#185fa5] text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                                    {post.category}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-sm md:text-base font-bold text-[#0f2044] mb-2 line-clamp-2 group-hover:text-[#e8630a] transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-xs text-[#64748b] line-clamp-2 flex-1 mb-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                                                <span className="text-xs text-[#64748b]">
                                                    {new Date(post.createdAt).toLocaleDateString('es-AR')}
                                                </span>
                                                <span className="text-xs font-bold text-[#0f2044] group-hover:text-[#e8630a] transition-colors">
                                                    Leer →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </>
    );
}
