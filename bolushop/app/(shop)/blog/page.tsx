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
    const categories = Array.from(new Set(publishedPosts.map(post => post.category).filter(Boolean)));
    const featuredPost = publishedPosts[0];
    const otherPosts = publishedPosts.slice(1);

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f7f7f7]">
                <section className="bg-gradient-to-br from-[#0f2044] to-[#1a3a6b] text-white py-10 md:py-14 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 mb-4 text-xs text-white/70">
                            <Link href="/" className="hover:text-white">Inicio</Link>
                            <ChevronRight size={14} />
                            <span>Blog</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black mb-3">Guías y recomendaciones</h1>
                        <p className="max-w-3xl text-sm md:text-base text-white/80">
                            Consejos de compra, reviews y listas de regalos para cada ocasión.
                        </p>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="inline-flex items-center rounded-full bg-[#0f2044] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                            Todos
                        </span>
                        {categories.map(category => (
                            <span key={category} className="inline-flex items-center rounded-full bg-[#eef3fb] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#185fa5]">
                                {category}
                            </span>
                        ))}
                    </div>

                    {featuredPost && (
                        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-8">
                            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-stretch">
                                <div className="rounded-[1.75rem] bg-white border border-[#e2e8f0] p-8 shadow-sm hover:shadow-lg transition">
                                    <div className="inline-flex items-center rounded-full bg-[#eef3fb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#185fa5] mb-4">
                                        {featuredPost.category || 'Destacado'}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-[#0f2044] mb-4">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-sm text-[#64748b] leading-relaxed mb-6">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-[11px] text-[#64748b]">
                                        <span>{featuredPost.author || 'BoluShop'}</span>
                                        <span>{new Date(featuredPost.createdAt).toLocaleDateString('es-AR')}</span>
                                        <span>5 min de lectura</span>
                                    </div>
                                </div>
                                <div className="rounded-[1.75rem] overflow-hidden bg-[#eef3fb] border border-[#e2e8f0] shadow-sm">
                                    {featuredPost.image ? (
                                        <div className="relative h-full min-h-[280px]">
                                            <Image
                                                src={transformImageUrl(featuredPost.image)}
                                                alt={featuredPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full min-h-[280px] flex items-center justify-center text-4xl text-[#0f2044]">
                                            📰
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherPosts.map(post => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group"
                            >
                                <div className="card overflow-hidden h-full flex flex-col hover:shadow-lg transition">
                                    <div className="relative bg-[#f8f9fb] overflow-hidden h-44">
                                        {post.image ? (
                                            <Image
                                                src={transformImageUrl(post.image)}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#eef3fb] to-[#dde8f5] flex items-center justify-center text-3xl">
                                                📰
                                            </div>
                                        )}
                                        {post.category && (
                                            <div className="absolute top-3 left-3 bg-white/90 text-[#185fa5] text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                                {post.category}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-[#0f2044] mb-3 line-clamp-2 group-hover:text-[#e8630a] transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-[#64748b] line-clamp-3 flex-1 mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                                            <span>{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
                                            <span className="font-semibold text-[#0f2044]">Leer →</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="bg-[#f8fafb] border-t border-[#e2e8f0] py-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-[#64748b]">Mostrando {publishedPosts.length} artículos</span>
                        <button className="btn btn-outline">Cargar más artículos</button>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
